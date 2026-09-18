import React, { useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import DoctorAvatar from '../common/DoctorAvatar';

export default function ReviewModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !appointment) return null;

  const ratingDescriptions = {
    1: 'Rất không hài lòng',
    2: 'Chưa hài lòng',
    3: 'Bình thường',
    4: 'Hài lòng',
    5: 'Rất hài lòng & tận tâm',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      setError('Vui lòng chọn số sao đánh giá (từ 1 đến 5 sao).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        appointmentId: appointment.id,
        rating,
        comment: comment.trim() || 'Bác sĩ thăm khám rất tận tâm và chu đáo.',
      };

      const result = await reviewApi.createReview(payload);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể gửi đánh giá. Bạn có thể đã gửi đánh giá cho ca khám này rồi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <i className="fa-solid fa-star"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Đánh Giá Trải Nghiệm Khám Bệnh
              </h2>
              <p className="text-[11px] text-slate-500">
                Ca khám #{appointment.id} • Ngày {appointment.appointmentDate}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
              <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Doctor Info Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <DoctorAvatar name={appointment.doctorName} size="md" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {appointment.doctorName}
                <i className="fa-solid fa-circle-check text-sky-500 text-[10px]"></i>
              </h3>
              <p className="text-xs text-teal-700 font-medium">{appointment.specialityName}</p>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center py-2 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mức độ hài lòng của bạn:
            </label>
            <div className="flex items-center justify-center gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                >
                  <i
                    className={`fa-star text-2xl transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fa-solid text-amber-400 drop-shadow-xs'
                        : 'fa-regular text-slate-300'
                    }`}
                  ></i>
                </button>
              ))}
            </div>
            <div className="text-xs font-semibold text-amber-600">
              {ratingDescriptions[hoverRating || rating]}
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nhận xét chi tiết về buổi khám (tùy chọn):
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận về thái độ, sự tận tâm và phác đồ điều trị của bác sĩ..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
            ></textarea>
          </div>

          {/* Actions */}
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
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi đánh giá...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  <span>Gửi Đánh Giá</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
