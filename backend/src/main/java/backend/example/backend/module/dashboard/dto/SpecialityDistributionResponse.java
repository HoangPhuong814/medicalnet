package backend.example.backend.module.dashboard.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SpecialityDistributionResponse {
    Long specialityId;
    String specialityName;
    long appointmentCount;
}
