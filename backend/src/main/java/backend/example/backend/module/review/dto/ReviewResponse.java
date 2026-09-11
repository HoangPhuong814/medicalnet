package backend.example.backend.module.review.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    Long id;
    Long appointmentId;

    // Thông tin Bệnh nhân đánh giá
    String patientId;
    String patientName;

    // Thông tin Bác sĩ được đánh giá
    Long doctorId;
    String doctorName;

    Integer rating;
    String comment;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
