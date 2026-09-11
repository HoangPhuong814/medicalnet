package backend.example.backend.module.dashboard.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminDashboardResponse {
    //KPIs
    long totalDoctors;
    long totalPatients;
    long totalAppointments;
    BigDecimal totalRevenue;

    
    long confirmedAppointments;
    long completedAppointments;
    long cancelledAppointments;

    int selectedYear;
    List<MonthlyStatResponse> monthlyStats;

    // Top 5 doctors
    List<TopDoctorResponse> topDoctors;

    List<SpecialityDistributionResponse> specialityStats;
}
