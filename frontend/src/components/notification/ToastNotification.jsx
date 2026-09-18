import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export default function ToastNotification() {
  const { activeToast, dismissToast, markAsRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const handleClick = () => {
    markAsRead(activeToast.id);
    dismissToast();
    if (activeToast.link) {
      navigate(activeToast.link);
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'appointment':
        return {
          icon: 'fa-solid fa-calendar-check',
          bg: 'bg-teal-500 text-white',
        };
      case 'prescription':
        return {
          icon: 'fa-solid fa-prescription-bottle-medical',
          bg: 'bg-emerald-500 text-white',
        };
      case 'review':
        return {
          icon: 'fa-solid fa-star',
          bg: 'bg-amber-500 text-white',
        };
      case 'reminder':
        return {
          icon: 'fa-solid fa-clock',
          bg: 'bg-blue-500 text-white',
        };
      case 'admin':
      case 'stats':
        return {
          icon: 'fa-solid fa-chart-line',
          bg: 'bg-indigo-500 text-white',
        };
      default:
        return {
          icon: 'fa-solid fa-bell',
          bg: 'bg-slate-800 text-white',
        };
    }
  };

  const iconMeta = getToastIcon(activeToast.type);

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        onClick={handleClick}
        className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:shadow-xl transition-all group border-l-4 border-l-teal-500"
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-xs ${iconMeta.bg}`}
        >
          <i className={iconMeta.icon}></i>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-xs font-bold text-slate-900 truncate">
              {activeToast.title}
            </span>
            <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.5 rounded-full">
              Mới
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
            {activeToast.message}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissToast();
          }}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-xs -mt-1 -mr-1"
          title="Đóng"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}
