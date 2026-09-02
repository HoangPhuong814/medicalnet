package backend.example.backend.module.doctor;

import backend.example.backend.module.doctor.dto.DoctorCreateRequest;
import backend.example.backend.module.doctor.dto.DoctorResponse;
import backend.example.backend.module.doctor.dto.DoctorUpdateRequest;
import backend.example.backend.module.speciality.SpecialityMapper;
import backend.example.backend.module.user.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, SpecialityMapper.class})
public interface DoctorMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "speciality", ignore = true)
    Doctor toDoctor(DoctorCreateRequest request);
    DoctorResponse toDoctorResponse(Doctor doctor);
    List<DoctorResponse> toListDoctorResponse(List<Doctor> doctors);
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "speciality", ignore = true)
    void updateDoctor(@MappingTarget Doctor doctor, DoctorUpdateRequest request);
}
