package backend.example.backend.module.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    //check slot
    boolean existsBySlotIdAndStatusIn(Long slotId, List<AppointmentStatus> statuses);

    //patient see their appointments
    List<Appointment> findAllByPatientIdOrderByCreatedAtDesc(String patientId);

    //doctor see their list appointments
    List<Appointment> findAllByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    // Count queries
    long countByStatus(AppointmentStatus status);

    long countByDoctorId(Long doctorId);

    long countByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.slot.workSchedule.workDate = :today")
    long countTodayAppointmentsByDoctorId(@Param("doctorId") Long doctorId, @Param("today") LocalDate today);

    // Revenue queries
    @Query("SELECT COALESCE(SUM(a.fee), 0) FROM Appointment a WHERE a.status = backend.example.backend.module.appointment.AppointmentStatus.COMPLETED")
    BigDecimal calculateTotalSystemRevenue();

    @Query("SELECT COALESCE(SUM(a.fee), 0) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = backend.example.backend.module.appointment.AppointmentStatus.COMPLETED")
    BigDecimal calculateDoctorTotalRevenue(@Param("doctorId") Long doctorId);

    // Date range queries for yearly/monthly breakdown
    @Query("SELECT a FROM Appointment a WHERE a.slot.workSchedule.workDate BETWEEN :startDate AND :endDate")
    List<Appointment> findAllByWorkDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.slot.workSchedule.workDate BETWEEN :startDate AND :endDate")
    List<Appointment> findAllByDoctorIdAndWorkDateBetween(@Param("doctorId") Long doctorId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Today's appointments for doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.slot.workSchedule.workDate = :today ORDER BY a.slot.startTime ASC")
    List<Appointment> findTodayAppointmentsByDoctorId(@Param("doctorId") Long doctorId, @Param("today") LocalDate today);
}

