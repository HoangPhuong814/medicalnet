import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '../../api/appointmentApi';
import DoctorAvatar from '../../components/common/DoctorAvatar';
import MedicalRecordModal from '../../components/medicalRecord/MedicalRecordModal';
import ReviewModal from '../../components/review/ReviewModal';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Medical Record Modal state
  const [selectedAppointmentForRecord, setSelectedAppointmentForRecord] = useState(null);

  // Review Modal state
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'next7days' | 'thisMonth' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    // Status Filter
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) {
      return false;
    }

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const docName = (apt.doctorName || '').toLowerCase();
      const spec = (apt.specialityName || '').toLowerCase();
      const reason = (apt.reason || '').toLowerCase();
      const addr = (apt.clinicAddress || '').toLowerCase();
      if (!docName.includes(q) && !spec.includes(q) && !reason.includes(q) && !addr.includes(q)) {
        return false;
      }
    }

    // Date Filter
    if (dateFilter !== 'all' && apt.appointmentDate) {
      const aptDate = new Date(apt.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        if (aptDate.getTime() !== today.getTime()) return false;
      } else if (dateFilter === 'next7days') {
        const next7 = new Date(today);
        next7.setDate(next7.getDate() + 7);
        if (aptDate < today || aptDate > next7) return false;
      } else if (dateFilter === 'thisMonth') {
        if (
          aptDate.getMonth() !== today.getMonth() ||
          aptDate.getFullYear() !== today.getFullYear()
        ) {
          return false;
        }
      } else if (dateFilter === 'custom') {
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          if (aptDate < start) return false;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          if (aptDate > end) return false;
        }
      }
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'ALL' ||
    dateFilter !== 'all' ||
    customStartDate !== '' ||
    customEndDate !== '';

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
            Theo dõi trạng thái lịch hẹn, khung giờ khám và xem toa thuốc điện tử
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/my-medical-records"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-teal-200 bg-teal-50/60 hover:bg-teal-100 text-teal-800 text-xs font-semibold shadow-xs transition-all duration-200"
          >
            <i className="fa-solid fa-file-waveform text-teal-600"></i>
            Sổ Bệnh Án Điện Tử
          </Link>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            Đặt lịch khám mới
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-fade-in shadow-xs">
          <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
          <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Smart Search & Date Range Filter Toolbar */}
      {!loading && appointments.length > 0 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
          {/* Top row: Search input & Status pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-md">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên bác sĩ, chuyên khoa, lý do khám..."
                className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-slate-50/50 hover:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'CONFIRMED', label: 'Đã xác nhận' },
                { id: 'PENDING', label: 'Chờ khám' },
                { id: 'COMPLETED', label: 'Đã khám xong' },
                { id: 'CANCELLED', label: 'Đã hủy' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: Quick Date Range Pills & Custom Date Picker */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Lọc theo ngày:
              </span>
              {[
                { id: 'all', label: 'Tất cả ngày', icon: 'fa-calendar' },
                { id: 'today', label: 'Hôm nay', icon: 'fa-calendar-day' },
                { id: 'next7days', label: '7 ngày tới', icon: 'fa-calendar-week' },
                { id: 'thisMonth', label: 'Tháng này', icon: 'fa-calendar' },
                { id: 'custom', label: 'Tùy chọn khoảng ngày', icon: 'fa-calendar-days' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDateFilter(d.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                    dateFilter === d.id
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fa-regular ${d.icon} text-[10px]`}></i>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0"
              >
                <i className="fa-solid fa-rotate-left text-[10px]"></i>
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
          </div>

          {/* Custom Date Range Picker inputs if 'custom' is active */}
          {dateFilter === 'custom' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-3 text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Từ ngày:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Đến ngày:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              {(customStartDate || customEndDate) && (
                <span className="text-[11px] text-teal-700 font-medium">
                  Đang lọc từ {customStartDate || '...'} đến {customEndDate || '...'}
                </span>
              )}
            </div>
          )}

          {/* Results Counter */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>
              Hiển thị <strong>{filteredAppointments.length}</strong> trên tổng số <strong>{appointments.length}</strong> lịch hẹn
            </span>
          </div>
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
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <i className="fa-solid fa-filter-circle-xmark text-xl"></i>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy lịch hẹn phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không có lịch khám nào khớp với bộ lọc ngày hoặc từ khóa tìm kiếm của bạn.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Xóa bộ lọc & Xem tất cả
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const photo = getDoctorImage(apt.doctorName);
            return (
              <div
                key={apt.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-1">
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
                  <div className="space-y-2 flex-1">
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
                <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center shrink-0">
                  {apt.status === 'COMPLETED' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedAppointmentForRecord(apt)}
                        className="px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/70 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <i className="fa-solid fa-file-prescription text-xs"></i>
                        <span>Xem Toa thuốc & Bệnh án</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedAppointmentForReview(apt)}
                        className="px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <i className="fa-solid fa-star text-xs text-amber-500"></i>
                        <span>Đánh giá bác sĩ</span>
                      </button>
                    </>
                  )}

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

      {/* Medical Record View Modal for Patient */}
      <MedicalRecordModal
        isOpen={Boolean(selectedAppointmentForRecord)}
        appointment={selectedAppointmentForRecord}
        mode="view"
        onClose={() => setSelectedAppointmentForRecord(null)}
      />

      {/* Review Modal for Patient */}
      <ReviewModal
        isOpen={Boolean(selectedAppointmentForReview)}
        appointment={selectedAppointmentForReview}
        onClose={() => setSelectedAppointmentForReview(null)}
        onSuccess={() => {
          setToastMessage('Cảm ơn bạn đã gửi đánh giá cho bác sĩ thành công!');
          setTimeout(() => setToastMessage(''), 5000);
        }}
      />
    </div>
  );
}
