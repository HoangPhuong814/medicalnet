package backend.example.backend.module.appointment;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.appointment.dto.AppointmentCreateRequest;
import backend.example.backend.module.appointment.dto.AppointmentResponse;
import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.schedule.ScheduleSlot;
import backend.example.backend.module.schedule.ScheduleSlotRepository;
import backend.example.backend.module.schedule.WorkSchedule;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppointmentService {

    AppointmentRepository appointmentRepository;
    ScheduleSlotRepository scheduleSlotRepository;
    UserRepository userRepository;
    AppointmentMapper appointmentMapper;
    EntityManager entityManager;

    @Transactional
    public AppointmentResponse createAppointment(AppointmentCreateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ScheduleSlot slot = scheduleSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new AppException(ErrorCode.SLOT_NOT_FOUND));

        // Kích hoạt Optimistic Lock trên Slot: bất kỳ giao dịch nào cùng tranh slot này
        entityManager.lock(slot, LockModeType.OPTIMISTIC_FORCE_INCREMENT);

        WorkSchedule schedule = slot.getWorkSchedule();

        if (schedule.getWorkDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.INVALID_TIME_RANGE);
        }

        boolean isBooked = appointmentRepository.existsBySlotIdAndStatusIn(
                slot.getId(),
                List.of(AppointmentStatus.PENDING_PAYMENT, AppointmentStatus.CONFIRMED)
        );
        if (isBooked) {
            throw new AppException(ErrorCode.SLOT_ALREADY_BOOKED);
        }

        Doctor doctor = schedule.getDoctor();

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .slot(slot)
                .status(AppointmentStatus.CONFIRMED)
                .reason(request.getReason())
                .fee(doctor.getConsultationFee())
                .build();

        return appointmentMapper.toAppointmentResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Appointment> appointments = appointmentRepository
                .findAllByPatientIdOrderByCreatedAtDesc(patient.getId());

        return appointmentMapper.toListAppointmentResponse(appointments);
    }


    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public List<AppointmentResponse> getDoctorAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository
                .findAllByDoctorIdOrderByCreatedAtDesc(doctorId);

        return appointmentMapper.toListAppointmentResponse(appointments);
    }


    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));

        if (!isAdmin && !appointment.getPatient().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }
}

