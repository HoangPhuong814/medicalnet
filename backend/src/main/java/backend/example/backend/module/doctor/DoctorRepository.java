package backend.example.backend.module.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    boolean existsByUserId(String userId);
    Optional<Doctor> findByUserId(String userId);
    List<Doctor> findAllBySpecialityId(Long id);
}
