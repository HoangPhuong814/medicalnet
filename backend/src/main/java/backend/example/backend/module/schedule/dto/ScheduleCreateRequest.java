package backend.example.backend.module.schedule.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleCreateRequest {
    @NotNull
    Long doctorId;
    @NotNull
    LocalDate workDate;
    @NotNull
    LocalTime startTime;
    @NotNull
    LocalTime endTime;
    Integer slotDurationMinutes;
}
