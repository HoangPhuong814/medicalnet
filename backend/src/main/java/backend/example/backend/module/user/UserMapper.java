package backend.example.backend.module.user;

import backend.example.backend.module.user.dto.UserCreateRequest;
import backend.example.backend.module.user.dto.UserResponse;
import backend.example.backend.module.user.dto.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUserResponse(List<User> users);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
