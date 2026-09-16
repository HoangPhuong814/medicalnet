import React, { useState } from 'react';
import { scheduleApi } from '../../api/scheduleApi';

export default function CreateScheduleModal({ isOpen, onClose, doctorId, onSuccess }) {
  const [workDate, setWorkDate] = useState(() => {
    // Default tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Calculate estimated slots
  const calculateSlotsCount = () => {
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      if (endMinutes <= startMinutes) return 0;
      return Math.floor((endMinutes - startMinutes) / slotDurationMinutes);
    } catch (e) {
      return 0;
    }
  };

  const slotsCount = calculateSlotsCount();

  const applyPreset = (preset) => {
    if (preset === 'MORNING') {
      setStartTime('08:00');
      setEndTime('12:00');
    } else if (preset === 'AFTERNOON') {
      setStartTime('13:30');
      setEndTime('17:30');
    } else if (preset === 'ALL_DAY') {
      setStartTime('08:00');
      setEndTime('17:00');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (slotsCount <= 0) {
      setError('Giờ kết thúc phải lớn hơn giờ bắt đầu ca khám.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        doctorId: Number(doctorId || 1),
        workDate,
        startTime: startTime.length === 5 ? `${startTime}:00` : startTime,
        endTime: endTime.length === 5 ? `${endTime}:00` : endTime,
        slotDurationMinutes: Number(slotDurationMinutes),
      };

      await scheduleApi.createSchedule(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể đăng ký ca làm việc. Có thể ngày này bác sĩ đã mở ca trực.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-base shadow-sm">
              <i className="fa-solid fa-calendar-plus"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Đăng ký Ca làm việc Mới
              </h3>
              <p className="text-xs text-slate-500">
                Mở ca trực để bệnh nhân có thể đặt lịch khám trực tuyến
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-600 shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Presets */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-2">
              Chọn nhanh ca mẫu:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('MORNING')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  startTime === '08:00' && endTime === '12:00'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <i className="fa-regular fa-sun text-amber-500 block mb-1 text-sm"></i>
                Ca Sáng (08:00 - 12:00)
              </button>

              <button
                type="button"
                onClick={() => applyPreset('AFTERNOON')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  startTime === '13:30' && endTime === '17:30'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <i className="fa-regular fa-clock text-sky-500 block mb-1 text-sm"></i>
                Ca Chiều (13:30 - 17:30)
              </button>

              <button
                type="button"
                onClick={() => applyPreset('ALL_DAY')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  startTime === '08:00' && endTime === '17:00'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <i className="fa-solid fa-calendar-day text-teal-600 block mb-1 text-sm"></i>
                Cả Ngày (08:00 - 17:00)
              </button>
            </div>
          </div>

          {/* Work Date */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold uppercase tracking-wider">
              1. Ngày làm việc:
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
            />
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider">
                2. Giờ bắt đầu:
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider">
                3. Giờ kết thúc:
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Slot duration preview */}
          <div className="p-4 bg-teal-50/80 border border-teal-200/70 rounded-2xl flex items-center justify-between text-teal-900">
            <div>
              <span className="font-bold block">Tự động chia ca 30 phút</span>
              <span className="text-[11px] text-teal-700">Chuẩn tiếp đón bệnh nhân đúng giờ</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-teal-800">{slotsCount}</span>
              <span className="text-[11px] text-teal-600 block">Lượt khám bệnh</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading || slotsCount <= 0}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang khởi tạo ca khám...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check text-xs"></i>
                  <span>Xác nhận Mở ca làm việc</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
