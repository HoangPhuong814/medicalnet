package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.UserCreateRequest;
import backend.example.backend.module.user.dto.UserResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUserResponse(List<User> users);
}
