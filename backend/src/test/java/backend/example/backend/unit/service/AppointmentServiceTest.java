package backend.example.backend.unit.service;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.appointment.*;
import backend.example.backend.module.appointment.dto.AppointmentResponse;
import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.schedule.ScheduleSlot;
import backend.example.backend.module.schedule.ScheduleSlotRepository;
import backend.example.backend.module.schedule.WorkSchedule;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private ScheduleSlotRepository scheduleSlotRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AppointmentMapper appointmentMapper;
    @InjectMocks
    private AppointmentService appointmentService;
    private User mockPatient;
    private Doctor mockDoctor;
    private WorkSchedule mockSchedule;
    private ScheduleSlot mockSlot;
    private Appointment mockAppointment;
    private AppointmentResponse mockResponse;
    @BeforeEach
    void setUp()
    {
        mockPatient = new User();
        mockPatient.setId("patient123");
        mockPatient.setEmail("patient@gmail.com");
        mockPatient.setFullName("Bệnh nhân 1");

        User doctorUser = new User();
        doctorUser.setId("doctor123");
        doctorUser.setFullName("Nguyen Doctor");

        mockDoctor = Doctor.builder()
                .user(doctorUser)
                .id(1L)
                .consultationFee(BigDecimal.valueOf(200000))
                .build();

        mockSchedule = WorkSchedule.builder()
                .id(2L)
                .doctor(mockDoctor)
                .workDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(12, 0))
                .build();

        mockSlot = ScheduleSlot.builder()
                .id(3L)
                .workSchedule(mockSchedule)
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(8, 30))
                .version(0)
                .build();

        mockAppointment = Appointment.builder()
                .id(4L)
                .patient(mockPatient)
                .doctor(mockDoctor)
                .slot(mockSlot)
                .status(AppointmentStatus.CONFIRMED)
                .fee(BigDecimal.valueOf(200000))
                .build();

        mockResponse = AppointmentResponse.builder()
                .id(4L)
                .slotId(3L)
                .doctorName("Nguyen Doctor")
                .patientName("Bệnh nhân 1")
                .status(AppointmentStatus.CONFIRMED)
                .build();
    }

    private void mockSecurityContext(String email)
    {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(email);
    }

    @Test
    void testCancelAppointment_Success()
    {
        mockSecurityContext(mockPatient.getEmail());
        mockPatient.setRoles(Collections.emptySet());

        when(appointmentRepository.findById(mockAppointment.getId()))
                .thenReturn(Optional.ofNullable(mockAppointment));

        when(userRepository.findByEmail(mockPatient.getEmail()))
                .thenReturn(Optional.ofNullable(mockPatient));

        appointmentService.cancelAppointment(mockAppointment.getId());

        assertEquals(AppointmentStatus.CANCELLED, mockAppointment.getStatus());

        verify(appointmentRepository).findById(mockAppointment.getId());
        verify(appointmentRepository).save(mockAppointment);
    }

    @Test
    void testCancelAppointment_AppointmentNotFound_ThrowsException()
    {
        when(appointmentRepository.findById(mockAppointment.getId()))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.cancelAppointment(mockAppointment.getId());
        });

        assertEquals(ErrorCode.APPOINTMENT_NOT_FOUND, exception.getErrorCode());

        verify(appointmentRepository).findById(mockAppointment.getId());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void testCancelAppointment_UserNotFound_ThrowsException()
    {
        when(appointmentRepository.findById(mockAppointment.getId()))
                .thenReturn(Optional.ofNullable(mockAppointment));

        mockSecurityContext("notfound@gmail.com");

        when(userRepository.findByEmail("notfound@gmail.com"))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.cancelAppointment(mockAppointment.getId());
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());

        verify(appointmentRepository).findById(mockAppointment.getId());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void testCancelAppointment_Unauthorized_ThrowsException()
    {
        User stranger = new User();
        stranger.setId("stranger1");
        stranger.setEmail("sg@gmail.com");
        stranger.setRoles(Collections.emptySet());

        when(appointmentRepository.findById(mockAppointment.getId()))
                .thenReturn(Optional.ofNullable(mockAppointment));

        mockSecurityContext(stranger.getEmail());

        when(userRepository.findByEmail(stranger.getEmail()))
                .thenReturn(Optional.of(stranger));

        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.cancelAppointment(mockAppointment.getId());
        });

        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());

        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
