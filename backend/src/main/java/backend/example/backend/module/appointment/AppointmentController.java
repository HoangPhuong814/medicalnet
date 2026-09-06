package backend.example.backend.module.appointment;

import backend.example.backend.common.dto.ApiResponse;
import backend.example.backend.module.appointment.dto.AppointmentCreateRequest;
import backend.example.backend.module.appointment.dto.AppointmentResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppointmentController {

    AppointmentService appointmentService;

    @PostMapping("/book")
    public ApiResponse<AppointmentResponse> bookAppointment(@RequestBody @Valid AppointmentCreateRequest request) {
        return ApiResponse.<AppointmentResponse>builder()
                .result(appointmentService.createAppointment(request))
                .build();
    }


    @GetMapping("/my-bookings")
    public ApiResponse<List<AppointmentResponse>> getMyBookings() {
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointmentService.getMyBookings())
                .build();
    }

    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<List<AppointmentResponse>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointmentService.getDoctorAppointments(doctorId))
                .build();
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build();
    }
}
