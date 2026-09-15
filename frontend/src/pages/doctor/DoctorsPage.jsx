import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import DoctorCard from '../../components/common/DoctorCard';

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpeciality = searchParams.get('speciality') || 'ALL';

  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(initialSpeciality);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const spFromUrl = searchParams.get('speciality');
    if (spFromUrl) {
      setSelectedSpeciality(spFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docData, spData] = await Promise.all([
          doctorApi.getAllDoctors(),
          doctorApi.getSpecialities(),
        ]);
        setDoctors(docData || []);
        setSpecialities(spData || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bác sĩ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectSpeciality = (spId) => {
    setSelectedSpeciality(spId);
    if (spId === 'ALL') {
      searchParams.delete('speciality');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ speciality: spId });
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpec =
      selectedSpeciality === 'ALL' || doc.speciality?.id === Number(selectedSpeciality);
    const term = search.toLowerCase();
    const docName = doc.user?.fullName?.toLowerCase() || '';
    const spName = doc.speciality?.name?.toLowerCase() || '';
    const clinic = doc.clinicAddress?.toLowerCase() || '';
    const matchesSearch = docName.includes(term) || spName.includes(term) || clinic.includes(term);
    return matchesSpec && matchesSearch;
  });

  const formatCurrency = (val) => {
    if (!val) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold mb-3">
          <i className="fa-solid fa-user-doctor text-teal-600"></i>
          Đội ngũ Bác sĩ Y khoa
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bác sĩ Chuyên khoa Hàng đầu
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tìm kiếm và đặt lịch khám với các chuyên gia y tế giàu kinh nghiệm được xác thực
        </p>
      </div>

      {/* Filter bar - FB/X Clean Pill Style */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bác sĩ, bệnh viện, phòng khám..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-200/80 rounded-full focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 transition-all"
          />
          <i className="fa-solid fa-magnifying-glass text-xs text-slate-400 absolute left-3.5 top-3"></i>
        </div>

        {/* Speciality filter pills like X (Twitter) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleSelectSpeciality('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 ${
              selectedSpeciality === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            Tất cả chuyên khoa
          </button>
          {specialities.map((sp) => (
            <button
              key={sp.id}
              onClick={() => handleSelectSpeciality(sp.id.toString())}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 ${
                selectedSpeciality === sp.id.toString()
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {sp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor list */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">Đang tải danh sách bác sĩ...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-500 shadow-sm">
          Không tìm thấy bác sĩ phù hợp với tiêu chí lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
