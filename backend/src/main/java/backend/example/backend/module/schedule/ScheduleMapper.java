package backend.example.backend.module.schedule;

import backend.example.backend.module.doctor.DoctorMapper;
import backend.example.backend.module.schedule.dto.ScheduleSlotResponse;
import backend.example.backend.module.schedule.dto.WorkScheduleResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DoctorMapper.class})
public interface ScheduleMapper {
    ScheduleSlotResponse toScheduleSlotResponse(ScheduleSlot slot);
    List<ScheduleSlotResponse> toListScheduleSlotResponse(List<ScheduleSlot> slots);
    WorkScheduleResponse toWorkScheduleResponse(WorkSchedule schedule);
    List<WorkScheduleResponse> toListWorkScheduleResponse(List<WorkSchedule> schedules);
}
