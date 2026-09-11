package backend.example.backend.module.review;

import backend.example.backend.module.review.dto.ReviewResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "appointment.id", target = "appointmentId")
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.user.fullName", target = "doctorName")
    ReviewResponse toReviewResponse(Review review);

    List<ReviewResponse> toListReviewResponse(List<Review> reviews);
}
