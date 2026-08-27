package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.UserCreateRequest;
import backend.example.backend.module.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    public UserResponse createUser(UserCreateRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("Email existed");
        }
        User user = userMapper.toUser(request);
        return userMapper.toUserResponse(userRepository.save(user));
    }
    public UserResponse getUser(String id)
    {
        User user = userRepository.findById(id)
                .orElseThrow();
        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getAllUsers()
    {
        return userMapper.toListUserResponse(userRepository.findAll());
    }

    public void deleteUser(String id)
    {
        if(!userRepository.existsById(id))
        {
            throw new RuntimeException("not exist");
        }
        userRepository.deleteById(id);
    }
}
