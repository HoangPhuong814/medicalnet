package backend.example.backend.module.user;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.user.dto.RoleRequest;
import backend.example.backend.module.user.dto.RoleResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;
    public RoleResponse createRole(RoleRequest request)
    {
        if (roleRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.ROLE_EXISTED);
        }
        var role = roleMapper.toRole(request);
        var permissions  = permissionRepository.findAllById(
                request.getPermissions() == null ? List.of() : request.getPermissions());

        Set<Permission> permissionSet = new HashSet<>(permissions);

        role.setPermissions(permissionSet);

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAllRoles()
    {
        return roleMapper.toListRoleResponse(roleRepository.findAll());
    }

    public void deleteRole(Long id)
    {
        if (!roleRepository.existsById(id))
        {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        }
        roleRepository.deleteById(id);
    }
}
