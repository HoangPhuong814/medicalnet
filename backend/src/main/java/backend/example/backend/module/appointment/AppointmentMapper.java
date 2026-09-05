package backend.example.backend.module.appointment;

import backend.example.backend.module.appointment.dto.AppointmentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(source = "slot.id", target = "slotId")
    @Mapping(source = "slot.workSchedule.workDate", target = "appointmentDate")
    @Mapping(source = "slot.startTime", target = "startTime")
    @Mapping(source = "slot.endTime", target = "endTime")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.user.fullName", target = "doctorName")
    @Mapping(source = "doctor.speciality.name", target = "specialityName")
    @Mapping(source = "doctor.clinicAddress", target = "clinicAddress")
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "patient.email", target = "patientEmail")
    AppointmentResponse toAppointmentResponse(Appointment appointment);

    List<AppointmentResponse> toListAppointmentResponse(List<Appointment> appointments);
}

