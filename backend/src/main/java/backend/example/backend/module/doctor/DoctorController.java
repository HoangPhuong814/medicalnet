package backend.example.backend.module.doctor;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.doctor.dto.DoctorCreateRequest;
import backend.example.backend.module.doctor.dto.DoctorResponse;
import backend.example.backend.module.doctor.dto.DoctorUpdateRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DoctorController {
    DoctorService doctorService;

    @PostMapping("/create")
    public ApiResponse<DoctorResponse> createDoctor(@RequestBody @Valid DoctorCreateRequest request)
    {
        var result = doctorService.createDoctor(request);

        return ApiResponse.<DoctorResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<DoctorResponse>> getAllDoctor()
    {
        var result = doctorService.getAllDoctors();

        return ApiResponse.<List<DoctorResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/speciality/{id}")
    public ApiResponse<List<DoctorResponse>> getAllDoctorBySpeciality(@PathVariable Long id)
    {
        var result = doctorService.getAllDoctorBySpeciality(id);

        return ApiResponse.<List<DoctorResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DoctorResponse> getDoctor(@PathVariable Long id)
    {
        var result = doctorService.getDoctor(id);

        return ApiResponse.<DoctorResponse>builder()
                .result(result)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DoctorResponse> updateDoctor(@PathVariable Long id,
                                                    @RequestBody @Valid DoctorUpdateRequest request)
    {
        var result = doctorService.updateDoctor(id, request);

        return ApiResponse.<DoctorResponse>builder()
                .result(result)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteDoctor(@PathVariable Long id)
    {
        doctorService.deleteDoctor(id);

        return ApiResponse.<Void>builder()
                .message("Doctor deleted successfully")
                .build();
    }
}
