import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  const [imgError, setImgError] = useState(false);

  // Map known sample doctor portraits
  let photoUrl = null;
  const name = doctor.user?.fullName || '';
  const lower = name.toLowerCase();

  if (lower.includes('tuấn') || lower.includes('tuan')) {
    photoUrl = '/images/doctors/doctor-tuan.jpg';
  } else if (lower.includes('lan')) {
    photoUrl = '/images/doctors/doctor-lan.jpg';
  }

  const formatCurrency = (val) => {
    if (!val) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Doctor Photo - Compact & Balanced */}
      <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden select-none">
        {photoUrl && !imgError ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-teal-100 to-emerald-50 flex items-center justify-center text-teal-800 text-3xl font-extrabold">
            {name.substring(0, 2).toUpperCase()}
          </div>
        )}

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent pointer-events-none" />

        {/* Floating Top-Left: Speciality Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-sm border border-white/70">
            <i className="fa-solid fa-stethoscope text-teal-600 text-[9px]"></i>
            {doctor.speciality?.name || 'Đa Khoa'}
          </span>
        </div>

        {/* Floating Top-Right: Rating Badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-extrabold shadow-sm border border-white/70">
            <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
            {doctor.averageRating ? Number(doctor.averageRating).toFixed(1) : (doctor.rating || '4.9')}
          </span>
        </div>

        {/* Floating Bottom on photo */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Nhận khám tuần này
          </span>
          <span className="text-[10px] text-white/90 font-medium drop-shadow-sm">
            {doctor.yearsOfExperience} năm kn
          </span>
        </div>
      </div>

      {/* Card Body - Compact */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-teal-600 transition-colors">
              {name}
              <i className="fa-solid fa-circle-check text-sky-500 text-xs" title="Bác sĩ đã xác thực"></i>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <i className="fa-solid fa-certificate text-teal-600 text-[10px]"></i>
              Bác sĩ Chuyên khoa đầu ngành
            </p>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
            {doctor.biography}
          </p>

          {/* Clinic Address with pin */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
            <i className="fa-solid fa-location-dot text-slate-400 text-[11px] shrink-0"></i>
            <span className="truncate text-[11px]">{doctor.clinicAddress}</span>
          </div>
        </div>

        {/* Footer: Price + CTA Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Chi phí khám</span>
            <span className="text-sm sm:text-base font-extrabold text-teal-700">
              {formatCurrency(doctor.consultationFee)}
            </span>
          </div>

          <Link
            to={`/doctors/${doctor.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
          >
            <i className="fa-regular fa-calendar-check text-[11px]"></i>
            Đặt lịch
          </Link>
        </div>
      </div>
    </div>
  );
}
