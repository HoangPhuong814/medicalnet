package backend.example.backend.module.review;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.appointment.Appointment;
import backend.example.backend.module.appointment.AppointmentRepository;
import backend.example.backend.module.appointment.AppointmentStatus;
import backend.example.backend.module.doctor.DoctorRepository;
import backend.example.backend.module.review.dto.DoctorRatingResponse;
import backend.example.backend.module.review.dto.ReviewCreateRequest;
import backend.example.backend.module.review.dto.ReviewResponse;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {

    ReviewRepository reviewRepository;
    ReviewMapper reviewMapper;
    AppointmentRepository appointmentRepository;
    DoctorRepository doctorRepository;
    UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(ReviewCreateRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new AppException(ErrorCode.APPOINTMENT_NOT_COMPLETED);
        }

        if (reviewRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!appointment.getPatient().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Review review = Review.builder()
                .appointment(appointment)
                .doctor(appointment.getDoctor())
                .patient(currentUser)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getReviewsByDoctorId(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new AppException(ErrorCode.DOCTOR_NOT_EXISTED);
        }

        List<Review> reviews = reviewRepository.findAllByDoctorIdOrderByCreatedAtDesc(doctorId);
        return reviewMapper.toListReviewResponse(reviews);
    }

    public DoctorRatingResponse getDoctorRatingSummary(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new AppException(ErrorCode.DOCTOR_NOT_EXISTED);
        }

        Double avgRating = reviewRepository.calculateAverageRatingByDoctorId(doctorId);
        Long totalReviews = reviewRepository.countByDoctorId(doctorId);

        double roundedRating = BigDecimal.valueOf(avgRating)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();

        return DoctorRatingResponse.builder()
                .doctorId(doctorId)
                .averageRating(roundedRating)
                .totalReviews(totalReviews)
                .build();
    }

    public List<ReviewResponse> getMyReviews() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Review> reviews = reviewRepository.findAllByPatientIdOrderByCreatedAtDesc(currentUser.getId());
        return reviewMapper.toListReviewResponse(reviews);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));

        if (!isAdmin && !review.getPatient().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        reviewRepository.deleteById(reviewId);
    }
}
