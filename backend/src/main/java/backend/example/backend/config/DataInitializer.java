package backend.example.backend.config;

import backend.example.backend.module.doctor.Doctor;
import backend.example.backend.module.doctor.DoctorRepository;
import backend.example.backend.module.schedule.ScheduleSlot;
import backend.example.backend.module.schedule.WorkSchedule;
import backend.example.backend.module.schedule.WorkScheduleRepository;
import backend.example.backend.module.speciality.Speciality;
import backend.example.backend.module.speciality.SpecialityRepository;
import backend.example.backend.module.user.Role;
import backend.example.backend.module.user.RoleRepository;
import backend.example.backend.module.user.User;
import backend.example.backend.module.user.UserRepository;
import backend.example.backend.module.user.enums.GenderEnum;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DataInitializer implements CommandLineRunner {

    RoleRepository roleRepository;
    UserRepository userRepository;
    SpecialityRepository specialityRepository;
    DoctorRepository doctorRepository;
    WorkScheduleRepository workScheduleRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            initRolesAndUsers();
            initSpecialitiesAndDoctors();
            log.info("MedicalNet DataInitializer completed successfully!");
        } catch (Exception e) {
            log.error("Error during DataInitializer: {}", e.getMessage(), e);
        }
    }

    private void initRolesAndUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() ->
                roleRepository.save(Role.builder().name("ADMIN").description("Quản trị viên toàn hệ thống").build()));
        Role doctorRole = roleRepository.findByName("DOCTOR").orElseGet(() ->
                roleRepository.save(Role.builder().name("DOCTOR").description("Bác sĩ chuyên khoa").build()));
        Role patientRole = roleRepository.findByName("PATIENT").orElseGet(() ->
                roleRepository.save(Role.builder().name("PATIENT").description("Bệnh nhân khám bệnh").build()));
        roleRepository.findByName("USER").orElseGet(() ->
                roleRepository.save(Role.builder().name("USER").description("Người dùng bình thường").build()));

        // 1. Admin: admin@medicalnet.com / admin123
        if (!userRepository.existsByEmail("admin@medicalnet.com")) {
            User admin = new User();
            admin.setEmail("admin@medicalnet.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Hệ Thống Quản Trị");
            admin.setGender(GenderEnum.Male);
            admin.setDateOfBirth(LocalDate.of(1990, 1, 1));
            admin.setActive(true);
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            log.info("Created default Admin: admin@medicalnet.com");
        }

        // 2. Patient: patient@medicalnet.com / patient123
        if (!userRepository.existsByEmail("patient@medicalnet.com")) {
            User patient = new User();
            patient.setEmail("patient@medicalnet.com");
            patient.setPassword(passwordEncoder.encode("patient123"));
            patient.setFullName("Nguyễn Văn An");
            patient.setGender(GenderEnum.Male);
            patient.setDateOfBirth(LocalDate.of(1998, 8, 18));
            patient.setActive(true);
            patient.setRoles(Set.of(patientRole));
            userRepository.save(patient);
            log.info("Created default Patient: patient@medicalnet.com");
        }
    }

    private void initSpecialitiesAndDoctors() {
        Role doctorRole = roleRepository.findByName("DOCTOR").orElse(null);

        // Specialities
        Speciality timMach = specialityRepository.findAll().stream()
                .filter(s -> "Tim Mạch".equalsIgnoreCase(s.getName()))
                .findFirst()
                .orElseGet(() -> specialityRepository.save(new Speciality(null, "Tim Mạch", "Khám, chẩn đoán và điều trị các bệnh lý tim mạch, huyết áp", null)));

        Speciality daLieu = specialityRepository.findAll().stream()
                .filter(s -> "Da Liễu".equalsIgnoreCase(s.getName()))
                .findFirst()
                .orElseGet(() -> specialityRepository.save(new Speciality(null, "Da Liễu", "Chăm sóc da liễu thẩm mỹ, trị mụn, dị ứng và các bệnh ngoài da", null)));

        if (specialityRepository.count() < 5) {
            specialityRepository.save(new Speciality(null, "Nhi Khoa", "Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh và trẻ nhỏ", null));
            specialityRepository.save(new Speciality(null, "Thần Kinh", "Điều trị đau đầu, mất ngủ, đột quỵ và rối loạn tiền đình", null));
            specialityRepository.save(new Speciality(null, "Răng Hàm Mặt", "Nha khoa tổng quát, niềng răng, bọc sứ và thẩm mỹ nụ cười", null));
        }

        // Doctor Tuấn: doctor.tuan@medicalnet.com / doctor123
        User docTuanUser = userRepository.findByEmail("doctor.tuan@medicalnet.com").orElseGet(() -> {
            User doc = new User();
            doc.setEmail("doctor.tuan@medicalnet.com");
            doc.setPassword(passwordEncoder.encode("doctor123"));
            doc.setFullName("BS.CKII Trần Minh Tuấn");
            doc.setGender(GenderEnum.Male);
            doc.setDateOfBirth(LocalDate.of(1982, 5, 12));
            doc.setActive(true);
            if (doctorRole != null) doc.setRoles(Set.of(doctorRole));
            return userRepository.save(doc);
        });

        Doctor docTuan = doctorRepository.findByUserId(docTuanUser.getId()).orElseGet(() ->
                doctorRepository.save(Doctor.builder()
                        .user(docTuanUser)
                        .speciality(timMach)
                        .consultationFee(BigDecimal.valueOf(300000))
                        .yearsOfExperience(15)
                        .biography("Bác sĩ Chuyên khoa II Tim mạch với hơn 15 năm kinh nghiệm công tác tại các bệnh viện tuyến trung ương.")
                        .clinicAddress("Phòng khám 101, Tòa nhà MedicalNet, Quận 1, TP.HCM")
                        .build())
        );

        // Doctor Lan: doctor.lan@medicalnet.com / doctor123
        User docLanUser = userRepository.findByEmail("doctor.lan@medicalnet.com").orElseGet(() -> {
            User doc = new User();
            doc.setEmail("doctor.lan@medicalnet.com");
            doc.setPassword(passwordEncoder.encode("doctor123"));
            doc.setFullName("ThS.BS Nguyễn Hương Lan");
            doc.setGender(GenderEnum.Female);
            doc.setDateOfBirth(LocalDate.of(1989, 10, 24));
            doc.setActive(true);
            if (doctorRole != null) doc.setRoles(Set.of(doctorRole));
            return userRepository.save(doc);
        });

        Doctor docLan = doctorRepository.findByUserId(docLanUser.getId()).orElseGet(() ->
                doctorRepository.save(Doctor.builder()
                        .user(docLanUser)
                        .speciality(daLieu)
                        .consultationFee(BigDecimal.valueOf(250000))
                        .yearsOfExperience(8)
                        .biography("Thạc sĩ Bác sĩ Da liễu thẩm mỹ, chuyên gia điều trị mụn và trẻ hóa da công nghệ cao.")
                        .clinicAddress("Phòng khám 202, Tòa nhà MedicalNet, Quận 1, TP.HCM")
                        .build())
        );

        // WorkSchedule & Slots for tomorrow
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        if (!workScheduleRepository.existsByDoctorIdAndWorkDate(docTuan.getId(), tomorrow)) {
            createScheduleWithSlots(docTuan, tomorrow, LocalTime.of(8, 0), LocalTime.of(11, 30));
        }
        if (!workScheduleRepository.existsByDoctorIdAndWorkDate(docLan.getId(), tomorrow)) {
            createScheduleWithSlots(docLan, tomorrow, LocalTime.of(13, 30), LocalTime.of(17, 0));
        }
    }

    private void createScheduleWithSlots(Doctor doctor, LocalDate date, LocalTime start, LocalTime end) {
        WorkSchedule schedule = WorkSchedule.builder()
                .doctor(doctor)
                .workDate(date)
                .startTime(start)
                .endTime(end)
                .build();

        List<ScheduleSlot> slots = new ArrayList<>();
        LocalTime current = start;
        while (current.plusMinutes(30).isBefore(end) || current.plusMinutes(30).equals(end)) {
            LocalTime slotEnd = current.plusMinutes(30);
            slots.add(ScheduleSlot.builder()
                    .workSchedule(schedule)
                    .startTime(current)
                    .endTime(slotEnd)
                    .version(0)
                    .build());
            current = slotEnd;
        }
        schedule.setSlots(slots);
        workScheduleRepository.save(schedule);
    }
}
