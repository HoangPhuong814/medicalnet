package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.PermissionRequest;
import backend.example.backend.module.user.dto.PermissionResponse;
import backend.example.backend.module.user.dto.RoleRequest;
import backend.example.backend.module.user.dto.RoleResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
    List<PermissionResponse> toListPermissionResponse(List<Permission> permissions);
}
