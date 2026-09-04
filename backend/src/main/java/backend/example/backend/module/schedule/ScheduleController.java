package backend.example.backend.module.schedule;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.schedule.dto.ScheduleCreateRequest;
import backend.example.backend.module.schedule.dto.WorkScheduleResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScheduleController {
    ScheduleService scheduleService;
    @PostMapping("/create")
    public ApiResponse<WorkScheduleResponse> createSchedule(@RequestBody @Valid ScheduleCreateRequest request) {
        return ApiResponse.<WorkScheduleResponse>builder()
                .result(scheduleService.createSchedule(request))
                .build();
    }

    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<WorkScheduleResponse> getScheduleByDoctorAndDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.<WorkScheduleResponse>builder()
                .result(scheduleService.getScheduleByDoctorAndDate(doctorId, date))
                .build();
    }

    @GetMapping("/doctor/{doctorId}/upcoming")
    public ApiResponse<List<WorkScheduleResponse>> getUpcomingSchedules(@PathVariable Long doctorId) {
        return ApiResponse.<List<WorkScheduleResponse>>builder()
                .result(scheduleService.getUpcomingSchedules(doctorId))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ApiResponse.<Void>builder()
                .message("Schedule deleted successfully")
                .build();
    }
}