import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '../../api/appointmentApi';
import DoctorAvatar from '../../components/common/DoctorAvatar';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await appointmentApi.getMyBookings();
      setAppointments(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách lịch khám của bạn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này không?')) return;
    setCancellingId(id);
    try {
      await appointmentApi.cancelAppointment(id);
      await fetchBookings();
    } catch (err) {
      alert(err.message || 'Không thể hủy lịch hẹn.');
    } finally {
      setCancellingId(null);
    }
  };

  const getDoctorImage = (name) => {
    if (!name) return null;
    const lower = name.toLowerCase();
    if (lower.includes('tuấn') || lower.includes('tuan')) {
      return '/images/doctors/doctor-tuan.jpg';
    }
    if (lower.includes('lan')) {
      return '/images/doctors/doctor-lan.jpg';
    }
    return null;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 ring-1 ring-amber-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ xác nhận
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 ring-1 ring-teal-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            Đã xác nhận
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Đã khám xong
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 ring-1 ring-rose-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 ring-1 ring-slate-400/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lịch khám của tôi</h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi trạng thái lịch hẹn, khung giờ và địa điểm thăm khám trực tiếp
          </p>
        </div>
        <Link
          to="/doctors"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95"
        >
          <i className="fa-solid fa-plus text-[10px]"></i>
          Đặt lịch khám mới
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
          <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Đang tải danh sách lịch khám...
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <i className="fa-regular fa-calendar-xmark text-3xl"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">Bạn chưa có lịch hẹn khám nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Hãy chọn một bác sĩ chuyên khoa phù hợp và đặt khung giờ tư vấn để được chăm sóc sức khỏe tốt nhất.
          </p>
          <div className="pt-2">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <i className="fa-solid fa-stethoscope text-xs"></i>
              Xem danh sách bác sĩ
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const photo = getDoctorImage(apt.doctorName);
            return (
              <div
                key={apt.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar Thumbnail */}
                  <div className="relative shrink-0">
                    {photo ? (
                      <img
                        src={photo}
                        alt={apt.doctorName}
                        className="w-14 h-14 rounded-2xl object-cover object-top ring-2 ring-teal-50"
                      />
                    ) : (
                      <DoctorAvatar name={apt.doctorName} size="md" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-xs">
                      <i className="fa-solid fa-circle-check text-sky-500 text-[10px]"></i>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900">
                        {apt.doctorName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
                        {apt.specialityName}
                      </span>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <i className="fa-regular fa-calendar text-xs text-teal-600"></i>
                        <span>Ngày khám: <strong>{apt.appointmentDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <i className="fa-regular fa-clock text-xs text-teal-600"></i>
                        <span>Giờ: <strong>{apt.startTime?.substring(0, 5)} - {apt.endTime?.substring(0, 5)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-slate-500">
                      <i className="fa-solid fa-location-dot text-xs text-slate-400 mt-0.5"></i>
                      <span>{apt.clinicAddress}</span>
                    </div>

                    {apt.reason && (
                      <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 mt-1 max-w-xl">
                        <strong className="text-slate-700">Lý do khám:</strong> {apt.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                  {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      disabled={cancellingId === apt.id}
                      className="px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {cancellingId === apt.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang hủy...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-calendar-xmark text-xs"></i>
                          <span>Hủy lịch khám</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
