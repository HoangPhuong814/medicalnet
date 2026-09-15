import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import SpecialityIcon from '../../components/common/SpecialityIcon';
import DoctorCard from '../../components/common/DoctorCard';

export default function HomePage() {
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spData, docData] = await Promise.all([
          doctorApi.getSpecialities(),
          doctorApi.getAllDoctors(),
        ]);
        setSpecialities(spData || []);
        setDoctors(docData || []);
      } catch (err) {
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const term = search.toLowerCase();
    const docName = doc.user?.fullName?.toLowerCase() || '';
    const spName = doc.speciality?.name?.toLowerCase() || '';
    const clinic = doc.clinicAddress?.toLowerCase() || '';
    return docName.includes(term) || spName.includes(term) || clinic.includes(term);
  });

  return (
    <div className="space-y-16 pb-24 bg-slate-50/50">
      {/* Hero Section with Ambient Blur Orbs & Glassmorphism */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50/40 border-b border-slate-200/70 pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Atmospheric Blur Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-5 w-[32rem] h-[32rem] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column - Headline & Pill Search */}
            <div className="lg:col-span-7">
              {/* Glassmorphic Pill Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-teal-200/80 text-teal-800 text-xs font-bold mb-6 shadow-[0_2px_10px_rgba(13,148,136,0.08)]">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                Nền tảng Y tế Tiêu chuẩn Khám chữa bệnh Quốc tế
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Đặt lịch khám với <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700">
                  Bác sĩ Chuyên khoa
                </span>{' '}
                hàng đầu
              </h1>

              <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
                Chủ động chọn khung giờ khám chính xác, không phải xếp hàng chờ đợi, hồ sơ bệnh án số hóa minh bạch và bảo mật 100%.
              </p>

              {/* Glassmorphic Search Bar */}
              <div className="mt-8 flex items-center gap-3 max-w-xl bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/15 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgba(13,148,136,0.12)] transition-all">
                <i className="fa-solid fa-magnifying-glass text-slate-400 ml-1 text-base"></i>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tên bác sĩ, chuyên khoa (Tim mạch, Da liễu...)..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none px-1 font-medium"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                )}
              </div>

              {/* Quick tags */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-400">Gợi ý phổ biến:</span>
                <button
                  onClick={() => setSearch('Tim Mạch')}
                  className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium transition-all shadow-sm"
                >
                  Tim Mạch
                </button>
                <button
                  onClick={() => setSearch('Da Liễu')}
                  className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium transition-all shadow-sm"
                >
                  Da Liễu
                </button>
                <button
                  onClick={() => setSearch('Trần Minh Tuấn')}
                  className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium transition-all shadow-sm"
                >
                  BS.CKII Trần Minh Tuấn
                </button>
              </div>
            </div>

            {/* Right Column - Multi-layer Glassmorphic Hero Frame with Deep Blurs & Corner Transition */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none group">
                {/* Ambient Corner Glow Effects */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-400/25 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-teal-400/35 transition-all duration-700" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-emerald-400/35 transition-all duration-700" />

                {/* Double-layer Glass Container with Soft Corner Transition */}
                <div className="relative p-2.5 sm:p-3.5 rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_rgba(13,148,136,0.15)] ring-1 ring-slate-900/5 transition-all duration-500 hover:shadow-[0_30px_70px_rgba(13,148,136,0.22)]">
                  {/* Image container with soft vignette corner transition */}
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-slate-100 shadow-inner">
                    <img
                      src="/images/hero-doctors.jpg"
                      alt="Đội ngũ Bác sĩ Chuyên khoa MedicalNet"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Corner Fade Transition Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 via-transparent to-white/10 pointer-events-none" />

                    {/* In-image Bottom Glass Pill */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Đội ngũ Bác sĩ Quốc tế
                      </span>
                      <span className="text-[10px] text-white/90 font-medium drop-shadow hidden sm:inline">
                        Chuẩn ISO 9001
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badge 1 - Top Left */}
                <div className="absolute -top-4 -left-3 sm:-left-6 bg-white/85 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.1)] border border-white/90 flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <i className="fa-solid fa-certificate"></i>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">100% Bác sĩ giỏi</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-circle-check text-teal-600 text-[9px]"></i>
                      Đã xác thực giấy phép
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badge 2 - Bottom Right */}
                <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-white/90 flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-base font-bold border border-amber-200/70 shadow-sm">
                    <i className="fa-solid fa-star text-amber-400"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-black text-slate-900">4.9 / 5</span>
                      <span className="text-[10px] text-slate-400 font-medium">(10k+ ca)</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      99.8% Hài lòng
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars - FB/X Clean Rounded Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100/80 text-lg shadow-sm">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Không phải chờ đợi</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Khung giờ hẹn khám 30 phút cố định, tới nơi được bác sĩ tiếp nhận và thăm khám ngay.
              </p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100/80 text-lg shadow-sm">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bác sĩ tuyến trung ương</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Đội ngũ Thạc sĩ, Bác sĩ Chuyên khoa II dày dặn kinh nghiệm từ các bệnh viện đầu ngành.
              </p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80 text-lg shadow-sm">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bệnh án số hóa an toàn</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Tra cứu kết quả chẩn đoán, đơn thuốc điện tử và lịch sử thăm khám mọi lúc mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialities Grid - Interactive & Reliable Icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <i className="fa-solid fa-layer-group text-xs"></i>
              Khoa Lâm Sàng
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Chuyên khoa Y tế
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Khám phá các chuyên khoa được chứng nhận lâm sàng theo tiêu chuẩn quốc tế
            </p>
          </div>
          <Link
            to="/specialities"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100/70 transition-colors"
          >
            Tất cả chuyên khoa <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
          {specialities.map((sp) => (
            <Link
              to={`/doctors?speciality=${sp.id}`}
              key={sp.id}
              className="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-[0_12px_30px_rgba(13,148,136,0.1)] hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <SpecialityIcon name={sp.name} iconUrl={sp.iconUrl} size="lg" />
              </div>
              <div className="w-full">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {sp.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                  {sp.description}
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Xem bác sĩ <i className="fa-solid fa-arrow-right text-[9px]"></i>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section with Large Photo Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <i className="fa-solid fa-user-doctor text-xs"></i>
              Bác sĩ Trực Tuyến
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Đội ngũ Bác sĩ Chuyên khoa
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Đặt lịch trực tiếp với các chuyên gia y tế hàng đầu với hình ảnh và thông tin minh bạch
            </p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100/70 transition-colors"
          >
            Xem tất cả bác sĩ <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-500">Đang tải danh sách bác sĩ...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 text-xs text-slate-500 shadow-sm">
            Không tìm thấy bác sĩ nào khớp với từ khóa tìm kiếm.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
