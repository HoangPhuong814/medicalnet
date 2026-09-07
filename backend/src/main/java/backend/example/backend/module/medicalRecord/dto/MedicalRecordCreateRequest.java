package backend.example.backend.module.medicalRecord.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicalRecordCreateRequest {
    @NotNull
    Long appointmentId;
    String symptoms;
    @NotBlank
    String diagnosis;
    @NotBlank
    String prescription;
    String treatmentPlan;
    LocalDate followUpDate;
}
