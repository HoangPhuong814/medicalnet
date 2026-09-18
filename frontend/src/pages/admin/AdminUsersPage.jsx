import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { userApi } from '../../api/userApi';
import DoctorModal from '../../components/admin/DoctorModal';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('DOCTORS'); // 'DOCTORS' | 'USERS'
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsData, usersData, specsData] = await Promise.all([
        doctorApi.getAllDoctors().catch(() => []),
        userApi.getAllUsers().catch(() => []),
        doctorApi.getSpecialities().catch(() => []),
      ]);
      setDoctors(docsData || []);
      setUsers(usersData || []);
      setSpecialities(specsData || []);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((doc) => {
      const name = (doc.user?.fullName || '').toLowerCase();
      const spec = (doc.speciality?.name || '').toLowerCase();
      const email = (doc.user?.email || '').toLowerCase();
      const addr = (doc.clinicAddress || '').toLowerCase();
      return name.includes(q) || spec.includes(q) || email.includes(q) || addr.includes(q);
    });
  }, [doctors, searchQuery]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const name = (u.fullName || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const matchQ = !q || name.includes(q) || email.includes(q);

      if (!matchQ) return false;
      if (genderFilter === 'ALL') return true;
      return String(u.gender).toUpperCase() === genderFilter;
    });
  }, [users, searchQuery, genderFilter]);

  // Handle open modal
  const handleCreateDoctor = () => {
    setEditingDoctor(null);
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setIsModalOpen(true);
  };

  // Handle delete doctor
  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ bác sĩ "${name}" khỏi hệ thống?`)) return;
    try {
      await doctorApi.deleteDoctor(id);
      setSuccessMessage(`Đã xóa hồ sơ bác sĩ ${name} thành công.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchData();
    } catch (err) {
      setErrorMessage(err.message || 'Không thể xóa hồ sơ bác sĩ.');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"? Thao tác này không thể hoàn tác.`)) return;
    try {
      await userApi.deleteUser(id);
      setSuccessMessage(`Đã xóa tài khoản ${name} thành công.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchData();
    } catch (err) {
      setErrorMessage(err.message || 'Không thể xóa tài khoản người dùng.');
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/admin" className="hover:text-teal-600 transition-colors">Trung tâm Quản trị</Link>
            <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
            <span className="text-slate-900 font-semibold">Quản lý Bác sĩ & Người dùng</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản trị Đội ngũ Y tế & Tài khoản
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Phân quyền tài khoản, bổ sung hồ sơ bác sĩ mới, cập nhật bảng giá và chuyên khoa
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-chart-line text-slate-500"></i>
            <span>Xem Dashboard KPI</span>
          </Link>

          <button
            type="button"
            onClick={handleCreateDoctor}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            <span>+ Thêm Bác sĩ mới</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-fade-in shadow-xs">
          <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 animate-fade-in shadow-xs">
          <i className="fa-solid fa-circle-exclamation text-red-600 text-sm"></i>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Main Tabs Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('DOCTORS');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'DOCTORS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-user-doctor text-xs"></i>
            <span>Đội ngũ Bác sĩ ({doctors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('USERS');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'USERS'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-users text-xs"></i>
            <span>Tài khoản Người dùng ({users.length})</span>
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'DOCTORS' ? 'Tìm bác sĩ, chuyên khoa, phòng khám...' : 'Tìm người dùng theo tên, email...'}
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Đang tải dữ liệu quản trị...
        </div>
      ) : activeTab === 'DOCTORS' ? (
        /* TAB 1: DOCTORS TABLE */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          {filteredDoctors.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg">
                <i className="fa-solid fa-user-doctor"></i>
              </div>
              <h3 className="text-xs font-bold text-slate-700">Không tìm thấy bác sĩ phù hợp</h3>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Không tìm thấy bác sĩ nào khớp với từ khóa "{searchQuery}".
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Bác sĩ</th>
                    <th className="py-3.5 px-4">Chuyên khoa</th>
                    <th className="py-3.5 px-4">Kinh nghiệm</th>
                    <th className="py-3.5 px-4">Chi phí khám</th>
                    <th className="py-3.5 px-4">Địa chỉ phòng khám</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Doctor Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {doc.user?.fullName ? doc.user.fullName[0].toUpperCase() : 'BS'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{doc.user?.fullName || 'Chưa cập nhật tên'}</span>
                              <i className="fa-solid fa-circle-check text-sky-500 text-[10px]" title="Đã xác thực"></i>
                            </div>
                            <span className="text-[11px] text-slate-400 block">{doc.user?.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Speciality */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
                          {doc.speciality?.name || 'Đa khoa'}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {doc.yearsOfExperience} năm
                      </td>

                      {/* Consultation Fee */}
                      <td className="py-4 px-4 font-extrabold text-teal-700">
                        {formatCurrency(doc.consultationFee)}
                      </td>

                      {/* Clinic Address */}
                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate" title={doc.clinicAddress}>
                        {doc.clinicAddress}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/doctors/${doc.id}`}
                            target="_blank"
                            title="Xem trang đặt lịch công khai"
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center text-xs"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleEditDoctor(doc)}
                            title="Chỉnh sửa hồ sơ bác sĩ"
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors flex items-center justify-center text-xs"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDoctor(doc.id, doc.user?.fullName)}
                            title="Xóa hồ sơ bác sĩ"
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center text-xs"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: USERS TABLE */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden space-y-4 p-5">
          {/* Sub Filters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Lọc giới tính:</span>
            {[
              { val: 'ALL', label: 'Tất cả' },
              { val: 'MALE', label: 'Nam' },
              { val: 'FEMALE', label: 'Nữ' },
              { val: 'NOT_PROVIDED', label: 'Khác' },
            ].map((g) => (
              <button
                key={g.val}
                type="button"
                onClick={() => setGenderFilter(g.val)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  genderFilter === g.val
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3 className="text-xs font-bold text-slate-700">Không tìm thấy tài khoản phù hợp</h3>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Không tìm thấy người dùng nào khớp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-5 -mb-5">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Tài khoản & Email</th>
                    <th className="py-3.5 px-4">Họ và tên</th>
                    <th className="py-3.5 px-4">Giới tính</th>
                    <th className="py-3.5 px-4">Ngày sinh</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Email & ID */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {u.fullName ? u.fullName[0].toUpperCase() : (u.email ? u.email[0].toUpperCase() : 'U')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.email}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Full Name */}
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {u.fullName || <span className="text-slate-400 italic">Chưa cập nhật</span>}
                      </td>

                      {/* Gender */}
                      <td className="py-4 px-4 text-slate-600">
                        {String(u.gender).toLowerCase() === 'female' ? (
                          <span className="inline-flex items-center gap-1 text-pink-600">
                            <i className="fa-solid fa-venus text-[10px]"></i> Nữ
                          </span>
                        ) : String(u.gender).toLowerCase() === 'male' ? (
                          <span className="inline-flex items-center gap-1 text-sky-600">
                            <i className="fa-solid fa-mars text-[10px]"></i> Nam
                          </span>
                        ) : (
                          <span className="text-slate-400">Khác</span>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="py-4 px-4 text-slate-600">
                        {u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                          Hoạt động
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.fullName || u.email)}
                          title="Xóa tài khoản"
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors inline-flex items-center justify-center text-xs"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Doctor Modal (Create / Edit) */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={editingDoctor}
        users={users}
        specialities={specialities}
        onSuccess={() => {
          setSuccessMessage(editingDoctor ? 'Cập nhật hồ sơ bác sĩ thành công!' : 'Thêm bác sĩ mới thành công!');
          setTimeout(() => setSuccessMessage(''), 4000);
          fetchData();
        }}
      />
    </div>
  );
}
