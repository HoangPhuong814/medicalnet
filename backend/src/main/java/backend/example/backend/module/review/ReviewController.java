package backend.example.backend.module.review;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.review.dto.DoctorRatingResponse;
import backend.example.backend.module.review.dto.ReviewCreateRequest;
import backend.example.backend.module.review.dto.ReviewResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {

    ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@RequestBody @Valid ReviewCreateRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(request))
                .build();
    }

    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<List<ReviewResponse>> getReviewsByDoctorId(@PathVariable Long doctorId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getReviewsByDoctorId(doctorId))
                .build();
    }

    @GetMapping("/doctor/{doctorId}/rating")
    public ApiResponse<DoctorRatingResponse> getDoctorRatingSummary(@PathVariable Long doctorId) {
        return ApiResponse.<DoctorRatingResponse>builder()
                .result(reviewService.getDoctorRatingSummary(doctorId))
                .build();
    }

    @GetMapping("/my-reviews")
    public ApiResponse<List<ReviewResponse>> getMyReviews() {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getMyReviews())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ApiResponse.<Void>builder()
                .message("Review deleted successfully")
                .build();
    }
}
