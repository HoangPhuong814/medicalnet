package backend.example.backend.module.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    boolean existsByUserId(String userId);
    List<Doctor> findAllBySpecialityId(Long id);
}
