import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { appointmentApi } from '../../api/appointmentApi';
import { useAuth } from '../../context/AuthContext';
import DoctorAvatar from '../../components/common/DoctorAvatar';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [docData, scheduleData] = await Promise.all([
          doctorApi.getDoctorById(id),
          doctorApi.getDoctorUpcomingSchedules(id),
        ]);
        setDoctor(docData);
        setSchedules(scheduleData || []);
        if (scheduleData && scheduleData.length > 0) {
          setSelectedSchedule(scheduleData[0]);
        }
      } catch (err) {
        setError('Không thể tải thông tin bác sĩ hoặc lịch làm việc.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      setError('Vui lòng chọn một khung giờ khám còn trống.');
      return;
    }

    setBookingLoading(true);
    try {
      await appointmentApi.bookAppointment({
        slotId: selectedSlot.id,
        reason: reason || 'Khám tổng quát và tư vấn sức khỏe',
      });
      setBookingSuccess(true);
    } catch (err) {
      setError(err.message || 'Đặt lịch thất bại, có thể khung giờ này vừa có người đặt.');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // '08:00:00' -> '08:00'
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Đang tải hồ sơ bác sĩ...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <i className="fa-solid fa-user-doctor text-4xl text-slate-300"></i>
        <h3 className="text-base font-bold text-slate-800">Không tìm thấy thông tin bác sĩ</h3>
        <Link to="/doctors" className="inline-block text-xs text-teal-600 hover:underline font-semibold">
          ← Quay lại danh sách bác sĩ
        </Link>
      </div>
    );
  }

  const doctorPhoto = getDoctorImage(doctor.user?.fullName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb - X Style */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-teal-600 transition-colors">Trang chủ</Link>
        <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <Link to="/doctors" className="hover:text-teal-600 transition-colors">Bác sĩ</Link>
        <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span className="text-slate-900 font-semibold">{doctor.user?.fullName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Doctor Profile Card */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Doctor Photo Header */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              {doctorPhoto ? (
                <img
                  src={doctorPhoto}
                  alt={doctor.user?.fullName}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-800 text-white">
                  <DoctorAvatar name={doctor.user?.fullName} size="lg" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Floating badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-md text-teal-800 shadow-sm">
                  {doctor.speciality?.name}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/70 backdrop-blur-md text-amber-300 flex items-center gap-1 shadow-sm">
                  <i className="fa-solid fa-star text-[10px]"></i> 4.9
                </span>
              </div>

              {/* Name at bottom of photo */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                    {doctor.user?.fullName}
                  </h1>
                  <i className="fa-solid fa-circle-check text-sky-400 text-sm" title="Bác sĩ đã xác thực"></i>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 opacity-90">
                  {doctor.yearsOfExperience} năm kinh nghiệm chuyên sâu
                </p>
              </div>
            </div>

            {/* Doctor Key Information Details */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Chi phí khám bệnh</span>
                <span className="text-base font-extrabold text-teal-700">
                  {formatCurrency(doctor.consultationFee)}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-location-dot text-[11px]"></i>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Địa chỉ phòng khám</span>
                    <span className="text-slate-800">{doctor.clinicAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-certificate text-[11px]"></i>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Chứng nhận y tế</span>
                    <span className="text-slate-800">Bộ Y Tế cấp chứng chỉ hành nghề</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biography Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-book-medical text-teal-600"></i>
              Tiểu sử & Quá trình đào tạo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {doctor.biography}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Booking Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-regular fa-calendar-check text-teal-600"></i>
                  Chọn lịch & Giờ khám trực tuyến
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Khung giờ 30 phút cố định, tiếp đón đúng giờ không chờ đợi
                </p>
              </div>
              <div className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 font-medium">
                <i className="fa-solid fa-shield-halved text-[11px]"></i>
                Xác nhận lịch tức thì
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center gap-2 text-xs text-red-700">
                <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            {bookingSuccess ? (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50">
                  <i className="fa-solid fa-check text-2xl text-emerald-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Đặt lịch khám thành công!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Lịch hẹn khám của bạn với <strong>{doctor.user?.fullName}</strong> vào ngày{' '}
                  <strong className="text-teal-700">{formatDate(selectedSchedule?.workDate)}</strong> lúc{' '}
                  <strong className="text-teal-700">{formatTime(selectedSlot?.startTime)}</strong> đã được ghi nhận vào hệ thống.
                </p>
                <div className="pt-3 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/my-appointments"
                    className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200"
                  >
                    Xem lịch hẹn của tôi
                  </Link>
                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      setSelectedSlot(null);
                      setReason('');
                    }}
                    className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Đặt thêm lịch khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-6">
                {/* 1. Chọn ngày khám */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                    1. Chọn ngày khám:
                  </label>
                  {schedules.length === 0 ? (
                    <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-500 text-center">
                      Bác sĩ hiện chưa có lịch khám sắp tới. Vui lòng quay lại sau hoặc chọn bác sĩ khác.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {schedules.map((sch) => {
                        const isSelected = selectedSchedule?.id === sch.id;
                        return (
                          <button
                            type="button"
                            key={sch.id}
                            onClick={() => {
                              setSelectedSchedule(sch);
                              setSelectedSlot(null);
                            }}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-medium border text-left transition-all duration-200 ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200/90 hover:border-teal-500 hover:bg-teal-50/20'
                            }`}
                          >
                            <div className="font-bold flex items-center gap-1.5">
                              <i className={`fa-regular fa-calendar text-[11px] ${isSelected ? 'text-teal-400' : 'text-teal-600'}`}></i>
                              {formatDate(sch.workDate)}
                            </div>
                            <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              Ca làm việc: {formatTime(sch.startTime)} - {formatTime(sch.endTime)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Chọn khung giờ (Slot) */}
                {selectedSchedule && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                      2. Chọn khung giờ khám (mỗi ca 30 phút):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {selectedSchedule.slots?.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        return (
                          <button
                            type="button"
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 px-3 text-center rounded-xl text-xs font-medium border transition-all duration-150 ${
                              isSelected
                                ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold scale-[1.02]'
                                : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:border-teal-400 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <i className={`fa-regular fa-clock text-[11px] ${isSelected ? 'text-white' : 'text-teal-600'}`}></i>
                              <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Lý do khám & Triệu chứng */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    3. Lý do khám & Triệu chứng bệnh nhân:
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Mô tả sơ lược tình trạng sức khỏe hoặc lý do bạn cần tư vấn với bác sĩ..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 transition-all"
                  ></textarea>
                </div>

                {/* Thông tin bệnh nhân banner */}
                {isAuthenticated ? (
                  <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                        {user?.fullName ? user.fullName[0].toUpperCase() : 'BN'}
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Bệnh nhân đặt khám:</span>
                        <strong className="text-slate-900 font-semibold">{user?.fullName || user?.email}</strong>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Đã xác thực
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-800 flex items-center justify-between">
                    <span>Bạn chưa đăng nhập. Nhấn nút bên dưới để đăng nhập và hoàn tất đặt lịch.</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !selectedSlot}
                  className="w-full py-3.5 px-6 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý đặt lịch...</span>
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <i className="fa-regular fa-calendar-check text-xs"></i>
                      <span>Xác nhận Đặt lịch khám</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-right-to-bracket text-xs"></i>
                      <span>Đăng nhập để Xác nhận Đặt lịch</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
