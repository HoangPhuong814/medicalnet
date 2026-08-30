package backend.example.backend.module.user;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.user.dto.UserCreateRequest;
import backend.example.backend.module.user.dto.UserResponse;
import backend.example.backend.module.user.dto.UserUpdateRequest;
import backend.example.backend.module.user.enums.RoleEnum;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    public UserResponse createUser(UserCreateRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var role = roleRepository.findByName(RoleEnum.USER.name())
                .orElseGet(() -> {
                    var newRole = Role.builder()
                            .name(RoleEnum.USER.name())
                            .description("User role")
                            .build();
                    return roleRepository.save(newRole);
                });
        user.setRoles(Set.of(role));

        return userMapper.toUserResponse(userRepository.save(user));
    }
    public UserResponse getUser(String id)
    {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers()
    {
        return userMapper.toListUserResponse(userRepository.findAll());
    }

    public UserResponse updateUser(String id, UserUpdateRequest request)
    {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty())
        {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String id)
    {
        if(!userRepository.existsById(id))
        {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        userRepository.deleteById(id);
    }
}
