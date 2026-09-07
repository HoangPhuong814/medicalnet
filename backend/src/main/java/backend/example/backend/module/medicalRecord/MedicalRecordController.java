package backend.example.backend.module.medicalRecord;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.medicalRecord.dto.MedicalRecordCreateRequest;
import backend.example.backend.module.medicalRecord.dto.MedicalRecordResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical-records")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MedicalRecordController {

    MedicalRecordService medicalRecordService;

    @PostMapping
    public ApiResponse<MedicalRecordResponse> createMedicalRecord(@RequestBody @Valid MedicalRecordCreateRequest request) {
        return ApiResponse.<MedicalRecordResponse>builder()
                .result(medicalRecordService.createMedicalRecord(request))
                .build();
    }

    @GetMapping("/appointment/{appointmentId}")
    public ApiResponse<MedicalRecordResponse> getRecordByAppointmentId(@PathVariable Long appointmentId) {
        return ApiResponse.<MedicalRecordResponse>builder()
                .result(medicalRecordService.getMedicalRecordByAppointmentId(appointmentId))
                .build();
    }

    @GetMapping("/my-records")
    public ApiResponse<List<MedicalRecordResponse>> getMyMedicalRecords() {
        return ApiResponse.<List<MedicalRecordResponse>>builder()
                .result(medicalRecordService.getAllMyMedicalRecords())
                .build();
    }

    @GetMapping("/patient/{patientId}")
    public ApiResponse<List<MedicalRecordResponse>> getRecordsByPatientId(@PathVariable String patientId) {
        return ApiResponse.<List<MedicalRecordResponse>>builder()
                .result(medicalRecordService.getAllByPatientId(patientId))
                .build();
    }

    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<List<MedicalRecordResponse>> getRecordsByDoctorId(@PathVariable Long doctorId) {
        return ApiResponse.<List<MedicalRecordResponse>>builder()
                .result(medicalRecordService.getAllByDoctorId(doctorId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<MedicalRecordResponse>> getAllRecords() {
        return ApiResponse.<List<MedicalRecordResponse>>builder()
                .result(medicalRecordService.getAllMedicalRecords())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ApiResponse.<Void>builder()
                .message("Medical record deleted successfully")
                .build();
    }
}
