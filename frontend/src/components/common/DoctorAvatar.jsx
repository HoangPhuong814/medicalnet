import React, { useState } from 'react';

// Generates a pleasant pastel background and initials based on doctor's name
const AVATAR_COLORS = [
  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
];

export default function DoctorAvatar({ name = '', avatarUrl = null, size = 'md', isOnline = true }) {
  const [imgError, setImgError] = useState(false);

  // Auto-map sample doctors if no explicit avatarUrl
  let resolvedUrl = avatarUrl;
  if (!resolvedUrl && name) {
    const lower = name.toLowerCase();
    if (lower.includes('tuấn') || lower.includes('tuan')) {
      resolvedUrl = '/images/doctors/doctor-tuan.jpg';
    } else if (lower.includes('lan')) {
      resolvedUrl = '/images/doctors/doctor-lan.jpg';
    }
  }

  const getInitials = (str) => {
    if (!str) return 'BS';
    const parts = str.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const colorIndex = (name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % AVATAR_COLORS.length;
  const theme = AVATAR_COLORS[colorIndex];

  const sizeClasses = {
    sm: 'w-11 h-11 text-xs rounded-xl',
    md: 'w-16 h-16 text-sm rounded-2xl',
    lg: 'w-24 h-24 text-lg rounded-2xl',
    xl: 'w-32 h-32 text-xl rounded-3xl',
  }[size] || 'w-16 h-16 text-sm rounded-2xl';

  const showImage = Boolean(resolvedUrl && !imgError);

  return (
    <div className="relative inline-block shrink-0">
      {showImage ? (
        <div
          className={`${sizeClasses} overflow-hidden border-2 border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-slate-100 group-hover:shadow-md transition-all duration-200`}
        >
          <img
            src={resolvedUrl}
            alt={name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className={`${sizeClasses} ${theme.bg} ${theme.text} ${theme.border} border-2 flex items-center justify-center font-bold tracking-tight shadow-sm select-none`}
        >
          <span>{getInitials(name)}</span>
        </div>
      )}

      {isOnline && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"
          title="Bác sĩ sẵn sàng nhận lịch khám"
        />
      )}
    </div>
  );
}
