package backend.example.backend.module.schedule.dto;

import backend.example.backend.module.doctor.dto.DoctorResponse;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkScheduleResponse {
    Long id;
    DoctorResponse doctor;
    LocalDate workDate;
    LocalTime startTime;
    LocalTime endTime;
    List<ScheduleSlotResponse> slots;
}
