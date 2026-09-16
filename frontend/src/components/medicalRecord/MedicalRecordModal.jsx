import React, { useState, useEffect } from 'react';
import { medicalRecordApi } from '../../api/medicalRecordApi';

export default function MedicalRecordModal({
  isOpen,
  onClose,
  appointment,
  mode = 'view', // 'view' or 'create'
  onSuccess,
}) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states for creation
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    prescription: '',
    treatmentPlan: '',
    followUpDate: '',
  });

  useEffect(() => {
    if (!isOpen || !appointment) return;

    setError('');
    if (mode === 'create') {
      setFormData({
        symptoms: appointment.reason || '',
        diagnosis: '',
        prescription: '',
        treatmentPlan: 'Uống thuốc đúng liều, kiêng đồ uống có cồn, nghỉ ngơi hợp lý.',
        followUpDate: '',
      });
      setRecord(null);
    } else {
      // View mode: fetch existing record
      setLoading(true);
      medicalRecordApi
        .getRecordByAppointmentId(appointment.id)
        .then((data) => {
          setRecord(data);
        })
        .catch((err) => {
          setError(err.message || 'Chưa tìm thấy bệnh án cho ca khám này.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, appointment, mode]);

  if (!isOpen || !appointment) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis.trim()) {
      setError('Vui lòng nhập chẩn đoán bệnh.');
      return;
    }
    if (!formData.prescription.trim()) {
      setError('Vui lòng nhập thông tin đơn thuốc.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        appointmentId: appointment.id,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        prescription: formData.prescription,
        treatmentPlan: formData.treatmentPlan,
        followUpDate: formData.followUpDate || null,
      };

      const result = await medicalRecordApi.createMedicalRecord(payload);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể tạo bệnh án. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <i className="fa-solid fa-file-waveform"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {mode === 'create' ? 'Ghi Bệnh Án & Kê Đơn Thuốc' : 'Hồ Sơ Bệnh Án & Toa Thuốc Điện Tử'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Mã ca khám: #{appointment.id} • Ngày: {appointment.appointmentDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
              <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Mode 1: CREATE MEDICAL RECORD (DOCTOR) */}
          {mode === 'create' ? (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Patient Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Bệnh nhân:</span>
                  <strong className="text-slate-900 text-sm">
                    {appointment.patientName || 'Nguyễn Văn An'}
                  </strong>
                  <span className="text-slate-500 ml-1.5">({appointment.patientEmail})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Giờ khám:</span>
                  <span className="font-semibold text-slate-700">
                    {appointment.startTime?.substring(0, 5)} - {appointment.endTime?.substring(0, 5)}
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Triệu chứng lâm sàng ghi nhận:
                </label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Ví dụ: Đau tức ngực trái, mệt mỏi khi vận động..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Chẩn đoán y khoa (Diagnosis) <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  required
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Ví dụ: Rối loạn nhịp tim nhẹ, huyết áp giai đoạn 1..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 font-semibold"
                />
              </div>

              {/* Prescription */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Đơn thuốc & Liều dùng (Prescription) <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  rows={4}
                  name="prescription"
                  required
                  value={formData.prescription}
                  onChange={handleChange}
                  placeholder="1. Amlodipine 5mg: 01 viên uống buổi sáng&#10;2. Aspirin 81mg: 01 viên sau ăn&#10;3. Bổ trợ tim mạch Q10: 01 viên/ngày"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 font-mono"
                ></textarea>
              </div>

              {/* Treatment Plan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  4. Lời dặn & Kế hoạch điều trị:
                </label>
                <textarea
                  rows={2}
                  name="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={handleChange}
                  placeholder="Dặn dò chế độ dinh dưỡng, vận động nhẹ, liên hệ ngay nếu tái phát triệu chứng..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                ></textarea>
              </div>

              {/* Follow up Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Hẹn ngày tái khám (tùy chọn):
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu bệnh án...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check text-xs"></i>
                      <span>Lưu Bệnh Án & Hoàn Tất Khám</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : loading ? (
            /* Mode 2: VIEW MEDICAL RECORD (LOADING) */
            <div className="py-12 text-center text-xs text-slate-500">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Đang tải thông tin toa thuốc & bệnh án...
            </div>
          ) : record ? (
            /* Mode 2: VIEW MEDICAL RECORD (OFFICIAL PRESCRIPTION SLIP) */
            <div className="space-y-4 print:p-0">
              {/* Slip Header */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 flex items-start justify-between">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                    Bệnh viện Đa khoa MedicalNet
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    TOA THUỐC ĐIỆN TỬ
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mã hồ sơ: <strong>MR-{record.id}</strong> • Mã ca khám: #{record.appointmentId}
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[11px]">Bác sĩ chỉ định</span>
                  <strong className="text-slate-900 flex items-center gap-1 justify-end font-semibold">
                    {record.doctorName}
                    <i className="fa-solid fa-circle-check text-sky-500 text-[10px]"></i>
                  </strong>
                  <span className="text-teal-700 text-[11px]">{record.specialityName}</span>
                </div>
              </div>

              {/* Patient Details Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Họ và tên bệnh nhân:</span>
                  <strong className="text-slate-900">{record.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Ngày sinh:</span>
                  <span className="text-slate-700">{record.dateOfBirth || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Triệu chứng:</span>
                  <span className="text-slate-700">{record.symptoms || 'Khám tổng quát'}</span>
                </div>
              </div>

              {/* Clinical Diagnosis */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs space-y-1">
                <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px] block">
                  Chẩn đoán xác định:
                </span>
                <p className="text-slate-900 font-bold text-sm">
                  {record.diagnosis}
                </p>
              </div>

              {/* Prescription Body */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-pills text-teal-600"></i>
                  Đơn thuốc & Hướng dẫn sử dụng:
                </span>
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {record.prescription}
                </div>
              </div>

              {/* Treatment Plan & Advice */}
              {record.treatmentPlan && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    Lời dặn & Hướng dẫn sinh hoạt:
                  </span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {record.treatmentPlan}
                  </p>
                </div>
              )}

              {/* Follow-up Date */}
              {record.followUpDate && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/60 text-xs text-teal-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <i className="fa-regular fa-calendar text-teal-600"></i>
                    Hẹn ngày tái khám định kỳ:
                  </span>
                  <strong className="text-slate-900 font-bold">{record.followUpDate}</strong>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-print text-xs"></i>
                  In toa thuốc
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Không có dữ liệu bệnh án cho ca khám này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
