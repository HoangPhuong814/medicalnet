package backend.example.backend.module.medicalRecord;

import backend.example.backend.module.appointment.Appointment;
import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    User patient;

    @Column(columnDefinition = "TEXT")
    String symptoms;

    @Column(nullable = false)
    String diagnosis;

    @Column(columnDefinition = "TEXT")
    String treatmentPlan;

    @Column(columnDefinition = "TEXT")
    String prescription;

    LocalDate followUpDate;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
}
