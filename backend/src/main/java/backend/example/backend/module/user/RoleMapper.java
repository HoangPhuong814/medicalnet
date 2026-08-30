package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.RoleRequest;
import backend.example.backend.module.user.dto.RoleResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);
    List<RoleResponse> toListRoleResponse(List<Role> roles);
}
