package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.RoleRequest;
import backend.example.backend.module.user.dto.RoleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    @Mapping(target = "permissions", source = "permissions")
    RoleResponse toRoleResponse(Role role);

    default String mapPermissionToString(Permission permission) {
        return permission != null ? permission.getName() : null;
    }

    List<RoleResponse> toListRoleResponse(List<Role> roles);
}
