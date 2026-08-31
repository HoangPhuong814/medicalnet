package backend.example.backend.module.specialitiy.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SpecialityCreateRequest {
    String name;
    String description;
    String iconUrl;
}
