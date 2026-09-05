package backend.example.backend.module.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    //check slot
    boolean existsBySlotIdAndStatusIn(Long slotId, List<AppointmentStatus> statuses);

    //patient see their appointments
    List<Appointment> findAllByPatientIdOrderByCreatedAtDesc(String patientId);

    //doctor see their list appointments
    List<Appointment> findAllByDoctorIdOrderByCreatedAtDesc(Long doctorId);
}

