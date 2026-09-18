import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './notification/NotificationDropdown';
import UserProfileDropdown from './navigation/UserProfileDropdown';

export default function Navbar() {
  const { role, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 group shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-heart-pulse text-base"></i>
          </div>
          <div className="font-heading font-extrabold text-xl tracking-tight">
            <span className="text-slate-900">Medical</span>
            <span className="text-teal-600">Net</span>
          </div>
        </Link>

        {/* Navigation links - Strictly Filtered By Role */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {/* Universal Home link */}
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
          >
            Trang chủ
          </Link>

          {/* GUEST: Public exploration */}
          {!isAuthenticated && (
            <>
              <Link
                to="/doctors"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
              >
                Đội ngũ Bác sĩ
              </Link>
              <Link
                to="/specialities"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
              >
                Chuyên khoa
              </Link>
            </>
          )}

          {/* PATIENT: Healthcare search & records */}
          {isAuthenticated && role === 'PATIENT' && (
            <>
              <Link
                to="/doctors"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
              >
                Bác sĩ
              </Link>
              <Link
                to="/specialities"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
              >
                Chuyên khoa
              </Link>
              <Link
                to="/my-appointments"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium flex items-center gap-1.5"
              >
                <i className="fa-regular fa-calendar-check text-xs text-teal-600"></i>
                Lịch khám
              </Link>
              <Link
                to="/my-medical-records"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium flex items-center gap-1.5"
              >
                <i className="fa-solid fa-book-medical text-xs text-teal-600"></i>
                Sổ bệnh án
              </Link>
            </>
          )}

          {/* DOCTOR: Dedicated Shift & Clinical Schedule */}
          {isAuthenticated && role === 'DOCTOR' && (
            <Link
              to="/doctor/schedule"
              className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-medium flex items-center gap-1.5 text-teal-700 font-semibold"
            >
              <i className="fa-solid fa-calendar-days text-xs text-teal-600"></i>
              Ca khám & Lịch trực
            </Link>
          )}

          {/* ADMIN: Management & Analytics Core */}
          {isAuthenticated && role === 'ADMIN' && (
            <div className="flex items-center gap-1">
              <Link
                to="/admin"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-semibold flex items-center gap-1.5 text-xs text-indigo-700"
              >
                <i className="fa-solid fa-chart-pie text-xs text-indigo-600"></i>
                Dashboard Quản trị
              </Link>
              <Link
                to="/admin/users"
                className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all font-semibold flex items-center gap-1.5 text-xs text-teal-700"
              >
                <i className="fa-solid fa-users-gear text-xs text-teal-600"></i>
                Quản lý Bác sĩ & Users
              </Link>
            </div>
          )}
        </nav>

        {/* Right side actions - Notification Bell & User Profile Dropdown */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Bell with Unread Badge & Sound Controls */}
              <NotificationDropdown />

              {/* Clean Profile Popover Menu */}
              <UserProfileDropdown />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold text-white bg-slate-900 hover:bg-teal-600 px-4 py-2 rounded-full shadow-sm hover:shadow active:scale-95 transition-all"
              >
                Đăng ký khám
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
