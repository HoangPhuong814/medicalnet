package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.UserCreateRequest;
import backend.example.backend.module.user.dto.UserResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    @PostMapping("/create")
    public UserResponse createUser(@RequestBody UserCreateRequest request)
    {
        return userService.createUser(request);
    }

    @GetMapping
    public UserResponse getUser(@RequestParam String id)
    {
        return userService.getUser(id);
    }

    @GetMapping
    public List<UserResponse> getAllUsers()
    {
        return userService.getAllUsers();
    }

    @DeleteMapping
    public void deleteUser(@RequestParam String id)
    {
        userService.deleteUser(id);
    }
}
