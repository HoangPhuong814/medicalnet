import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        // Bác sĩ Tuấn có doctorId = 1 trong sample data
        const data = await appointmentApi.getDoctorAppointments(1);
        setAppointments(data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải lịch hẹn của bác sĩ.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === 'ALL') return true;
    return apt.status === activeFilter;
  });

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
            Quản lý Ca khám Bác sĩ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi danh sách bệnh nhân đã đặt khung giờ và tiến hành tiếp nhận thăm khám
          </p>
        </div>

        {/* Doctor Active Status Tag */}
        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Đang tiếp nhận lịch hẹn</span>
        </div>
      </div>

      {/* Filter Tabs - X Style Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'Tất cả ca khám' },
          { id: 'CONFIRMED', label: 'Đã xác nhận' },
          { id: 'PENDING', label: 'Chờ khám' },
          { id: 'COMPLETED', label: 'Đã hoàn thành' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
          Đang tải danh sách ca khám...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <i className="fa-solid fa-stethoscope text-3xl"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">Không có ca khám nào theo bộ lọc này</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Khi có bệnh nhân đặt lịch trong trạng thái tương ứng, hệ thống sẽ tự động hiển thị ca khám tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2.5">
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
                    Khung giờ: <strong>{apt.startTime?.substring(0, 5)} - {apt.endTime?.substring(0, 5)}</strong>
                  </span>
                </div>

                {apt.reason && (
                  <div className="ml-12 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 max-w-xl flex items-start gap-2">
                    <i className="fa-solid fa-notes-medical text-teal-600 text-[11px] mt-0.5 shrink-0"></i>
                    <span><strong>Triệu chứng / Ghi chú:</strong> {apt.reason}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="self-end md:self-center shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Chi tiết ca khám của bệnh nhân ${apt.patientName || apt.patientEmail}`)}
                  className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-regular fa-file-lines text-xs"></i>
                  Xem bệnh án
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
