package backend.example.backend.module.medicalRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    boolean existsByAppointmentId(Long appointmentId);

    Optional<MedicalRecord> findByAppointmentId(Long appointmentId);

    List<MedicalRecord> findAllByPatientIdOrderByCreatedAtDesc(String patientId);

    List<MedicalRecord> findAllByDoctorIdOrderByCreatedAtDesc(Long doctorId);
}
