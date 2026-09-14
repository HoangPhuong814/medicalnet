-- =========================================================================
-- FILE: sample_data.sql
-- MÔ TẢ: Khởi tạo dữ liệu mẫu cho hệ thống MedicalNet
-- Mật khẩu mặc định:
--   - Admin: admin@medicalnet.com / admin123
--   - Bác sĩ Tuấn: doctor.tuan@medicalnet.com / doctor123
--   - Bác sĩ Lan: doctor.lan@medicalnet.com / doctor123
--   - Bệnh nhân An: patient@medicalnet.com / patient123
-- =========================================================================

-- 1. Quyền hạn (Permissions)
INSERT INTO permissions (id, name, description) VALUES
(1, 'MANAGE_USERS', 'Quản lý tài khoản người dùng'),
(2, 'MANAGE_DOCTORS', 'Quản lý thông tin và danh mục bác sĩ'),
(3, 'MANAGE_APPOINTMENTS', 'Quản lý lịch hẹn khám bệnh'),
(4, 'VIEW_REPORTS', 'Xem báo cáo doanh thu và thống kê')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('permissions', 'id'), coalesce(max(id), 1)) FROM permissions;

-- 2. Vai trò (Roles)
INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Quản trị viên toàn hệ thống'),
(2, 'DOCTOR', 'Bác sĩ chuyên khoa'),
(3, 'PATIENT', 'Bệnh nhân khám bệnh')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('roles', 'id'), coalesce(max(id), 1)) FROM roles;

-- 3. Gán quyền cho vai trò (Role Permissions)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Admin có toàn quyền
(2, 3),                         -- Bác sĩ quản lý lịch hẹn
(3, 3)                          -- Bệnh nhân quản lý lịch hẹn cá nhân
ON CONFLICT DO NOTHING;

-- 4. Người dùng (Users)
-- Mật khẩu đã được mã hóa bằng BCrypt (strength 10)
INSERT INTO users (id, email, password, full_name, date_of_birth, gender, is_active, created_at, updated_at) VALUES
('usr-admin-001', 'admin@medicalnet.com', '$2a$10$kJrboFOZrCNKeiY/yrFDCOlzTzCIb6Inix1n1gh0xk810YH0Ih1we', 'Hệ Thống Quản Trị', '1990-01-01', 'Male', true, NOW(), NOW()),
('usr-doc-001', 'doctor.tuan@medicalnet.com', '$2a$10$sycdNR5357ikacq61KpDN.JjmNn8BHKqs9hB0OPynhaDG./PzWFWK', 'BS.CKII Trần Minh Tuấn', '1982-05-12', 'Male', true, NOW(), NOW()),
('usr-doc-002', 'doctor.lan@medicalnet.com', '$2a$10$sycdNR5357ikacq61KpDN.JjmNn8BHKqs9hB0OPynhaDG./PzWFWK', 'ThS.BS Nguyễn Hương Lan', '1989-10-24', 'Female', true, NOW(), NOW()),
('usr-patient-001', 'patient@medicalnet.com', '$2a$10$5yn7K4kzVHWcgTvnl8jTGuH1nYoeE6u2pTWLgOpyVSCOHgUeub3Za', 'Nguyễn Văn An', '1998-08-18', 'Male', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Gán vai trò cho người dùng (Users Roles)
INSERT INTO users_roles (user_id, role_id) VALUES
('usr-admin-001', 1),   -- Admin
('usr-doc-001', 2),     -- Bác sĩ Tuấn
('usr-doc-002', 2),     -- Bác sĩ Lan
('usr-patient-001', 3)  -- Bệnh nhân An
ON CONFLICT DO NOTHING;

-- 6. Chuyên khoa (Speciality)
INSERT INTO speciality (id, name, description, icon_url) VALUES
(1, 'Tim Mạch', 'Khám, chẩn đoán và điều trị các bệnh lý tim mạch, huyết áp', NULL),
(2, 'Da Liễu', 'Chăm sóc da liễu thẩm mỹ, trị mụn, dị ứng và các bệnh ngoài da', NULL),
(3, 'Nhi Khoa', 'Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh và trẻ nhỏ', NULL),
(4, 'Thần Kinh', 'Điều trị đau đầu, mất ngủ, đột quỵ và rối loạn tiền đình', NULL),
(5, 'Răng Hàm Mặt', 'Nha khoa tổng quát, niềng răng, bọc sứ và thẩm mỹ nụ cười', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('speciality', 'id'), coalesce(max(id), 1)) FROM speciality;

-- 7. Hồ sơ Bác sĩ (Doctor)
INSERT INTO doctor (id, user_id, speciality_id, consultation_fee, years_of_experience, biography, clinic_address) VALUES
(1, 'usr-doc-001', 1, 300000.00, 15, 'Bác sĩ Chuyên khoa II Tim mạch với hơn 15 năm kinh nghiệm công tác tại các bệnh viện tuyến trung ương.', 'Phòng khám 101, Tòa nhà MedicalNet, Quận 1, TP.HCM'),
(2, 'usr-doc-002', 2, 250000.00, 8, 'Thạc sĩ Bác sĩ Da liễu thẩm mỹ, chuyên gia điều trị mụn và trẻ hóa da công nghệ cao.', 'Phòng khám 202, Tòa nhà MedicalNet, Quận 1, TP.HCM')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('doctor', 'id'), coalesce(max(id), 1)) FROM doctor;

-- 8. Lịch làm việc của Bác sĩ (Work Schedules) - Đặt lịch vào ngày mai
INSERT INTO work_schedules (id, doctor_id, work_date, start_time, end_time) VALUES
(1, 1, CURRENT_DATE + INTERVAL '1 day', '08:00:00', '11:30:00'),
(2, 2, CURRENT_DATE + INTERVAL '1 day', '13:30:00', '17:00:00')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('work_schedules', 'id'), coalesce(max(id), 1)) FROM work_schedules;

-- 9. Khung giờ khám (Schedule Slots) - mỗi khung 30 phút
INSERT INTO schedule_slots (id, schedule_id, start_time, end_time, version) VALUES
-- Ca sáng Bác sĩ Tuấn
(1, 1, '08:00:00', '08:30:00', 0),
(2, 1, '08:30:00', '09:00:00', 0),
(3, 1, '09:00:00', '09:30:00', 0),
(4, 1, '09:30:00', '10:00:00', 0),
(5, 1, '10:00:00', '10:30:00', 0),
(6, 1, '10:30:00', '11:00:00', 0),
(7, 1, '11:00:00', '11:30:00', 0),
-- Ca chiều Bác sĩ Lan
(8, 2, '13:30:00', '14:00:00', 0),
(9, 2, '14:00:00', '14:30:00', 0),
(10, 2, '14:30:00', '15:00:00', 0),
(11, 2, '15:00:00', '15:30:00', 0),
(12, 2, '15:30:00', '16:00:00', 0),
(13, 2, '16:00:00', '16:30:00', 0),
(14, 2, '16:30:00', '17:00:00', 0)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('schedule_slots', 'id'), coalesce(max(id), 1)) FROM schedule_slots;
