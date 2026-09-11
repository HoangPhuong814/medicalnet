package backend.example.backend.module.dashboard.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MonthlyStatResponse {
    int month;
    long appointmentCount;
    BigDecimal revenue;
}
