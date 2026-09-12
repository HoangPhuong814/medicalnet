package backend.example.backend.module.dashboard;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.dashboard.dto.AdminDashboardResponse;
import backend.example.backend.module.dashboard.dto.DoctorDashboardResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {

    DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminDashboardResponse> getAdminDashboard(
            @RequestParam(name = "year", required = false) Integer year) {
        return ApiResponse.<AdminDashboardResponse>builder()
                .result(dashboardService.getAdminDashboard(year))
                .build();
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<DoctorDashboardResponse> getDoctorDashboard(
            @RequestParam(name = "year", required = false) Integer year) {
        return ApiResponse.<DoctorDashboardResponse>builder()
                .result(dashboardService.getDoctorDashboard(year))
                .build();
    }
}
