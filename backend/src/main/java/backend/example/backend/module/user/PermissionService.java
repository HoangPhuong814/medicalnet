
package backend.example.backend.module.user;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.user.dto.PermissionRequest;
import backend.example.backend.module.user.dto.PermissionResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    public PermissionResponse createPermission(PermissionRequest request)
    {
        if (permissionRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.PERMISSION_EXISTED);
        }
        var permission = permissionMapper.toPermission(request);

        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    public List<PermissionResponse> getAllPermissions()
    {
        return permissionMapper.toListPermissionResponse(permissionRepository.findAll());
    }

    public void deletePermission(Long id)
    {
        if (!permissionRepository.existsById(id))
        {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        permissionRepository.deleteById(id);
    }
}
