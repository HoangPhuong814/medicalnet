package backend.example.backend.module.speciality;

import backend.example.backend.module.speciality.dto.SpecialityCreateRequest;
import backend.example.backend.module.speciality.dto.SpecialityResponse;
import backend.example.backend.module.speciality.dto.SpecialityUpdateRequest;
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
