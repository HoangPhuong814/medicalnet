package backend.example.backend.module.doctor;

import backend.example.backend.module.speciality.Speciality;
import backend.example.backend.module.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "speciality_id", nullable = false)
    Speciality speciality;
    BigDecimal consultationFee;
    Integer yearsOfExperience;
    @Column(columnDefinition = "TEXT")
    String biography;
    String clinicAddress;
}
