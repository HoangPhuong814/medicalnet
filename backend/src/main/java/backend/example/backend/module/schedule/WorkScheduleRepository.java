package backend.example.backend.module.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
    boolean existsByDoctorIdAndWorkDate(Long doctorId, LocalDate workDate);
    Optional<WorkSchedule> findByDoctorIdAndWorkDate(Long doctorId, LocalDate workDate);
    List<WorkSchedule> findAllByDoctorIdAndWorkDateGreaterThanEqual(Long doctorId, LocalDate fromDate);
}
