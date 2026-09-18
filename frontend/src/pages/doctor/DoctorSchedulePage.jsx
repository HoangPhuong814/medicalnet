import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import { scheduleApi } from '../../api/scheduleApi';
import MedicalRecordModal from '../../components/medicalRecord/MedicalRecordModal';
import CreateScheduleModal from '../../components/schedule/CreateScheduleModal';

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('APPOINTMENTS'); // 'APPOINTMENTS' | 'SHIFTS'
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    appointment: null,
    mode: 'view',
  });
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);

  // Search and Date Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const fetchDoctorAppointments = async () => {
    try {
      const data = await appointmentApi.getDoctorAppointments(1);
      setAppointments(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách ca khám của bác sĩ.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorSchedules = async () => {
    setShiftsLoading(true);
    try {
      const data = await scheduleApi.getUpcomingSchedules(1);
      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching doctor schedules:', err);
    } finally {
      setShiftsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
    fetchDoctorSchedules();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    // 1. Status Filter
    if (activeFilter !== 'ALL' && apt.status !== activeFilter) {
      return false;
    }

    // 2. Search Filter (Patient name, email, symptoms, reason)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const pName = (apt.patientName || apt.patient?.user?.fullName || '').toLowerCase();
      const pEmail = (apt.patientEmail || apt.patient?.user?.email || '').toLowerCase();
      const reason = (apt.reason || apt.symptoms || '').toLowerCase();
      if (!pName.includes(q) && !pEmail.includes(q) && !reason.includes(q)) {
        return false;
      }
    }

    // 3. Date Range Filter
    if (dateFilter !== 'all' && apt.appointmentDate) {
      const aptDate = new Date(apt.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        if (aptDate.getTime() !== today.getTime()) return false;
      } else if (dateFilter === 'thisWeek') {
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
        if (aptDate < firstDayOfWeek || aptDate > lastDayOfWeek) return false;
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
    setActiveFilter('ALL');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    activeFilter !== 'ALL' ||
    dateFilter !== 'all' ||
    customStartDate !== '' ||
    customEndDate !== '';

  const openMedicalRecord = (appointment, mode) => {
    setModalState({
      isOpen: true,
      appointment,
      mode,
    });
  };

  const handleRecordSuccess = (newRecord) => {
    setSuccessMessage(`Đã hoàn tất ca khám và lưu toa thuốc cho bệnh nhân thành công!`);
    setTimeout(() => setSuccessMessage(''), 5000);
    fetchDoctorAppointments();
  };

  const handleScheduleCreated = () => {
    setSuccessMessage(`Đăng ký ca làm việc mới thành công! Hệ thống đã tự động chia các khung giờ 30 phút.`);
    setTimeout(() => setSuccessMessage(''), 5000);
    fetchDoctorSchedules();
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ca làm việc này?')) return;
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      setSuccessMessage('Đã hủy ca làm việc thành công.');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchDoctorSchedules();
    } catch (err) {
      setError(err.message || 'Không thể xóa ca làm việc.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 ring-1 ring-amber-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ khám
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
            Đã hoàn thành
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 ring-1 ring-rose-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Bệnh nhân hủy
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Ca trực & Lịch khám Bác sĩ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng ký ca làm việc định kỳ, theo dõi danh sách bệnh nhân và kê đơn thuốc điện tử
          </p>
        </div>

        {/* Action button & Status */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Đang tiếp nhận lịch</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateShiftOpen(true)}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all duration-200 flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Đăng ký ca làm việc mới</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-fade-in shadow-xs">
          <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
          <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Main View Mode Selector - Pill Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('APPOINTMENTS')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'APPOINTMENTS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-users text-xs"></i>
            <span>Danh sách Bệnh nhân đặt khám ({appointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('SHIFTS')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'SHIFTS'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-calendar-days text-xs"></i>
            <span>Ca làm việc & Lịch trực đã mở ({schedules.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PATIENT APPOINTMENTS */}
      {viewMode === 'APPOINTMENTS' && (
        <div className="space-y-4">
          {/* Smart Search & Date Range Filter Toolbar for Doctor */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
            {/* Top row: Search Input & Status Pills */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Patient Live Search */}
              <div className="relative flex-1 max-w-md">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên bệnh nhân, email, triệu chứng..."
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

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {[
                  { id: 'ALL', label: 'Tất cả ca khám' },
                  { id: 'CONFIRMED', label: 'Cần khám (Đã xác nhận)' },
                  { id: 'COMPLETED', label: 'Đã hoàn tất & Kê đơn' },
                  { id: 'CANCELLED', label: 'Đã hủy' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeFilter === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row: Quick Date Range Pills & Custom Date Picker */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Lịch khám theo ngày:
                </span>
                {[
                  { id: 'all', label: 'Tất cả ngày', icon: 'fa-calendar' },
                  { id: 'today', label: 'Hôm nay', icon: 'fa-calendar-day' },
                  { id: 'thisWeek', label: 'Tuần này', icon: 'fa-calendar-week' },
                  { id: 'thisMonth', label: 'Tháng này', icon: 'fa-calendar' },
                  { id: 'custom', label: 'Tùy chọn khoảng ngày', icon: 'fa-calendar-days' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDateFilter(d.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                      dateFilter === d.id
                        ? 'bg-teal-700 text-white font-semibold shadow-xs'
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
                Hiển thị <strong>{filteredAppointments.length}</strong> trên tổng số <strong>{appointments.length}</strong> ca khám
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-xs text-slate-500">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Đang tải danh sách ca khám...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <i className="fa-solid fa-filter-circle-xmark text-xl"></i>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Không tìm thấy ca khám nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không có bệnh nhân hoặc ca khám nào khớp với bộ lọc ngày và từ khóa tìm kiếm đã chọn.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Xóa bộ lọc & Xem tất cả
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {apt.patientName ? apt.patientName[0].toUpperCase() : 'B'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{apt.patientName || 'Nguyễn Văn An'}</span>
                          <span className="text-xs font-normal text-slate-400">({apt.patientEmail})</span>
                        </h3>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pl-12">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <i className="fa-regular fa-calendar text-xs text-teal-600"></i>
                        Ngày: <strong>{apt.appointmentDate}</strong>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <i className="fa-regular fa-clock text-xs text-teal-600"></i>
                        Khung giờ: <strong>{formatTime(apt.startTime)} - {formatTime(apt.endTime)}</strong>
                      </span>
                    </div>

                    {apt.reason && (
                      <div className="ml-12 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 max-w-xl flex items-start gap-2">
                        <i className="fa-solid fa-notes-medical text-teal-600 text-[11px] mt-0.5 shrink-0"></i>
                        <span><strong>Triệu chứng bệnh nhân khai:</strong> {apt.reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="self-end md:self-center shrink-0 flex items-center gap-2.5">
                    {apt.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => openMedicalRecord(apt, 'create')}
                        className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95"
                      >
                        <i className="fa-solid fa-stethoscope text-xs"></i>
                        <span>Kê đơn & Ghi bệnh án</span>
                      </button>
                    )}

                    {apt.status === 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => openMedicalRecord(apt, 'view')}
                        className="px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/70 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <i className="fa-solid fa-file-prescription text-xs"></i>
                        <span>Xem Toa thuốc đã kê</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DOCTOR WORK SHIFTS MANAGEMENT */}
      {viewMode === 'SHIFTS' && (
        <div className="space-y-4">
          <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200/70 flex items-center justify-between text-xs text-teal-900">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-teal-600 text-sm"></i>
              <span>
                Các ca làm việc được mở tại đây sẽ ngay lập tức xuất hiện trên trang đặt lịch của bệnh nhân.
              </span>
            </div>
            <button
              onClick={() => setIsCreateShiftOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors shrink-0"
            >
              + Mở thêm ca
            </button>
          </div>

          {shiftsLoading ? (
            <div className="text-center py-20 text-xs text-slate-500">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Đang tải danh sách ca trực...
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
                <i className="fa-solid fa-calendar-xmark"></i>
              </div>
              <h3 className="text-base font-bold text-slate-800">Chưa có ca làm việc nào được mở</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Bác sĩ vui lòng đăng ký ca trực để hệ thống mở khung giờ khám 30 phút cho bệnh nhân đặt hẹn.
              </p>
              <button
                onClick={() => setIsCreateShiftOpen(true)}
                className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                Đăng ký ca làm việc ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sch) => {
                const totalSlots = sch.slots?.length || 0;
                const bookedSlots = sch.slots?.filter((s) => s.isBooked).length || 0;
                const availableSlots = totalSlots - bookedSlots;

                return (
                  <div
                    key={sch.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Shift Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                            Ca làm việc
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                            <i className="fa-regular fa-calendar text-teal-600 text-xs"></i>
                            {formatDate(sch.workDate)}
                          </h3>
                        </div>

                        {/* Delete shift button */}
                        {bookedSlots === 0 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSchedule(sch.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors text-xs"
                            title="Hủy ca làm việc"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>

                      {/* Shift Hours & Stats */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Thời gian trực</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            {formatTime(sch.startTime)} - {formatTime(sch.endTime)}
                          </span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Khung giờ tiếp nhận</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            <strong className="text-emerald-700">{availableSlots} trống</strong> / {totalSlots} ca
                          </span>
                        </div>
                      </div>

                      {/* Slot preview chips */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Khung giờ 30 phút tự động sinh:
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {sch.slots?.map((slot) => (
                            <span
                              key={slot.id}
                              className={`px-2 py-1 rounded-lg text-[10px] text-center font-medium border ${
                                slot.isBooked
                                  ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                                  : 'bg-emerald-50/60 text-emerald-800 border-emerald-200/60'
                              }`}
                            >
                              {formatTime(slot.startTime)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Mỗi ca: 30 phút</span>
                      {bookedSlots > 0 ? (
                        <span className="text-amber-700 font-semibold">Đã có {bookedSlots} bệnh nhân đặt</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Chưa có người đặt</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={isCreateShiftOpen}
        doctorId={1}
        onClose={() => setIsCreateShiftOpen(false)}
        onSuccess={handleScheduleCreated}
      />

      {/* Medical Record Modal */}
      <MedicalRecordModal
        isOpen={modalState.isOpen}
        appointment={modalState.appointment}
        mode={modalState.mode}
        onClose={() => setModalState({ isOpen: false, appointment: null, mode: 'view' })}
        onSuccess={handleRecordSuccess}
      />
    </div>
  );
}
