package backend.example.backend.module.medicalRecord;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.appointment.Appointment;
import backend.example.backend.module.appointment.AppointmentRepository;
import backend.example.backend.module.appointment.AppointmentStatus;
import backend.example.backend.module.medicalRecord.dto.MedicalRecordCreateRequest;
import backend.example.backend.module.medicalRecord.dto.MedicalRecordResponse;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MedicalRecordService {

    MedicalRecordRepository medicalRecordRepository;
    MedicalRecordMapper medicalRecordMapper;
    AppointmentRepository appointmentRepository;
    UserRepository userRepository;

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Transactional
    public MedicalRecordResponse createMedicalRecord(MedicalRecordCreateRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new AppException(ErrorCode.APPOINTMENT_NOT_CONFIRMED);
        }

        if (medicalRecordRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new AppException(ErrorCode.MEDICAL_RECORD_EXISTED);
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getName().equals("ADMIN"));

        if (!isAdmin && !appointment.getDoctor().getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        MedicalRecord medicalRecord = MedicalRecord.builder()
                .appointment(appointment)
                .doctor(appointment.getDoctor())
                .patient(appointment.getPatient())
                .symptoms(request.getSymptoms())
                .diagnosis(request.getDiagnosis())
                .treatmentPlan(request.getTreatmentPlan())
                .prescription(request.getPrescription())
                .followUpDate(request.getFollowUpDate())
                .build();

        appointment.setStatus(AppointmentStatus.COMPLETED);
        return medicalRecordMapper.toMedicalRecordResponse(medicalRecordRepository.save(medicalRecord));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<MedicalRecordResponse> getAllMedicalRecords() {
        return medicalRecordMapper.toListMedicalRecordResponse(medicalRecordRepository.findAll());
    }

    public MedicalRecordResponse getMedicalRecordByAppointmentId(Long appointmentId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDICAL_RECORD_NOT_FOUND));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ADMIN"));
        boolean isPatient = medicalRecord.getPatient().getId().equals(currentUser.getId());
        boolean isDoctor = medicalRecord.getDoctor().getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isPatient && !isDoctor) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return medicalRecordMapper.toMedicalRecordResponse(medicalRecord);
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public List<MedicalRecordResponse> getAllByPatientId(String patientId) {
        return medicalRecordMapper.toListMedicalRecordResponse(
                medicalRecordRepository.findAllByPatientIdOrderByCreatedAtDesc(patientId));
    }

    public List<MedicalRecordResponse> getAllMyMedicalRecords() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return medicalRecordMapper.toListMedicalRecordResponse(
                medicalRecordRepository.findAllByPatientIdOrderByCreatedAtDesc(patient.getId()));
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public List<MedicalRecordResponse> getAllByDoctorId(Long doctorId) {
        return medicalRecordMapper.toListMedicalRecordResponse(
                medicalRecordRepository.findAllByDoctorIdOrderByCreatedAtDesc(doctorId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new AppException(ErrorCode.MEDICAL_RECORD_NOT_FOUND);
        }

        medicalRecordRepository.deleteById(id);
    }
}

