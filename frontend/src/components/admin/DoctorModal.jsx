import React, { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';

export default function DoctorModal({ isOpen, onClose, doctor, users = [], specialities = [], onSuccess }) {
  const isEditMode = !!doctor;

  const [userId, setUserId] = useState('');
  const [specialityId, setSpecialityId] = useState('');
  const [consultationFee, setConsultationFee] = useState(300000);
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [clinicAddress, setClinicAddress] = useState('');
  const [biography, setBiography] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctor) {
      setSpecialityId(doctor.speciality?.id || '');
      setConsultationFee(doctor.consultationFee || 300000);
      setYearsOfExperience(doctor.yearsOfExperience || 5);
      setClinicAddress(doctor.clinicAddress || '');
      setBiography(doctor.biography || '');
    } else {
      setUserId(users.length > 0 ? users[0].id : '');
      setSpecialityId(specialities.length > 0 ? specialities[0].id : '');
      setConsultationFee(300000);
      setYearsOfExperience(5);
      setClinicAddress('Phòng khám 102, Tòa nhà Y khoa Quốc tế MedicalNet, TP.HCM');
      setBiography('');
    }
    setError('');
  }, [doctor, isOpen, users, specialities]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!specialityId) {
      setError('Vui lòng chọn chuyên khoa cho bác sĩ.');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        const payload = {
          specialityId: Number(specialityId),
          consultationFee: Number(consultationFee),
          yearsOfExperience: Number(yearsOfExperience),
          clinicAddress: clinicAddress.trim(),
          biography: biography.trim(),
        };
        await doctorApi.updateDoctor(doctor.id, payload);
      } else {
        if (!userId) {
          setError('Vui lòng chọn tài khoản người dùng để gắn quyền bác sĩ.');
          setLoading(false);
          return;
        }
        const payload = {
          userId,
          specialityId: Number(specialityId),
          consultationFee: Number(consultationFee),
          yearsOfExperience: Number(yearsOfExperience),
          clinicAddress: clinicAddress.trim(),
          biography: biography.trim(),
        };
        await doctorApi.createDoctor(payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Thao tác thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-base shadow-sm">
              <i className={`fa-solid ${isEditMode ? 'fa-user-pen' : 'fa-user-doctor'}`}></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditMode ? `Chỉnh sửa Hồ sơ: ${doctor.user?.fullName}` : 'Thêm Bác sĩ Mới vào Hệ thống'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? 'Cập nhật chuyên môn, biểu phí và địa chỉ phòng khám'
                  : 'Gán vai trò Bác sĩ chuyên khoa cho tài khoản người dùng'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-600 shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* User selection (only for Create mode) */}
          {!isEditMode && (
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider">
                1. Chọn Tài khoản Người dùng liên kết:
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium bg-white"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName || 'Chưa đặt tên'} — ({u.email})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Hệ thống sẽ tự động cấp thêm quyền `ROLE_DOCTOR` cho tài khoản này.
              </p>
            </div>
          )}

          {/* Speciality selection */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold uppercase tracking-wider">
              {isEditMode ? '1. Chuyên khoa Y tế:' : '2. Chuyên khoa Y tế:'}
            </label>
            <select
              value={specialityId}
              onChange={(e) => setSpecialityId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium bg-white"
            >
              <option value="">-- Chọn chuyên khoa --</option>
              {specialities.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fee & Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider">
                Chi phí khám (VNĐ):
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                required
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider">
                Kinh nghiệm (Năm):
              </label>
              <input
                type="number"
                min="0"
                max="60"
                required
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Clinic Address */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold uppercase tracking-wider">
              Địa chỉ Phòng khám / Nơi tiếp nhận:
            </label>
            <input
              type="text"
              required
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              placeholder="VD: Phòng khám 204, Bệnh viện Quốc tế MedicalNet..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
            />
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold uppercase tracking-wider">
              Tiểu sử & Quá trình Đào tạo:
            </label>
            <textarea
              rows={3}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Giới thiệu học hàm, học vị, chứng chỉ và thế mạnh chuyên môn của bác sĩ..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium leading-relaxed"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check text-xs"></i>
                  <span>{isEditMode ? 'Lưu thay đổi hồ sơ' : 'Xác nhận tạo Bác sĩ'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
