package backend.example.backend.unit.service;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.appointment.*;
import backend.example.backend.module.appointment.dto.AppointmentCreateRequest;
import backend.example.backend.module.appointment.dto.AppointmentResponse;
import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.schedule.ScheduleSlot;
import backend.example.backend.module.schedule.ScheduleSlotRepository;
import backend.example.backend.module.schedule.WorkSchedule;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.junit.jupiter.api.AfterEach;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
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
    @Mock
    private EntityManager entityManager;

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

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
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
    void testCreateAppointment_Success() {
        AppointmentCreateRequest request = AppointmentCreateRequest.builder()
                .slotId(mockSlot.getId())
                .reason("Đau đầu chóng mặt")
                .build();

        mockSecurityContext(mockPatient.getEmail());

        when(userRepository.findByEmail(mockPatient.getEmail()))
                .thenReturn(Optional.of(mockPatient));
        when(scheduleSlotRepository.findById(mockSlot.getId()))
                .thenReturn(Optional.of(mockSlot));

        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(mockSlot.getId()), anyList()))
                .thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class)))
                .thenReturn(mockAppointment);
        when(appointmentMapper.toAppointmentResponse(any(Appointment.class)))
                .thenReturn(mockResponse);

        var result = appointmentService.createAppointment(request);

        assertNotNull(result);
        assertEquals(mockResponse, result);

        verify(entityManager).lock(mockSlot, LockModeType.OPTIMISTIC_FORCE_INCREMENT);
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void testCreateAppointment_AlreadyBooked_ThrowsException() {
        AppointmentCreateRequest request = AppointmentCreateRequest.builder()
                .slotId(mockSlot.getId())
                .reason("Đau họng")
                .build();

        mockSecurityContext(mockPatient.getEmail());

        when(userRepository.findByEmail(mockPatient.getEmail()))
                .thenReturn(Optional.of(mockPatient));
        when(scheduleSlotRepository.findById(mockSlot.getId()))
                .thenReturn(Optional.of(mockSlot));

        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(mockSlot.getId()), anyList()))
                .thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.createAppointment(request);
        });

        assertEquals(ErrorCode.SLOT_ALREADY_BOOKED, exception.getErrorCode());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void testCreateAppointment_PastDate_ThrowsException() {
        mockSchedule.setWorkDate(LocalDate.now().minusDays(1));

        AppointmentCreateRequest request = AppointmentCreateRequest.builder()
                .slotId(mockSlot.getId())
                .build();

        mockSecurityContext(mockPatient.getEmail());

        when(userRepository.findByEmail(mockPatient.getEmail()))
                .thenReturn(Optional.of(mockPatient));
        when(scheduleSlotRepository.findById(mockSlot.getId()))
                .thenReturn(Optional.of(mockSlot));

        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.createAppointment(request);
        });

        assertEquals(ErrorCode.INVALID_TIME_RANGE, exception.getErrorCode());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }


    @Test
    void testGetMyBookings_Success()
    {
        List<Appointment> appointments = List.of(mockAppointment);
        List<AppointmentResponse> mockResponses = List.of(mockResponse);

        mockSecurityContext(mockPatient.getEmail());
        mockPatient.setRoles(Collections.emptySet());

        when(userRepository.findByEmail(mockPatient.getEmail()))
                .thenReturn(Optional.ofNullable(mockPatient));

        when(appointmentRepository.findAllByPatientIdOrderByCreatedAtDesc(mockPatient.getId()))
                .thenReturn(appointments);
        when(appointmentMapper.toListAppointmentResponse(appointments))
                .thenReturn(mockResponses);

        var rs = appointmentService.getMyBookings();
        assertEquals(mockResponses, rs);

        verify(userRepository).findByEmail(mockPatient.getEmail());
        verify(appointmentRepository).findAllByPatientIdOrderByCreatedAtDesc(mockPatient.getId());
        verify(appointmentMapper).toListAppointmentResponse(appointments);
    }

    @Test
    void testGetMyBookings_UserNotFound_ThrowsException() {
        mockSecurityContext("unknown@gmail.com");

        when(userRepository.findByEmail("unknown@gmail.com"))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.getMyBookings();
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());

        verify(appointmentRepository, never()).findAllByPatientIdOrderByCreatedAtDesc(anyString());
        verify(appointmentMapper, never()).toListAppointmentResponse(anyList());
    }

    @Test
    void testGetDoctorAppointments_Success() {
        Long doctorId = mockDoctor.getId();
        List<Appointment> appointments = List.of(mockAppointment);
        List<AppointmentResponse> mockResponses = List.of(mockResponse);

        when(appointmentRepository.findAllByDoctorIdOrderByCreatedAtDesc(doctorId))
                .thenReturn(appointments);
        when(appointmentMapper.toListAppointmentResponse(appointments))
                .thenReturn(mockResponses);

        var result = appointmentService.getDoctorAppointments(doctorId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockResponses, result);

        verify(appointmentRepository).findAllByDoctorIdOrderByCreatedAtDesc(doctorId);
        verify(appointmentMapper).toListAppointmentResponse(appointments);
    }

    @Test
    void testGetDoctorAppointments_EmptyList() {
        Long doctorId = mockDoctor.getId();

        when(appointmentRepository.findAllByDoctorIdOrderByCreatedAtDesc(doctorId))
                .thenReturn(Collections.emptyList());
        when(appointmentMapper.toListAppointmentResponse(Collections.emptyList()))
                .thenReturn(Collections.emptyList());

        var result = appointmentService.getDoctorAppointments(doctorId);

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(appointmentRepository).findAllByDoctorIdOrderByCreatedAtDesc(doctorId);
        verify(appointmentMapper).toListAppointmentResponse(Collections.emptyList());
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
