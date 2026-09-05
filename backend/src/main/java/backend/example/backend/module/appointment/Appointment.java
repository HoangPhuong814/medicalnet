package backend.example.backend.module.appointment;

import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.schedule.ScheduleSlot;
import backend.example.backend.module.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    ScheduleSlot slot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AppointmentStatus status;

    String reason;

    BigDecimal fee;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
}
