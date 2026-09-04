package backend.example.backend.module.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {

    List<ScheduleSlot> findAllByWorkScheduleIdOrderByStartTimeAsc(Long workScheduleId);
}
