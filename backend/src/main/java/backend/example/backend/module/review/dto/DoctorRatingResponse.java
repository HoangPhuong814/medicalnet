package backend.example.backend.module.review.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DoctorRatingResponse {
    Long doctorId;
    Double averageRating;
    Long totalReviews;
}
