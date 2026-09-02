
package backend.example.backend.module.doctor.dto;

import backend.example.backend.module.speciality.dto.SpecialityResponse;
import backend.example.backend.module.user.dto.UserResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DoctorResponse {
    Long id;
    UserResponse user;
    SpecialityResponse speciality;
    BigDecimal consultationFee;
    Integer yearsOfExperience;
    String biography;
    String clinicAddress;
}
