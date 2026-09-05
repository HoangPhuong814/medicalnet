package backend.example.backend.module.appointment.dto;

import backend.example.backend.module.appointment.AppointmentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentResponse {
    Long id;

    Long slotId;
    LocalDate appointmentDate;
    LocalTime startTime;
    LocalTime endTime;

    Long doctorId;
    String doctorName;
    String specialityName;
    String clinicAddress;

    String patientId;
    String patientName;
    String patientEmail;

    AppointmentStatus status;
    String reason;
    BigDecimal fee;
    LocalDateTime createdAt;
}
