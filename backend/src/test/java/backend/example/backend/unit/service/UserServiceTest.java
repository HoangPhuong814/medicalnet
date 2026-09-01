package backend.example.backend.unit.service;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.user.*;
import backend.example.backend.module.user.dto.UserCreateRequest;
import backend.example.backend.module.user.dto.UserResponse;
import backend.example.backend.module.user.dto.UserUpdateRequest;
import backend.example.backend.module.user.enums.RoleEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private UserService userService;
    private User mockUser;

    @BeforeEach
    void setUp()
    {
        mockUser = new User();
        mockUser.setId("gohantoochakudasai");
        mockUser.setFullName("phuong");
        mockUser.setEmail("phuong@gmail.com");
        mockUser.setActive(true);
    }

    @Test
    void testCreateUser_Success()
    {
        UserCreateRequest createRequest = UserCreateRequest.builder()
                .email("phuong@gmail.com")
                .password("rawPassword123")
                .fullName("Hoang Phuong")
                .build();

        Role userRole = Role.builder()
                .name(RoleEnum.USER.name())
                .description("User role")
                .build();

        UserResponse expectedResponse = UserResponse.builder()
                .id("generated-id-123")
                .email("phuong@gmail.com")
                .fullName("Hoang Phuong")
                .isActive(true)
                .build();

        when(userRepository.existsByEmail(createRequest.getEmail())).thenReturn(false);
        when(userMapper.toUser(createRequest)).thenReturn(mockUser);
        when(passwordEncoder.encode(createRequest.getPassword())).thenReturn("encodePassword");
        when(roleRepository.findByName(RoleEnum.USER.name())).thenReturn(Optional.ofNullable(userRole));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(userMapper.toUserResponse(mockUser)).thenReturn(expectedResponse);

        UserResponse actualResponse = userService.createUser(createRequest);

        assertNotNull(actualResponse);
        assertEquals("phuong@gmail.com", actualResponse.getEmail());
        assertEquals("Hoang Phuong", actualResponse.getFullName());

        verify(userRepository).existsByEmail(createRequest.getEmail());
        verify(passwordEncoder).encode("rawPassword123");
        verify(roleRepository).findByName(RoleEnum.USER.name());
        verify(userRepository).save(any(User.class));
    }
    @Test
    void testCreateUser_EmailExisted_ThrowsException()
    {
        UserCreateRequest createRequest = UserCreateRequest.builder()
                .email("phuong@gmail.com")
                .password("rawPassword123")
                .fullName("Hoang Phuong")
                .build();

        when(userRepository.existsByEmail(createRequest.getEmail())).thenReturn(true);
        AppException exception = assertThrows(AppException.class, () -> {
            userService.createUser(createRequest);
        });

        assertEquals(ErrorCode.USER_EXISTED, exception.getErrorCode());

        verify(userMapper, never()).toUser(any());
        verify(passwordEncoder, never()).encode(anyString());
        verify(roleRepository, never()).findByName(any());
        verify(userMapper, never()).toUserResponse(any());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testGetAllUsers_Success() {

        List<User> users = List.of(mockUser);

        UserResponse mockResponse = UserResponse.builder()
                .id("gohantoochakudasai")
                .fullName("phuong")
                .email("phuong@gmail.com")
                .isActive(true)
                .build();

        List<UserResponse> responses = List.of(mockResponse);

        when(userRepository.findAll()).thenReturn(users);
        when(userMapper.toListUserResponse(users)).thenReturn(responses);

        var result = userService.getAllUsers();
        System.out.println("Data: " + result);
        assertEquals(responses, result);

        verify(userRepository).findAll();
        verify(userMapper).toListUserResponse(users);
    }

    @Test
    void testGetUser_Success()
    {
        UserResponse mockResponse = UserResponse.builder()
                .id("gohantoochakudasai")
                .fullName("phuong")
                .email("phuong@gmail.com")
                .isActive(true)
                .build();

        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.ofNullable(mockUser));
        when(userMapper.toUserResponse(mockUser)).thenReturn(mockResponse);

        var rs = userService.getUser(mockUser.getId());
        System.out.println("Data: " + rs);
        assertEquals(mockResponse, rs);

        verify(userRepository).findById(mockUser.getId());
        verify(userMapper).toUserResponse(mockUser);
    }

    @Test
    void testGetUser_UserNotFound_ThrowsException()
    {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            userService.getUser(mockUser.getId());
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());

        verify(userMapper, never()).toUserResponse(mockUser);
    }

    @Test
    void testDeleteUser_Success()
    {
        when(userRepository.existsById(mockUser.getId())).thenReturn(true);
        userService.deleteUser(mockUser.getId());

        verify(userRepository).existsById(mockUser.getId());
        verify(userRepository).deleteById(mockUser.getId());
    }

    @Test
    void testDeleteUser_UserNotFound_ThrowsException()
    {
        when(userRepository.existsById(mockUser.getId())).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> {
            userService.deleteUser(mockUser.getId());
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());

        verify(userRepository, never()).deleteById(mockUser.getId());
    }

    @Test
    void testUpdateUser_Success()
    {
        UserUpdateRequest updateRequest = UserUpdateRequest.builder()
                .fullName("hoang")
                .password("newPassword")
                .build();

        UserResponse expectedResponse = UserResponse.builder()
                .id(mockUser.getId())
                .fullName("hoang")
                .email(mockUser.getEmail())
                .build();

        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.ofNullable(mockUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(userMapper.toUserResponse(mockUser)).thenReturn(expectedResponse);

        UserResponse actualResponse = userService.updateUser(mockUser.getId(), updateRequest);

        assertNotNull(actualResponse);
        assertEquals("hoang", actualResponse.getFullName());
        assertEquals(mockUser.getId(), actualResponse.getId());

        verify(userRepository).findById(mockUser.getId());
        verify(userMapper).updateUser(mockUser, updateRequest);
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(mockUser);
    }

    @Test
    void testUpdateUser_UserNotFound_ThrowsException()
    {
        UserUpdateRequest updateRequest = UserUpdateRequest.builder()
                .fullName("hoang")
                .password("newPassword")
                .build();

        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> {
            userService.updateUser(mockUser.getId(), updateRequest);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());

        verify(userMapper, never()).updateUser(any(), any());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

}
