package backend.example.backend.module.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    String email;

    @NotBlank(message = "OTP cannot be blank")
    String otp;

    @NotBlank(message = "New password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String newPassword;

    @NotBlank(message = "Confirm password cannot be blank")
    String confirmPassword;
}
