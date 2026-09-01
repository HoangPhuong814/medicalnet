package backend.example.backend.module.speciality;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecialityRepository extends JpaRepository<Speciality, Long> {
    boolean existsByName(String name);
}
