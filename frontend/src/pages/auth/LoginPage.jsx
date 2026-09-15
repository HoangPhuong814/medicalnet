import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Email hoặc mật khẩu không chính xác');
    }
  };

  const handleQuickLogin = (accEmail, accPass) => {
    setEmail(accEmail);
    setPassword(accPass);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background blur orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-teal-200/30 to-sky-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            <i className="fa-solid fa-heart-pulse text-2xl"></i>
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Đăng nhập tài khoản
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Truy cập hồ sơ bệnh án và quản lý lịch khám cá nhân trên MedicalNet
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-8 border border-slate-200/80 rounded-3xl shadow-[0_20px_45px_rgba(0,0,0,0.05)]">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
              <i className="fa-solid fa-circle-exclamation text-xs text-red-600 shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email đăng nhập
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@medicalnet.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 transition-all"
                />
                <i className="fa-regular fa-envelope text-slate-400 absolute left-3 top-3 text-xs"></i>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 transition-all"
                />
                <i className="fa-solid fa-lock text-slate-400 absolute left-3 top-3 text-xs"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket text-xs"></i>
                  <span>Đăng nhập hệ thống</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helper - Pill Badges */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Tài khoản dùng thử nhanh 1-Click
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient@medicalnet.com', 'patient123')}
                className="py-2 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200/80 rounded-full text-center transition-all"
              >
                Bệnh nhân
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('doctor.tuan@medicalnet.com', 'doctor123')}
                className="py-2 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200/80 rounded-full text-center transition-all"
              >
                Bác sĩ Tuấn
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@medicalnet.com', 'admin123')}
                className="py-2 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200/80 rounded-full text-center transition-all"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Chưa có tài khoản khám bệnh?{' '}
          <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}
