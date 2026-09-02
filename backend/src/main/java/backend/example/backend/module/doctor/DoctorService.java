package backend.example.backend.module.doctor;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.doctor.dto.DoctorCreateRequest;
import backend.example.backend.module.doctor.dto.DoctorResponse;
import backend.example.backend.module.doctor.dto.DoctorUpdateRequest;
import backend.example.backend.module.speciality.Speciality;
import backend.example.backend.module.speciality.SpecialityRepository;
import backend.example.backend.module.user.Role;
import backend.example.backend.module.user.RoleRepository;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import backend.example.backend.module.user.enums.RoleEnum;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DoctorService {
    DoctorRepository doctorRepository;
    DoctorMapper doctorMapper;
    UserRepository userRepository;
    SpecialityRepository specialityRepository;
    RoleRepository roleRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public DoctorResponse createDoctor(DoctorCreateRequest request)
    {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (doctorRepository.existsByUserId(request.getUserId()))
        {
            throw new AppException(ErrorCode.DOCTOR_EXISTED);
        }

        Speciality speciality = specialityRepository.findById(request.getSpecialityId())
                .orElseThrow(() -> new AppException(ErrorCode.SPECIALITIES_NOT_FOUND));

        Role doctorRole = roleRepository.findByName(RoleEnum.DOCTOR.name())
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name(RoleEnum.DOCTOR.name())
                                .description("Doctor role")
                                .build()));
        user.getRoles().add(doctorRole);
        userRepository.save(user);

        Doctor doctor = doctorMapper.toDoctor(request);
        doctor.setUser(user);
        doctor.setSpeciality(speciality);

        return doctorMapper.toDoctorResponse(doctorRepository.save(doctor));
    }

    public List<DoctorResponse> getAllDoctors()
    {
        return doctorMapper.toListDoctorResponse(doctorRepository.findAll());
    }

    public List<DoctorResponse> getAllDoctorBySpeciality(Long id)
    {
        if (!specialityRepository.existsById(id))
        {
            throw new AppException(ErrorCode.SPECIALITIES_NOT_FOUND);
        }
        return doctorMapper.toListDoctorResponse(doctorRepository.findAllBySpecialityId(id));
    }

    public DoctorResponse getDoctor(Long id)
    {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DOCTOR_NOT_EXISTED));
        return doctorMapper.toDoctorResponse(doctor);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public DoctorResponse updateDoctor(Long id, DoctorUpdateRequest request)
    {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DOCTOR_NOT_EXISTED));

        doctorMapper.updateDoctor(doctor, request);

        if (request.getSpecialityId() != null &&
                !request.getSpecialityId().equals(doctor.getSpeciality().getId()))
        {
            Speciality speciality = specialityRepository.findById(request.getSpecialityId())
                    .orElseThrow(() -> new AppException(ErrorCode.SPECIALITIES_NOT_FOUND));
            doctor.setSpeciality(speciality);
        }

        return doctorMapper.toDoctorResponse(doctorRepository.save(doctor));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDoctor(Long id)
    {
        if (!doctorRepository.existsById(id))
        {
            throw new AppException(ErrorCode.DOCTOR_NOT_EXISTED);
        }
        doctorRepository.deleteById(id);
    }
}
