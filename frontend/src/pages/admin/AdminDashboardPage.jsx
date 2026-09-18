import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import DoctorAvatar from '../../components/common/DoctorAvatar';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStats = async (year) => {
    try {
      setError('');
      const data = await dashboardApi.getAdminStats(year);
      setStats(data);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err) {
      setError(err.message || 'Không thể tải số liệu thống kê quản trị.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedYear);
  }, [selectedYear]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats(selectedYear);
  };

  const formatCurrency = (val) => {
    if (!val || val === 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-xs text-slate-500">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Đang tải dữ liệu trung tâm quản trị...
      </div>
    );
  }

  // Calculate chart max for monthly appointments
  const monthlyData = stats?.monthlyStats || [];
  const maxAppointmentsInMonth = Math.max(...monthlyData.map((m) => m.appointmentCount || 0), 5);

  // Total appointments status breakdown
  const confirmed = stats?.confirmedAppointments || 0;
  const completed = stats?.completedAppointments || 0;
  const cancelled = stats?.cancelledAppointments || 0;
  const totalTracked = confirmed + completed + cancelled || 1;

  const confirmedPct = Math.round((confirmed / totalTracked) * 100);
  const completedPct = Math.round((completed / totalTracked) * 100);
  const cancelledPct = Math.round((cancelled / totalTracked) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Top Toolbar Header - Clean & Professional */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Hệ thống & Báo cáo Quản trị
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Trung tâm Điều hành MedicalNet
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp thời gian thực về nhân sự y tế, lịch hẹn khám và doanh thu vận hành
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Year selector pills */}
          <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs">
            {[2026, 2025].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3.5 py-1 rounded-full font-semibold transition-all duration-200 ${
                  selectedYear === yr
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Năm {yr}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            title="Làm mới dữ liệu"
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs flex items-center gap-1.5 px-3 text-xs"
          >
            <i className={`fa-solid fa-rotate-right text-xs ${refreshing ? 'animate-spin text-teal-600' : ''}`}></i>
            <span className="hidden sm:inline text-[11px] text-slate-500">
              {lastUpdated ? `Cập nhật: ${lastUpdated}` : 'Làm mới'}
            </span>
          </button>

          {/* Manage Doctors & Users Link */}
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all duration-200 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-users-gear text-[11px]"></i>
            <span>Quản lý Bác sĩ & Users</span>
          </Link>

          {/* Export Report Pill */}
          <button
            onClick={() => alert('Chức năng xuất báo cáo PDF/Excel đang được tạo...')}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-xs transition-all duration-200 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-down-to-bracket text-[11px]"></i>
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5">
          <i className="fa-solid fa-circle-exclamation text-xs text-red-600"></i>
          <span>{error}</span>
        </div>
      )}

      {/* 4 Professional KPI Metric Cards (Typography-focused, No cartoonish giant blobs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Doctors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bác sĩ chuyên khoa</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-xs">
              <i className="fa-solid fa-user-doctor"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalDoctors || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>100% đã được cấp chứng chỉ</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bệnh nhân hệ thống</span>
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center text-xs">
              <i className="fa-solid fa-hospital-user"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalPatients || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
              <i className="fa-regular fa-clock text-[10px]"></i>
              <span>Hồ sơ bệnh án điện tử</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng lượt đặt khám</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs">
              <i className="fa-regular fa-calendar-check"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalAppointments || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-teal-700 font-medium">
              <i className="fa-solid fa-arrow-trend-up text-[10px]"></i>
              <span>{confirmed} ca đang chờ khám</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Doanh thu tạm tính</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs">
              <i className="fa-solid fa-coins"></i>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats?.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
              <span>Tính trên các ca hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Activity Chart & Appointment Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Activity Bar Chart (Col span 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Xu hướng Lịch khám theo Tháng (Năm {selectedYear})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Biểu đồ phân bổ ca khám phân bố trong 12 tháng hoạt động
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-600"></span>
                Số ca khám
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
              {monthlyData.map((item) => {
                const count = item.appointmentCount || 0;
                const barHeightPct = Math.max(Math.round((count / maxAppointmentsInMonth) * 100), 6);
                const isCurrentMonth = item.month === new Date().getMonth() + 1;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md transition-opacity z-10">
                      T{item.month}: {count} ca khám
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                        count > 0
                          ? 'bg-teal-600 hover:bg-teal-500'
                          : isCurrentMonth
                          ? 'bg-teal-200/60'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    ></div>
                    <span className={`text-[10px] font-medium ${isCurrentMonth ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                      T{item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Pipeline & System Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Trạng thái Tiếp nhận Ca khám
            </h2>

            {/* Pipeline progress bar */}
            <div className="mt-4 space-y-3">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${confirmedPct}%` }} className="bg-teal-500" title="Đã xác nhận"></div>
                <div style={{ width: `${completedPct}%` }} className="bg-emerald-500" title="Khám thành công"></div>
                <div style={{ width: `${cancelledPct}%` }} className="bg-rose-400" title="Đã hủy"></div>
              </div>

              {/* Status List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-700 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    Đã xác nhận lịch
                  </span>
                  <span className="font-bold text-slate-900">{confirmed} ca</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-700 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Khám hoàn tất
                  </span>
                  <span className="font-bold text-slate-900">{completed} ca</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-700 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Bệnh nhân hủy
                  </span>
                  <span className="font-bold text-slate-900">{cancelled} ca</span>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Hạ tầng kỹ thuật
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/50 flex items-center justify-between text-emerald-800">
                <span>PostgreSQL</span>
                <i className="fa-solid fa-circle-check text-[10px]"></i>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/50 flex items-center justify-between text-emerald-800">
                <span>Redis Cache</span>
                <i className="fa-solid fa-circle-check text-[10px]"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Speciality Distribution & Top Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speciality Distribution (Col span 1) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Phân bổ theo Chuyên khoa
            </h2>
            <span className="text-[11px] text-slate-400">Năm {selectedYear}</span>
          </div>

          {stats?.specialityStats && stats.specialityStats.length > 0 ? (
            <div className="space-y-3.5">
              {stats.specialityStats.map((spec) => {
                const count = spec.appointmentCount || 0;
                const total = stats.totalAppointments || 1;
                const pct = Math.max(Math.round((count / total) * 100), count > 0 ? 10 : 0);

                return (
                  <div key={spec.specialityId} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-800">{spec.specialityName}</span>
                      <span className="text-slate-500 font-semibold">{count} lượt khám</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-teal-600 rounded-full transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              Chưa có dữ liệu chuyên khoa.
            </div>
          )}
        </div>

        {/* Top Doctors Ranking (Col span 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Bác sĩ tiêu biểu trong hệ thống
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Xếp hạng dựa trên số lượng ca khám và đánh giá trung bình từ bệnh nhân
              </p>
            </div>
            <Link
              to="/doctors"
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>

          {stats?.topDoctors && stats.topDoctors.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.topDoctors.map((doc, idx) => {
                const photo = getDoctorImage(doc.doctorName);
                const appointmentsCount = doc.totalAppointments ?? doc.appointmentCount ?? 0;
                const rating = doc.averageRating ? doc.averageRating.toFixed(1) : '5.0';

                return (
                  <div
                    key={doc.doctorId || idx}
                    className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      {photo ? (
                        <img
                          src={photo}
                          alt={doc.doctorName}
                          className="w-10 h-10 rounded-full object-cover object-top ring-1 ring-slate-200 shrink-0"
                        />
                      ) : (
                        <DoctorAvatar name={doc.doctorName} size="sm" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{doc.doctorName}</span>
                          <i className="fa-solid fa-circle-check text-sky-500 text-[10px]" title="Đã xác minh"></i>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Chuyên khoa: <strong className="text-slate-700">{doc.specialityName}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-[11px]">
                          {appointmentsCount} ca khám
                        </span>
                        <div className="text-[11px] text-amber-500 font-semibold mt-0.5 flex items-center justify-end gap-1">
                          <i className="fa-solid fa-star text-[10px]"></i>
                          <span>{rating}</span>
                        </div>
                      </div>

                      <Link
                        to={`/doctors/${doc.doctorId || 1}`}
                        className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                      >
                        Hồ sơ
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">
              Chưa có dữ liệu bác sĩ.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
