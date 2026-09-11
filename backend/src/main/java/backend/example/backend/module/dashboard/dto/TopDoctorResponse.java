package backend.example.backend.module.dashboard.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopDoctorResponse {
    Long doctorId;
    String doctorName;
    String specialityName;
    long totalAppointments;
    double averageRating;
}
