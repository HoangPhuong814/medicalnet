package backend.example.backend.module.dashboard.dto;

import backend.example.backend.module.appointment.dto.AppointmentResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DoctorDashboardResponse {
    Long doctorId;
    String doctorName;
    String specialityName;

    // KPIs
    long totalAppointments;
    long todayAppointments;
    long completedAppointments;
    long cancelledAppointments;
    BigDecimal totalEarnings;

    // Rate
    double averageRating;
    long totalReviews;

    int selectedYear;
    List<MonthlyStatResponse> monthlyStats;

    List<AppointmentResponse> todayAppointmentsList;
}
