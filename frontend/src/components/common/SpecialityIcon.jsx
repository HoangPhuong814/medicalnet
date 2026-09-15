import React, { useState } from 'react';

const SPECIALITY_CONFIG = {
  'Tim Mạch': {
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'from-rose-500/10 to-rose-500/5',
    color: 'text-rose-600',
    border: 'border-rose-200/70',
    bg: 'bg-rose-50',
    ring: 'ring-rose-500/10',
  },
  'Da Liễu': {
    icon: 'fa-solid fa-spa',
    gradient: 'from-amber-500/10 to-amber-500/5',
    color: 'text-amber-600',
    border: 'border-amber-200/70',
    bg: 'bg-amber-50',
    ring: 'ring-amber-500/10',
  },
  'Nhi Khoa': {
    icon: 'fa-solid fa-baby',
    gradient: 'from-sky-500/10 to-sky-500/5',
    color: 'text-sky-600',
    border: 'border-sky-200/70',
    bg: 'bg-sky-50',
    ring: 'ring-sky-500/10',
  },
  'Thần Kinh': {
    icon: 'fa-solid fa-brain',
    gradient: 'from-purple-500/10 to-purple-500/5',
    color: 'text-purple-600',
    border: 'border-purple-200/70',
    bg: 'bg-purple-50',
    ring: 'ring-purple-500/10',
  },
  'Răng Hàm Mặt': {
    icon: 'fa-solid fa-tooth',
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    color: 'text-emerald-600',
    border: 'border-emerald-200/70',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-500/10',
  },
  'Mắt': {
    icon: 'fa-solid fa-eye',
    gradient: 'from-blue-500/10 to-blue-500/5',
    color: 'text-blue-600',
    border: 'border-blue-200/70',
    bg: 'bg-blue-50',
    ring: 'ring-blue-500/10',
  },
  'Tai Mũi Họng': {
    icon: 'fa-solid fa-head-side-cough',
    gradient: 'from-orange-500/10 to-orange-500/5',
    color: 'text-orange-600',
    border: 'border-orange-200/70',
    bg: 'bg-orange-50',
    ring: 'ring-orange-500/10',
  },
  'Xương Khớp': {
    icon: 'fa-solid fa-bone',
    gradient: 'from-teal-500/10 to-teal-500/5',
    color: 'text-teal-600',
    border: 'border-teal-200/70',
    bg: 'bg-teal-50',
    ring: 'ring-teal-500/10',
  },
};

const DEFAULT_CONFIG = {
  icon: 'fa-solid fa-stethoscope',
  gradient: 'from-teal-500/10 to-teal-500/5',
  color: 'text-teal-600',
  border: 'border-teal-200/70',
  bg: 'bg-teal-50',
  ring: 'ring-teal-500/10',
};

export default function SpecialityIcon({ name, iconUrl, size = 'md' }) {
  const [imgError, setImgError] = useState(false);

  // Check if iconUrl is known to be an icons8 URL that fails or if user prefers vector icons
  const isIcons8 = iconUrl && iconUrl.includes('icons8.com');
  const shouldTryImg = Boolean(iconUrl && !isIcons8 && !imgError);

  const config = SPECIALITY_CONFIG[name] || DEFAULT_CONFIG;

  const sizeClasses = {
    sm: 'w-9 h-9 text-sm rounded-xl',
    md: 'w-12 h-12 text-lg rounded-2xl',
    lg: 'w-14 h-14 text-2xl rounded-2xl',
  }[size] || 'w-12 h-12 text-lg rounded-2xl';

  if (shouldTryImg) {
    return (
      <div className={`relative ${sizeClasses} p-1.5 flex items-center justify-center bg-white border border-slate-100 shadow-sm overflow-hidden`}>
        <img
          src={iconUrl}
          alt={name}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClasses} ${config.bg} ${config.color} border ${config.border} ring-4 ${config.ring} flex items-center justify-center shadow-sm transition-all duration-200`}
    >
      <i className={config.icon}></i>
    </div>
  );
}
