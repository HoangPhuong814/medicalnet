package backend.example.backend.module.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByAppointmentId(Long appointmentId);

    Optional<Review> findByAppointmentId(Long appointmentId);

    List<Review> findAllByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    List<Review> findAllByPatientIdOrderByCreatedAtDesc(String patientId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.doctor.id = :doctorId")
    Double calculateAverageRatingByDoctorId(@Param("doctorId") Long doctorId);

    Long countByDoctorId(Long doctorId);
}
