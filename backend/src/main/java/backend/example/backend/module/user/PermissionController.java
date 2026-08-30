
package backend.example.backend.module.user;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.user.dto.PermissionRequest;
import backend.example.backend.module.user.dto.PermissionResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping("/create")
    public ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request) {
        var result = permissionService.createPermission(request);
        return ApiResponse.<PermissionResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<PermissionResponse>> getAllPermissions() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ApiResponse.<Void>builder()
                .message("Permission deleted successfully")
                .build();
    }
}
