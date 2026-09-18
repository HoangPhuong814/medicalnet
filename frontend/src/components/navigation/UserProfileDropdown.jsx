import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileDropdown() {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
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

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'ADMIN':
        return { title: 'Quản trị viên', color: 'bg-indigo-50 text-indigo-700' };
      case 'DOCTOR':
        return { title: 'Bác sĩ chuyên khoa', color: 'bg-teal-50 text-teal-700' };
      default:
        return { title: 'Bệnh nhân', color: 'bg-emerald-50 text-emerald-700' };
    }
  };

  const roleMeta = getRoleLabel();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        id="user-profile-menu-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-slate-100 transition-all ${
          isOpen ? 'bg-slate-100 ring-2 ring-teal-500/20' : ''
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
          {user?.fullName
            ? user.fullName.charAt(0).toUpperCase()
            : user?.email
            ? user.email.charAt(0).toUpperCase()
            : 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
            {user?.fullName || user?.email || 'Người dùng'}
          </div>
          <div className="text-[10px] text-teal-600 font-semibold">
            {roleMeta.title}
          </div>
        </div>
        <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform hidden sm:inline-block ${isOpen ? 'rotate-180 text-teal-600' : ''}`}></i>
      </button>

      {/* Profile Flyout Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* User Info Header */}
          <div className="p-3 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
              {user?.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : user?.email
                ? user.email.charAt(0).toUpperCase()
                : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user?.fullName || 'Người dùng'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {user?.email}
              </div>
              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${roleMeta.color}`}>
                {roleMeta.title}
              </span>
            </div>
          </div>

          {/* Role-Specific Links */}
          <div className="py-1 space-y-0.5 text-xs">
            {role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-700 font-medium transition-colors"
                >
                  <i className="fa-solid fa-chart-pie w-4 text-center text-indigo-600"></i>
                  <span>Trung tâm Điều hành (Dashboard)</span>
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-teal-700 font-medium transition-colors"
                >
                  <i className="fa-solid fa-users-gear w-4 text-center text-teal-600"></i>
                  <span>Quản lý Bác sĩ & Users</span>
                </Link>

                {/* Extended Admin Inspection Links */}
                <div className="pt-1.5 pb-1 px-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Tra cứu & Kiểm tra
                  </div>
                </div>
                <Link
                  to="/my-appointments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-[11px]"
                >
                  <i className="fa-regular fa-calendar-check w-4 text-center text-teal-600"></i>
                  <span>Xem Lịch hẹn toàn hệ thống</span>
                </Link>
                <Link
                  to="/my-medical-records"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-[11px]"
                >
                  <i className="fa-solid fa-book-medical w-4 text-center text-teal-600"></i>
                  <span>Xem Bệnh án & Toa thuốc</span>
                </Link>
                <Link
                  to="/doctor/schedule"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-[11px]"
                >
                  <i className="fa-solid fa-calendar-days w-4 text-center text-teal-600"></i>
                  <span>Xem Ca khám bác sĩ</span>
                </Link>
              </>
            )}

            {role === 'DOCTOR' && (
              <>
                <Link
                  to="/doctor/schedule"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-teal-700 font-medium transition-colors"
                >
                  <i className="fa-solid fa-calendar-days w-4 text-center text-teal-600"></i>
                  <span>Ca khám & Lịch trực</span>
                </Link>
              </>
            )}

            {role === 'PATIENT' && (
              <>
                <Link
                  to="/my-appointments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-teal-700 font-medium transition-colors"
                >
                  <i className="fa-regular fa-calendar-check w-4 text-center text-teal-600"></i>
                  <span>Lịch khám của tôi</span>
                </Link>
                <Link
                  to="/my-medical-records"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-teal-700 font-medium transition-colors"
                >
                  <i className="fa-solid fa-book-medical w-4 text-center text-teal-600"></i>
                  <span>Sổ bệnh án & Toa thuốc</span>
                </Link>
              </>
            )}

            {/* Profile Settings (All authenticated users) */}
            <div className="border-t border-slate-100 my-1"></div>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
            >
              <i className="fa-solid fa-user-gear w-4 text-center text-slate-500"></i>
              <span>Cài đặt hồ sơ cá nhân</span>
            </Link>

            {/* Logout Action */}
            <button
              id="user-logout-btn"
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors text-left"
            >
              <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
