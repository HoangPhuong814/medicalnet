package backend.example.backend.module.user;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.user.dto.RoleRequest;
import backend.example.backend.module.user.dto.RoleResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request)
    {
        var result = roleService.createRole(request);
        return ApiResponse.<RoleResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles()
    {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable Long id)
    {
        roleService.deleteRole(id);
        return ApiResponse.<Void>builder()
                .message("Role deleted successfully")
                .build();
    }
}
