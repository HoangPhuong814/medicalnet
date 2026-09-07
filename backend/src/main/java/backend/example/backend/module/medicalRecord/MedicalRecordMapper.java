package backend.example.backend.module.medicalRecord;

import backend.example.backend.module.medicalRecord.dto.MedicalRecordResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MedicalRecordMapper {

    @Mapping(source = "appointment.id", target = "appointmentId")
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "patient.dateOfBirth", target = "dateOfBirth")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.user.fullName", target = "doctorName")
    @Mapping(source = "doctor.speciality.name", target = "specialityName")
    MedicalRecordResponse toMedicalRecordResponse(MedicalRecord medicalRecord);
    List<MedicalRecordResponse> toListMedicalRecordResponse(List<MedicalRecord> medicalRecords);
}
