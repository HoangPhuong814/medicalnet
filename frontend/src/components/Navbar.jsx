import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-heart-pulse text-base"></i>
          </div>
          <div className="font-heading font-extrabold text-xl tracking-tight">
            <span className="text-slate-900">Medical</span>
            <span className="text-teal-600">Net</span>
          </div>
        </Link>

        {/* Navigation links - FB/X Pill Hover */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            Trang chủ
          </Link>
          <Link
            to="/doctors"
            className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            Đội ngũ Bác sĩ
          </Link>
          <Link
            to="/specialities"
            className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            Chuyên khoa
          </Link>

          {isAuthenticated && role === 'PATIENT' && (
            <Link
              to="/my-appointments"
              className="px-3.5 py-1.5 rounded-full text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-all flex items-center gap-1.5 font-semibold"
            >
              <i className="fa-regular fa-calendar-check text-xs"></i>
              Lịch khám của tôi
            </Link>
          )}

          {isAuthenticated && role === 'DOCTOR' && (
            <Link
              to="/doctor/schedule"
              className="px-3.5 py-1.5 rounded-full text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-all flex items-center gap-1.5 font-semibold"
            >
              <i className="fa-solid fa-user-doctor text-xs"></i>
              Quản lý ca khám
            </Link>
          )}

          {isAuthenticated && role === 'ADMIN' && (
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-full text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-all flex items-center gap-1.5 font-semibold"
            >
              <i className="fa-solid fa-shield-halved text-xs"></i>
              Quản trị hệ thống
            </Link>
          )}
        </nav>

        {/* Auth action buttons - X Pill Style */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.fullName || user?.email || 'Người dùng'}
                </div>
                <div className="text-[11px] text-teal-600 font-semibold">
                  {role === 'ADMIN' ? 'Quản trị viên' : role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
              </button>
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
