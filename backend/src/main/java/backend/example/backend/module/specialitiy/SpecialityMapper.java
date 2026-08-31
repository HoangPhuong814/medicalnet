package backend.example.backend.module.specialitiy;

import backend.example.backend.module.specialitiy.dto.SpecialityCreateRequest;
import backend.example.backend.module.specialitiy.dto.SpecialityResponse;
import backend.example.backend.module.specialitiy.dto.SpecialityUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SpecialityMapper {
    Speciality toSpeciality(SpecialityCreateRequest request);

    SpecialityResponse toSpecialityResponse(Speciality speciality);

    List<SpecialityResponse> toListSpecialityResponse(List<Speciality> specialities);

    void updateSpeciality(@MappingTarget Speciality speciality, SpecialityUpdateRequest request);
}
