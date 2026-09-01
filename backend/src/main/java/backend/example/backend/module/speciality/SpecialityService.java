package backend.example.backend.module.speciality;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.speciality.dto.SpecialityCreateRequest;
import backend.example.backend.module.speciality.dto.SpecialityResponse;
import backend.example.backend.module.speciality.dto.SpecialityUpdateRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
    @CacheEvict(value = "specialities", allEntries = true)
    public SpecialityResponse createSpeciality(SpecialityCreateRequest request)
    {
        if (specialityRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.SPECIALITIES_EXISTED);
        }

        Speciality speciality = specialityMapper.toSpeciality(request);

        return specialityMapper.toSpecialityResponse(specialityRepository.save(speciality));
    }

    @Cacheable(value = "specialities", key = "'all'")
    public List<SpecialityResponse> getAllSpecialities()
    {
        return specialityMapper.toListSpecialityResponse(specialityRepository.findAll());
    }

    @Cacheable(value = "speciality", key = "#id")
    public SpecialityResponse getSpeciality(Long id)
    {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SPECIALITIES_NOT_FOUND));

        return specialityMapper.toSpecialityResponse(speciality);
    }

    @CacheEvict(value = {"specialities", "speciality"}, allEntries = true)
    @PreAuthorize("hasRole('ADMIN')")
    public SpecialityResponse updateSpeciality(Long id, SpecialityUpdateRequest request)
    {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SPECIALITIES_NOT_FOUND));

        if (!speciality.getName().equals(request.getName()) &&
                specialityRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.SPECIALITIES_EXISTED);
        }

        specialityMapper.updateSpeciality(speciality, request);

        return specialityMapper.toSpecialityResponse(specialityRepository.save(speciality));
    }

    @CacheEvict(value = {"specialities", "speciality"}, allEntries = true)
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
