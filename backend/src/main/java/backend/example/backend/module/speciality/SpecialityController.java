package backend.example.backend.module.speciality;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.speciality.dto.SpecialityCreateRequest;
import backend.example.backend.module.speciality.dto.SpecialityResponse;
import backend.example.backend.module.speciality.dto.SpecialityUpdateRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/specialities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SpecialityController
{
    SpecialityService specialityService;

    @PostMapping("/create")
    public ApiResponse<SpecialityResponse> createSpeciality(@RequestBody @Valid SpecialityCreateRequest request)
    {
        var result = specialityService.createSpeciality(request);

        return ApiResponse.<SpecialityResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<SpecialityResponse>> getAllSpecialities()
    {
        return ApiResponse.<List<SpecialityResponse>>builder()
                .result(specialityService.getAllSpecialities())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SpecialityResponse> getSpeciality(@PathVariable Long id)
    {
        var result = specialityService.getSpeciality(id);

        return ApiResponse.<SpecialityResponse>builder()
                .result(result)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<SpecialityResponse> updateSpeciality(@PathVariable("id") Long id,
                                                              @RequestBody @Valid
                                                                SpecialityUpdateRequest request)
    {
        var result = specialityService.updateSpeciality(id, request);

        return ApiResponse.<SpecialityResponse>builder()
                .result(result)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSpeciality(@PathVariable Long id)
    {
        specialityService.deleteSpeciality(id);

        return ApiResponse.<Void>builder()
                .message("Speciality deleted successfully")
                .build();
    }
}
