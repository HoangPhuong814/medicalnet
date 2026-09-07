
package backend.example.backend.module.medicalRecord.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicalRecordResponse {
    Long id;
    Long appointmentId;

    //patient information
    String patientId;
    String patientName;
    LocalDate dateOfBirth;

    //doctor information
    Long doctorId;
    String doctorName;
    String specialityName;

    String symptoms;
    String diagnosis;
    String treatmentPlan;
    String prescription;
    LocalDate followUpDate;
    LocalDateTime createdAt;
}
