import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    soundEnabled,
    toggleSound,
    playTestSound,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'appointment':
        return {
          icon: 'fa-solid fa-calendar-check',
          bg: 'bg-teal-50 text-teal-600',
        };
      case 'prescription':
        return {
          icon: 'fa-solid fa-prescription-bottle-medical',
          bg: 'bg-emerald-50 text-emerald-600',
        };
      case 'review':
        return {
          icon: 'fa-solid fa-star',
          bg: 'bg-amber-50 text-amber-500',
        };
      case 'reminder':
        return {
          icon: 'fa-solid fa-clock',
          bg: 'bg-blue-50 text-blue-600',
        };
      case 'admin':
      case 'stats':
        return {
          icon: 'fa-solid fa-chart-line',
          bg: 'bg-indigo-50 text-indigo-600',
        };
      default:
        return {
          icon: 'fa-solid fa-bell',
          bg: 'bg-slate-100 text-slate-600',
        };
    }
  };

  const displayedNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="notification-bell-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        title="Thông báo"
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 relative ${
          isOpen
            ? 'bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <i className="fa-regular fa-bell text-base pointer-events-none"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center border-2 border-white shadow-xs pointer-events-none animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Flyout Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header with Sound Controls */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                title={soundEnabled ? 'Tắt âm thanh thông báo' : 'Bật âm thanh thông báo'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  soundEnabled
                    ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                    : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
              </button>

              {/* Test Sound Button */}
              <button
                type="button"
                id="test-sound-btn"
                onClick={playTestSound}
                title="Bấm để thử chuông báo"
                className="px-2 py-1 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 text-[11px] font-semibold transition-colors flex items-center gap-1 border border-slate-200"
              >
                <i className="fa-solid fa-play text-[9px] text-teal-600"></i>
                <span>Thử chuông</span>
              </button>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Đánh dấu tất cả đã đọc"
                  className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors hover:underline ml-1"
                >
                  Đọc hết
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-1 gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100/80">
            {displayedNotifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <i className="fa-regular fa-bell-slash text-2xl mb-2 text-slate-300"></i>
                <p className="text-xs font-medium">
                  {activeTab === 'unread'
                    ? 'Bạn không có thông báo chưa đọc nào!'
                    : 'Chưa có thông báo nào được lưu.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => {
                const iconMeta = getIconForType(notif.type);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 sm:p-3.5 flex items-start gap-3 transition-colors cursor-pointer group relative ${
                      notif.read
                        ? 'hover:bg-slate-50/80'
                        : 'bg-teal-50/30 hover:bg-teal-50/60'
                    }`}
                  >
                    {/* Icon Category */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-xs ${iconMeta.bg}`}
                    >
                      <i className={iconMeta.icon}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-xs font-bold truncate ${
                            notif.read ? 'text-slate-800' : 'text-slate-900'
                          }`}
                        >
                          {notif.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                        {formatRelativeTime(notif.timestamp)}
                      </span>
                    </div>

                    {/* Unread indicator / Delete button */}
                    <div className="flex flex-col items-center justify-between self-stretch shrink-0">
                      {!notif.read && (
                        <span
                          className="w-2 h-2 rounded-full bg-teal-500 shadow-xs"
                          title="Chưa đọc"
                        ></span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        title="Xóa thông báo"
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-white text-[11px] transition-all"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-slate-100 bg-slate-50/60 text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                Tự động lưu thông báo theo tài khoản đăng nhập
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
