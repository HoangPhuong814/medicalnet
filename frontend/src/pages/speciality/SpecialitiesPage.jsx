import React, { useEffect, useState, useMemo } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { Link } from 'react-router-dom';
import SpecialityIcon from '../../components/common/SpecialityIcon';

// Common symptoms mapped by speciality keyword/name for intelligent lookup
const SYMPTOM_MAP = {
  'tim mạch': ['Tăng huyết áp', 'Đau thắt ngực', 'Hồi hộp đánh trống ngực', 'Khó thở khi gắng sức', 'Rối loạn nhịp tim'],
  'da liễu': ['Viêm da cơ địa', 'Mụn trứng cá', 'Dị ứng mẩn ngứa', 'Nấm da', 'Nổi mề đay'],
  'nhi khoa': ['Sốt phát ban', 'Ho đờm ở trẻ', 'Rối loạn tiêu hóa', 'Biếng ăn', 'Tiêm chủng & Dinh dưỡng'],
  'thần kinh': ['Đau nửa đầu Migraine', 'Mất ngủ kinh niên', 'Chóng mặt tiền đình', 'Đau dây thần kinh', 'Tê bì chân tay'],
  'răng hàm mặt': ['Sâu răng', 'Viêm tủy răng', 'Nhổ răng khôn', 'Niềng răng chỉnh nha', 'Chảy máu chân răng'],
  'mắt': ['Cận thị - Loạn thị', 'Đau mắt đỏ', 'Khô mắt mỏi mắt', 'Viêm kết mạc', 'Đục thủy tinh thể'],
  'tai mũi họng': ['Viêm xoang', 'Viêm họng hạt', 'Ù tai', 'Viêm amidan', 'Nghẹt mũi kéo dài'],
  'xương khớp': ['Thoái hóa khớp gối', 'Thoát vị đĩa đệm', 'Đau vai gáy', 'Viêm khớp dạng thấp', 'Gout cấp tính'],
  'tiêu hóa': ['Đau dạ dày', 'Trào ngược thực quản GERD', 'Viêm đại tràng', 'Táo bón kéo dài', 'Đầy hơi khó tiêu'],
  'nội tiết': ['Đái tháo đường', 'Bệnh tuyến giáp', 'Rối loạn chuyển hóa lipid', 'Tăng cân bất thường'],
};

export default function SpecialitiesPage() {
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  useEffect(() => {
    Promise.all([
      doctorApi.getSpecialities(),
      doctorApi.getAllDoctors().catch(() => []),
    ])
      .then(([spData, docData]) => {
        setSpecialities(spData || []);
        setDoctors(docData || []);
      })
      .catch((err) => console.error('Error fetching specialities:', err))
      .finally(() => setLoading(false));
  }, []);

  // Map doctor counts and doctor avatars by speciality ID
  const specialityDoctorMap = useMemo(() => {
    const map = {};
    doctors.forEach((doc) => {
      const sId = doc.speciality?.id;
      if (sId) {
        if (!map[sId]) {
          map[sId] = [];
        }
        map[sId].push(doc);
      }
    });
    return map;
  }, [doctors]);

  // Filtered specialities based on search and selected tag
  const filteredSpecialities = useMemo(() => {
    return specialities.filter((sp) => {
      const name = sp.name.toLowerCase();
      const desc = (sp.description || '').toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      // Check symptoms
      const symptoms = SYMPTOM_MAP[name] || [];
      const matchSymptom = symptoms.some((sym) => sym.toLowerCase().includes(query));

      const matchQuery = !query || name.includes(query) || desc.includes(query) || matchSymptom;

      if (!matchQuery) return false;

      if (selectedTag === 'ACTIVE_DOCTORS') {
        const docCount = (specialityDoctorMap[sp.id] || []).length;
        return docCount > 0;
      }

      return true;
    });
  }, [specialities, searchQuery, selectedTag, specialityDoctorMap]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner - X/Twitter Clean Contrast */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold mb-3">
            <i className="fa-solid fa-layer-group text-teal-600"></i>
            Danh mục Chuyên khoa Y tế Chuẩn hóa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hệ thống Chuyên khoa Lâm sàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Tra cứu theo chuyên khoa hoặc tìm kiếm nhanh theo triệu chứng bệnh lý để gặp đúng bác sĩ đầu ngành.
          </p>
        </div>

        {/* Live Stat Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm text-center">
            <span className="text-xs text-slate-400 block font-medium">Chuyên khoa</span>
            <span className="text-lg font-extrabold text-slate-900">{specialities.length}</span>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm text-center">
            <span className="text-xs text-slate-400 block font-medium">Bác sĩ sẵn sàng</span>
            <span className="text-lg font-extrabold text-teal-700">{doctors.length}</span>
          </div>
        </div>
      </div>

      {/* Intelligent Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên chuyên khoa hoặc triệu chứng (vd: huyết áp, đau dạ dày, sốt, đau răng, cận thị...)"
            className="w-full pl-10 pr-10 py-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Bộ lọc:</span>
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedTag === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả chuyên khoa ({specialities.length})
          </button>
          <button
            onClick={() => setSelectedTag('ACTIVE_DOCTORS')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedTag === 'ACTIVE_DOCTORS'
                ? 'bg-teal-700 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Có bác sĩ trực khám ({Object.keys(specialityDoctorMap).length})
          </button>

          {/* Quick symptom suggestions */}
          <div className="hidden lg:flex items-center gap-1.5 ml-auto text-[11px] text-slate-500">
            <span>Gợi ý:</span>
            {['Huyết áp', 'Đau nửa đầu', 'Dị ứng', 'Đau mắt'].map((sym) => (
              <button
                key={sym}
                onClick={() => setSearchQuery(sym)}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                #{sym}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Specialities */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Đang tải danh mục chuyên khoa...
        </div>
      ) : filteredSpecialities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy chuyên khoa phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không tìm thấy kết quả nào khớp với "{searchQuery}". Bạn vui lòng kiểm tra lại từ khóa hoặc xóa bộ lọc.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('ALL');
            }}
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-teal-600 transition-colors"
          >
            Xem tất cả chuyên khoa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialities.map((sp) => {
            const docList = specialityDoctorMap[sp.id] || [];
            const symptoms = SYMPTOM_MAP[sp.name.toLowerCase()] || [];

            return (
              <div
                key={sp.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Icon & Doctor count badge */}
                  <div className="flex items-start justify-between">
                    <SpecialityIcon name={sp.name} iconUrl={sp.iconUrl} size="lg" />
                    {docList.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {docList.length} Bác sĩ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                        Cập nhật lịch
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                      {sp.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {sp.description}
                    </p>
                  </div>

                  {/* Symptoms & Conditions pills */}
                  {symptoms.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Triệu chứng thường gặp:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {symptoms.slice(0, 3).map((sym, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-normal"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Doctors Pill Previews */}
                  {docList.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Bác sĩ phụ trách:</span>
                      <div className="flex items-center gap-1.5">
                        {docList.slice(0, 2).map((doc) => (
                          <Link
                            key={doc.id}
                            to={`/doctors/${doc.id}`}
                            className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 hover:bg-teal-100 transition-colors"
                          >
                            {doc.user?.fullName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/doctors?speciality=${sp.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:text-teal-700 transition-colors"
                  >
                    Xem lịch khám <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                  <span className="text-[10px] text-slate-400 font-medium">Khám trực tiếp 1-1</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
