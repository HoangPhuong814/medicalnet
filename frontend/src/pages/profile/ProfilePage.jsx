import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

export default function ProfilePage() {
  const { user, role, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('INFO'); // 'INFO' | 'PASSWORD'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const normalizeGender = (g) => {
    if (!g) return 'Male';
    const lower = String(g).toLowerCase();
    if (lower === 'female' || lower === 'nữ') return 'Female';
    if (lower === 'not_provided' || lower === 'other' || lower === 'khác') return 'Not_Provided';
    return 'Male';
  };

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setInitialLoading(true);
      try {
        const data = await authApi.getMyInfo();
        if (data) {
          setFullName(data.fullName || '');
          setEmail(data.email || '');
          setGender(normalizeGender(data.gender));
          setDateOfBirth(data.dateOfBirth || '');
          updateUser(data);
        }
      } catch (err) {
        // Fallback to existing user object in context
        if (user) {
          setFullName(user.fullName || '');
          setEmail(user.email || '');
          setGender(normalizeGender(user.gender));
          setDateOfBirth(user.dateOfBirth || '');
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        gender,
        dateOfBirth: dateOfBirth || null,
      };

      const updated = await authApi.updateMyInfo(payload);
      if (updated) {
        updateUser(updated);
        setFullName(updated.fullName || fullName);
        setGender(updated.gender || gender);
        setDateOfBirth(updated.dateOfBirth || dateOfBirth);
      }
      setSuccessMsg('Hồ sơ cá nhân đã được cập nhật thành công!');
    } catch (err) {
      setErrorMsg(err.message || 'Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        gender,
        dateOfBirth: dateOfBirth || null,
        password: newPassword,
      };

      await authApi.updateMyInfo(payload);
      setSuccessMsg('Mật khẩu đã được thay đổi thành công! Vui lòng sử dụng mật khẩu mới cho các lần đăng nhập sau.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    if (role === 'ADMIN') return 'Quản trị viên Hệ thống';
    if (role === 'DOCTOR') return 'Bác sĩ Chuyên khoa';
    return 'Bệnh nhân';
  };

  const getRoleBadgeClass = () => {
    if (role === 'ADMIN') return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    if (role === 'DOCTOR') return 'bg-teal-50 text-teal-800 border-teal-200/80';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-teal-600 transition-colors">Trang chủ</Link>
        <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span className="text-slate-900 font-semibold">Tài khoản & Hồ sơ</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile Card & Quick Actions */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            {/* Avatar Pill */}
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md mx-auto ring-4 ring-slate-100">
                {fullName ? fullName.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px]" title="Đang hoạt động">
                <i className="fa-solid fa-check"></i>
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                {fullName || 'Người dùng'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{email}</p>
            </div>

            <div className="pt-2 flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeClass()}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {getRoleLabel()}
              </span>
            </div>

            {/* Quick Stats / Account Details */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-left text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Trạng thái</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <i className="fa-solid fa-circle-check text-[10px]"></i> Đã kích hoạt
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bảo mật</span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                  <i className="fa-solid fa-shield-halved text-[10px] text-teal-600"></i> Chuẩn JWT
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links Menu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
              Liên kết nhanh
            </span>

            {role === 'PATIENT' && (
              <>
                <Link
                  to="/my-appointments"
                  className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <i className="fa-regular fa-calendar-check text-teal-600"></i>
                    <span>Lịch hẹn khám của tôi</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
                </Link>

                <Link
                  to="/my-medical-records"
                  className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-file-waveform text-teal-600"></i>
                    <span>Sổ bệnh án & Toa thuốc điện tử</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
                </Link>
              </>
            )}

            {role === 'DOCTOR' && (
              <Link
                to="/doctor/schedule"
                className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <i className="fa-solid fa-user-doctor text-teal-600"></i>
                  <span>Lịch trực & Tiếp nhận ca khám</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
              </Link>
            )}

            {role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-700 transition-colors font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <i className="fa-solid fa-chart-line text-indigo-600"></i>
                  <span>Bảng điều khiển Quản trị</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full flex items-center justify-between p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Đăng xuất khỏi hệ thống</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Editable Profile Forms */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Tabs Header - FB/X Style */}
            <div className="flex items-center border-b border-slate-100 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('INFO');
                  setSuccessMsg('');
                  setErrorMsg('');
                }}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'INFO'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-regular fa-id-card"></i>
                Thông tin Cá nhân
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('PASSWORD');
                  setSuccessMsg('');
                  setErrorMsg('');
                }}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'PASSWORD'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-solid fa-lock"></i>
                Đổi mật khẩu & Bảo mật
              </button>
            </div>

            {/* Notifications */}
            <div className="p-6 pb-0">
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-600 shrink-0"></i>
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-red-600 shrink-0"></i>
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Tab 1: Personal Information */}
            {activeTab === 'INFO' && (
              <form onSubmit={handleUpdateInfo} className="p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Chi tiết thông tin cá nhân</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thông tin này được dùng khi bác sĩ kê đơn thuốc và quản lý lịch khám
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Họ và tên đầy đủ
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 transition-all"
                    />
                  </div>

                  {/* Email (Readonly) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      Địa chỉ Email
                      <i className="fa-solid fa-lock text-[10px] text-slate-400" title="Không thể thay đổi email"></i>
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-slate-100/70 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth || ''}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 transition-all"
                    />
                  </div>

                  {/* Gender Select Segmented Pills */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Giới tính
                    </label>
                    <div className="flex items-center gap-3">
                      {[
                        { val: 'Male', label: 'Nam', icon: 'fa-mars' },
                        { val: 'Female', label: 'Nữ', icon: 'fa-venus' },
                        { val: 'Not_Provided', label: 'Khác', icon: 'fa-genderless' },
                      ].map((g) => (
                        <button
                          type="button"
                          key={g.val}
                          onClick={() => setGender(g.val)}
                          className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            gender === g.val
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <i className={`fa-solid ${g.icon}`}></i>
                          <span>{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk text-xs"></i>
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Change Password */}
            {activeTab === 'PASSWORD' && (
              <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Đổi mật khẩu tài khoản</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Để đảm bảo an toàn, vui lòng đặt mật khẩu có tối thiểu 6 ký tự
                  </p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !newPassword}
                    className="py-2.5 px-6 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-key text-xs"></i>
                        <span>Cập nhật mật khẩu mới</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
