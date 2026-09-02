package backend.example.backend.unit.service;

import backend.example.backend.common.exception.AppException;
import backend.example.backend.common.exception.ErrorCode;
import backend.example.backend.module.speciality.Speciality;
import backend.example.backend.module.speciality.SpecialityMapper;
import backend.example.backend.module.speciality.SpecialityRepository;
import backend.example.backend.module.speciality.SpecialityService;
import backend.example.backend.module.speciality.dto.SpecialityCreateRequest;
import backend.example.backend.module.speciality.dto.SpecialityResponse;
import backend.example.backend.module.speciality.dto.SpecialityUpdateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpecialityServiceTest {
    @Mock
    private SpecialityRepository specialityRepository;
    @Mock
    private SpecialityMapper specialityMapper;
    @InjectMocks
    private SpecialityService specialityService;
    private Speciality speciality;

    @BeforeEach
    void setUp()
    {
        speciality = new Speciality();
        speciality.setId(1L);
        speciality.setName("Khoa nhi");
        speciality.setDescription("Dành cho em bé");
    }

    @Test
    void testCreateSpeciality_Success()
    {
        SpecialityCreateRequest mockRequest = SpecialityCreateRequest.builder()
                .name("Khoa nhi")
                .description("Dành cho em bé")
                .build();

        SpecialityResponse mockResponse = SpecialityResponse.builder()
                .name("Khoa nhi")
                .description("Dành cho em bé")
                .build();

        when(specialityRepository.existsByName(mockRequest.getName())).thenReturn(false);
        when(specialityMapper.toSpeciality(mockRequest)).thenReturn(speciality);
        when(specialityRepository.save(speciality)).thenReturn(speciality);
        when(specialityMapper.toSpecialityResponse(speciality)).thenReturn(mockResponse);

        var rs = specialityService.createSpeciality(mockRequest);

        assertNotNull(rs);
        assertEquals("Khoa nhi",rs.getName());
        assertEquals("Dành cho em bé", rs.getDescription());

        verify(specialityRepository).existsByName(mockRequest.getName());
        verify(specialityMapper).toSpeciality(mockRequest);
        verify(specialityRepository).save(speciality);
        verify(specialityMapper).toSpecialityResponse(speciality);
    }

    @Test
    void testCreateSpeciality_NameExisted_ThrowsException()
    {
        SpecialityCreateRequest mockRequest = SpecialityCreateRequest.builder()
                .name("Khoa nhi")
                .description("Dành cho em bé")
                .build();
        when(specialityRepository.existsByName(mockRequest.getName())).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> {
            specialityService.createSpeciality(mockRequest);
        });

        assertEquals(ErrorCode.SPECIALITIES_EXISTED, exception.getErrorCode());

        verify(specialityRepository).existsByName(mockRequest.getName());
        verify(specialityMapper, never()).toSpeciality(any());
        verify(specialityRepository, never()).save(any(Speciality.class));
        verify(specialityMapper, never()).toSpecialityResponse(any());
    }

    @Test
    void testGetAllSpecialities_Success()
    {
        List<Speciality> specialities = List.of(speciality);

        SpecialityResponse mockResponse = SpecialityResponse.builder()
                .id(1L)
                .name("Khoa nhi")
                .description("Dành cho em bé")
                .build();

        List<SpecialityResponse> responses = List.of(mockResponse);

        when(specialityRepository.findAll()).thenReturn(specialities);
        when(specialityMapper.toListSpecialityResponse(specialities)).thenReturn(responses);

        var rs = specialityService.getAllSpecialities();
        assertEquals(responses, rs);

        verify(specialityRepository).findAll();
        verify(specialityMapper).toListSpecialityResponse(specialities);
    }

    @Test
    void testGetSpeciality_Success()
    {
        SpecialityResponse mockResponse = SpecialityResponse.builder()
                .id(1L)
                .name("Khoa nhi")
                .description("Dành cho em bé")
                .build();
        when(specialityRepository.findById(speciality.getId())).thenReturn(Optional.ofNullable(speciality));
        when(specialityMapper.toSpecialityResponse(speciality)).thenReturn(mockResponse);

        var rs = specialityService.getSpeciality(speciality.getId());
        assertEquals(mockResponse, rs);

        verify(specialityRepository).findById(speciality.getId());
        verify(specialityMapper).toSpecialityResponse(speciality);
    }

    @Test
    void testGetSpeciality_SpecialityNotFound_ThrowsException()
    {
        when(specialityRepository.findById(speciality.getId())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            specialityService.getSpeciality(speciality.getId());
        });

        assertEquals(ErrorCode.SPECIALITIES_NOT_FOUND, exception.getErrorCode());

        verify(specialityRepository).findById(speciality.getId());
        verify(specialityMapper, never()).toSpecialityResponse(any());
    }

    @Test
    void testUpdateSpeciality_Success()
    {
        SpecialityUpdateRequest mockRequest = SpecialityUpdateRequest.builder()
                .name("Khoa nhi quốc tế")
                .description("Dành cho trẻ dưới 12 tuổi")
                .build();

        SpecialityResponse mockResponse = SpecialityResponse.builder()
                .name("Khoa nhi quốc tế")
                .description("Dành cho trẻ dưới 12 tuổi")
                .build();

        when(specialityRepository.findById(speciality.getId())).thenReturn(Optional.ofNullable(speciality));
        when(specialityRepository.existsByName(mockRequest.getName())).thenReturn(false);
        when(specialityMapper.toSpecialityResponse(speciality)).thenReturn(mockResponse);
        when(specialityRepository.save(speciality)).thenReturn(speciality);

        var actualResponse = specialityService.updateSpeciality(speciality.getId(), mockRequest);

        assertEquals("Khoa nhi quốc tế", actualResponse.getName());
        assertEquals("Dành cho trẻ dưới 12 tuổi", actualResponse.getDescription());

        verify(specialityRepository).findById(speciality.getId());
        verify(specialityRepository).existsByName(mockRequest.getName());
        verify(specialityMapper).updateSpeciality(speciality, mockRequest);
        verify(specialityMapper).toSpecialityResponse(speciality);
        verify(specialityRepository).save(speciality);
    }

    @Test
    void testUpdateSpeciality_SpecialityNotFound_ThrowsException()
    {
        SpecialityUpdateRequest mockRequest = SpecialityUpdateRequest.builder()
                .description("Dành cho trẻ dưới 12 tuổi")
                .build();

        when(specialityRepository.findById(speciality.getId())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            specialityService.updateSpeciality(speciality.getId(), mockRequest);
        });

        assertEquals(ErrorCode.SPECIALITIES_NOT_FOUND, exception.getErrorCode());

        verify(specialityRepository).findById(speciality.getId());
        verify(specialityRepository, never()).existsByName(anyString());
        verify(specialityMapper, never()).updateSpeciality(any(), any());
        verify(specialityRepository, never()).save(any(Speciality.class));
        verify(specialityMapper, never()).toSpecialityResponse(any());
    }

    @Test
    void testUpdateSpeciality_NameExisted_ThrowsException()
    {
        SpecialityUpdateRequest mockRequest = SpecialityUpdateRequest.builder()
                .description("Dành cho trẻ dưới 12 tuổi")
                .build();

        when(specialityRepository.findById(speciality.getId())).thenReturn(Optional.ofNullable(speciality));
        when(specialityRepository.existsByName(mockRequest.getName())).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> {
            specialityService.updateSpeciality(speciality.getId(), mockRequest);
        });

        assertEquals(ErrorCode.SPECIALITIES_EXISTED, exception.getErrorCode());

        verify(specialityRepository).findById(speciality.getId());
        verify(specialityRepository).existsByName(mockRequest.getName());
        verify(specialityMapper, never()).updateSpeciality(any(), any());
        verify(specialityRepository, never()).save(any(Speciality.class));
        verify(specialityMapper, never()).toSpecialityResponse(any());
    }

    @Test
    void testDeleteSpeciality_Success()
    {
        when(specialityRepository.existsById(speciality.getId())).thenReturn(true);
        specialityService.deleteSpeciality(speciality.getId());

        verify(specialityRepository).existsById(speciality.getId());
        verify(specialityRepository).deleteById(speciality.getId());
    }

    @Test
    void testDeleteSpeciality_SpecialityNotFound_ThrowsException()
    {
        when(specialityRepository.existsById(speciality.getId())).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> {
            specialityService.deleteSpeciality(speciality.getId());
        });

        assertEquals(ErrorCode.SPECIALITIES_NOT_FOUND, exception.getErrorCode());

        verify(specialityRepository).existsById(speciality.getId());
        verify(specialityRepository, never()).deleteById(anyLong());
    }
}
