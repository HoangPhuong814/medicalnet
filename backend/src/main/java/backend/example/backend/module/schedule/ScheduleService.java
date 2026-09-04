package backend.example.backend.module.schedule;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.doctor.DoctorRepository;
import backend.example.backend.module.schedule.dto.ScheduleCreateRequest;
import backend.example.backend.module.schedule.dto.WorkScheduleResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScheduleService {

    WorkScheduleRepository workScheduleRepository;
    DoctorRepository doctorRepository;
    ScheduleMapper scheduleMapper;

    // Thời lượng mặc định nếu request không truyền (30 phút)
    static final int DEFAULT_SLOT_DURATION = 30;

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public WorkScheduleResponse createSchedule(ScheduleCreateRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new AppException(ErrorCode.INVALID_TIME_RANGE);
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new AppException(ErrorCode.DOCTOR_NOT_EXISTED));

        if (workScheduleRepository.existsByDoctorIdAndWorkDate(doctor.getId(), request.getWorkDate())) {
            throw new AppException(ErrorCode.SCHEDULE_EXISTED);
        }

        WorkSchedule schedule = WorkSchedule.builder()
                .doctor(doctor)
                .workDate(request.getWorkDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        int duration = (request.getSlotDurationMinutes() != null && request.getSlotDurationMinutes() > 0)
                ? request.getSlotDurationMinutes()
                : DEFAULT_SLOT_DURATION;

        List<ScheduleSlot> slots = new ArrayList<>();
        LocalTime current = request.getStartTime();

        while (current.isBefore(request.getEndTime())) {
            LocalTime next = current.plusMinutes(duration);
            if (next.isAfter(request.getEndTime())) {
                break;
            }

            ScheduleSlot slot = ScheduleSlot.builder()
                    .workSchedule(schedule)
                    .startTime(current)
                    .endTime(next)
                    .build();

            slots.add(slot);
            current = next;
        }

        schedule.setSlots(slots);

        return scheduleMapper.toWorkScheduleResponse(workScheduleRepository.save(schedule));
    }

    public WorkScheduleResponse getScheduleByDoctorAndDate(Long doctorId, LocalDate workDate) {
        WorkSchedule schedule = workScheduleRepository.findByDoctorIdAndWorkDate(doctorId, workDate)
                .orElseThrow(() -> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));

        return scheduleMapper.toWorkScheduleResponse(schedule);
    }

    public List<WorkScheduleResponse> getUpcomingSchedules(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new AppException(ErrorCode.DOCTOR_NOT_EXISTED);
        }

        List<WorkSchedule> schedules = workScheduleRepository
                .findAllByDoctorIdAndWorkDateGreaterThanEqual(doctorId, LocalDate.now());

        return scheduleMapper.toListWorkScheduleResponse(schedules);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSchedule(Long scheduleId) {
        if (!workScheduleRepository.existsById(scheduleId)) {
            throw new AppException(ErrorCode.SCHEDULE_NOT_FOUND);
        }

        workScheduleRepository.deleteById(scheduleId);
    }
}
