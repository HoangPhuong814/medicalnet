
package backend.example.backend.module.speciality.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SpecialityUpdateRequest {
    @NotBlank(message = "Speciality name is required")
    String name;
    String description;
    String iconUrl;
}
