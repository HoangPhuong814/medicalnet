package backend.example.backend.module.specialitiy;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.specialitiy.dto.SpecialityCreateRequest;
import backend.example.backend.module.specialitiy.dto.SpecialityResponse;
import backend.example.backend.module.specialitiy.dto.SpecialityUpdateRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SpecialityService {
    SpecialityRepository specialityRepository;
    SpecialityMapper specialityMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public SpecialityResponse createSpeciality(SpecialityCreateRequest request)
    {
        if (specialityRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.SPECIALITIES_EXISTED);
        }

        Speciality speciality = specialityMapper.toSpeciality(request);

        return specialityMapper.toSpecialityResponse(specialityRepository.save(speciality));
    }

    public List<SpecialityResponse> getAllSpecialities()
    {
        return specialityMapper.toListSpecialityResponse(specialityRepository.findAll());
    }

    public SpecialityResponse getSpeciality(Long id)
    {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SPECIALITIES_NOT_FOUND));

        return specialityMapper.toSpecialityResponse(speciality);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public SpecialityResponse updateSpeciality(Long id, SpecialityUpdateRequest request)
    {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SPECIALITIES_NOT_FOUND));

        specialityMapper.updateSpeciality(speciality, request);

        return specialityMapper.toSpecialityResponse(specialityRepository.save(speciality));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSpeciality(Long id)
    {
        if (!specialityRepository.existsById(id))
        {
            throw new AppException(ErrorCode.SPECIALITIES_NOT_FOUND);
        }

        specialityRepository.deleteById(id);
    }
}
