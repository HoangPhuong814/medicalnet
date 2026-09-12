package backend.example.backend.module.dashboard;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.appointment.Appointment;
import backend.example.backend.module.appointment.AppointmentMapper;
import backend.example.backend.module.appointment.AppointmentRepository;
import backend.example.backend.module.appointment.AppointmentStatus;
import backend.example.backend.module.appointment.dto.AppointmentResponse;
import backend.example.backend.module.dashboard.dto.*;
import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.doctor.DoctorRepository;
import backend.example.backend.module.review.ReviewRepository;
import backend.example.backend.module.speciality.Speciality;
import backend.example.backend.module.speciality.SpecialityRepository;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {

    DoctorRepository doctorRepository;
    UserRepository userRepository;
    AppointmentRepository appointmentRepository;
    SpecialityRepository specialityRepository;
    ReviewRepository reviewRepository;
    AppointmentMapper appointmentMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardResponse getAdminDashboard(Integer year) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();

        // KPI
        long totalDoctors = doctorRepository.count();
        long totalPatients = userRepository.countPatients();
        long totalAppointments = appointmentRepository.count();
        BigDecimal totalRevenue = appointmentRepository.calculateTotalSystemRevenue();

        long confirmed = appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long completed = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long cancelled = appointmentRepository.countByStatus(AppointmentStatus.CANCELLED);

        LocalDate startDate = LocalDate.of(targetYear, 1, 1);
        LocalDate endDate = LocalDate.of(targetYear, 12, 31);
        List<Appointment> yearlyAppointments = appointmentRepository.findAllByWorkDateBetween(startDate,
                endDate);

        Map<Integer, List<Appointment>> appointmentsByMonth = yearlyAppointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getSlot().getWorkSchedule().getWorkDate().getMonthValue()));

        List<MonthlyStatResponse> monthlyStats = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            List<Appointment> monthList = appointmentsByMonth.getOrDefault(m, Collections.emptyList());
            long count = monthList.size();
            BigDecimal revenue = monthList.stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                    .map(a -> a.getFee() != null ? a.getFee() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            monthlyStats.add(MonthlyStatResponse.builder()
                    .month(m)
                    .appointmentCount(count)
                    .revenue(revenue)
                    .build());
        }

        // Top 5
        List<Doctor> allDoctors = doctorRepository.findAll();
        List<TopDoctorResponse> topDoctors = allDoctors.stream()
                .map(doc -> {
                    long count = appointmentRepository.countByDoctorId(doc.getId());
                    Double avg = reviewRepository.calculateAverageRatingByDoctorId(doc.getId());
                    double roundedRating = BigDecimal.valueOf(avg != null ? avg : 0.0)
                            .setScale(1, RoundingMode.HALF_UP).doubleValue();

                    return TopDoctorResponse.builder()
                            .doctorId(doc.getId())
                            .doctorName(doc.getUser() != null ? doc.getUser().getFullName()
                                    : "N/A")
                            .specialityName(doc.getSpeciality() != null
                                    ? doc.getSpeciality().getName()
                                    : "N/A")
                            .totalAppointments(count)
                            .averageRating(roundedRating)
                            .build();
                })
                .sorted((d1, d2) -> Long.compare(d2.getTotalAppointments(), d1.getTotalAppointments()))
                .limit(5)
                .toList();

        List<Speciality> specialities = specialityRepository.findAll();
        List<SpecialityDistributionResponse> specialityStats = specialities.stream()
                .map(spec -> {
                    long count = yearlyAppointments.stream()
                            .filter(a -> a.getDoctor().getSpeciality() != null &&
                                    a.getDoctor().getSpeciality().getId()
                                            .equals(spec.getId()))
                            .count();

                    return SpecialityDistributionResponse.builder()
                            .specialityId(spec.getId())
                            .specialityName(spec.getName())
                            .appointmentCount(count)
                            .build();
                })
                .sorted((s1, s2) -> Long.compare(s2.getAppointmentCount(), s1.getAppointmentCount()))
                .toList();

        return AdminDashboardResponse.builder()
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .totalAppointments(totalAppointments)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .confirmedAppointments(confirmed)
                .completedAppointments(completed)
                .cancelledAppointments(cancelled)
                .selectedYear(targetYear)
                .monthlyStats(monthlyStats)
                .topDoctors(topDoctors)
                .specialityStats(specialityStats)
                .build();
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorDashboardResponse getDoctorDashboard(Integer year) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();

        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Doctor doctor = doctorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.DOCTOR_NOT_EXISTED));

        Long doctorId = doctor.getId();
        LocalDate today = LocalDate.now();

        // KPI
        long totalAppointments = appointmentRepository.countByDoctorId(doctorId);
        long todayAppointments = appointmentRepository.countTodayAppointmentsByDoctorId(doctorId, today);
        long completed = appointmentRepository.countByDoctorIdAndStatus(doctorId, AppointmentStatus.COMPLETED);
        long cancelled = appointmentRepository.countByDoctorIdAndStatus(doctorId, AppointmentStatus.CANCELLED);
        BigDecimal earnings = appointmentRepository.calculateDoctorTotalRevenue(doctorId);

        // Reviews
        Double avgRating = reviewRepository.calculateAverageRatingByDoctorId(doctorId);
        double roundedRating = BigDecimal.valueOf(avgRating != null ? avgRating : 0.0)
                .setScale(1, RoundingMode.HALF_UP).doubleValue();
        long totalReviews = reviewRepository.countByDoctorId(doctorId);

        // 12 months
        LocalDate startDate = LocalDate.of(targetYear, 1, 1);
        LocalDate endDate = LocalDate.of(targetYear, 12, 31);
        List<Appointment> yearlyAppointments = appointmentRepository
                .findAllByDoctorIdAndWorkDateBetween(doctorId, startDate, endDate);

        Map<Integer, List<Appointment>> appointmentsByMonth = yearlyAppointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getSlot().getWorkSchedule().getWorkDate().getMonthValue()));

        List<MonthlyStatResponse> monthlyStats = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            List<Appointment> monthList = appointmentsByMonth.getOrDefault(m, Collections.emptyList());
            long count = monthList.size();
            BigDecimal monthEarnings = monthList.stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                    .map(a -> a.getFee() != null ? a.getFee() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            monthlyStats.add(MonthlyStatResponse.builder()
                    .month(m)
                    .appointmentCount(count)
                    .revenue(monthEarnings)
                    .build());
        }

        List<Appointment> todayList = appointmentRepository.findTodayAppointmentsByDoctorId(doctorId, today);
        List<AppointmentResponse> todayAppointmentResponses = appointmentMapper
                .toListAppointmentResponse(todayList);

        return DoctorDashboardResponse.builder()
                .doctorId(doctorId)
                .doctorName(currentUser.getFullName())
                .specialityName(doctor.getSpeciality() != null ? doctor.getSpeciality().getName()
                        : "N/A")
                .totalAppointments(totalAppointments)
                .todayAppointments(todayAppointments)
                .completedAppointments(completed)
                .cancelledAppointments(cancelled)
                .totalEarnings(earnings != null ? earnings : BigDecimal.ZERO)
                .averageRating(roundedRating)
                .totalReviews(totalReviews)
                .selectedYear(targetYear)
                .monthlyStats(monthlyStats)
                .todayAppointmentsList(todayAppointmentResponses)
                .build();
    }
}
