package backend.example.backend.module.doctor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DoctorUpdateRequest {
    @NotNull
    Long specialityId;
    BigDecimal consultationFee;
    Integer yearsOfExperience;
    String biography;
    String clinicAddress;
}
