package backend.example.backend.module.schedule;

import backend.example.backend.module.doctor.Doctor;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.print.Doc;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "work_schedules",
uniqueConstraints = {
        @UniqueConstraint(name = "unique_doctor_work_date",
                columnNames = {"doctor_id", "workDate"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    Doctor doctor;

    @Column(nullable = false)
    LocalDate workDate;

    @Column(nullable = false)
    LocalTime startTime;

    @Column(nullable = false)
    LocalTime endTime;

    @OneToMany(mappedBy = "workSchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<ScheduleSlot> slots = new ArrayList<>();
}
