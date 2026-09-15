import React, { useEffect, useState } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { Link } from 'react-router-dom';
import SpecialityIcon from '../../components/common/SpecialityIcon';

export default function SpecialitiesPage() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi
      .getSpecialities()
      .then((data) => setSpecialities(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold mb-3">
          <i className="fa-solid fa-layer-group text-teal-600"></i>
          Danh mục Y khoa Đạt chuẩn
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Danh mục Chuyên khoa Y tế
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống chuyên khoa lâm sàng đạt chuẩn chất lượng khám chữa bệnh quốc tế
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">Đang tải danh mục chuyên khoa...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialities.map((sp) => (
            <div
              key={sp.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="mb-4">
                  <SpecialityIcon name={sp.name} iconUrl={sp.iconUrl} size="lg" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {sp.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {sp.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                <Link
                  to={`/doctors?speciality=${sp.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Xem bác sĩ chuyên khoa này <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
                <span className="text-[11px] text-slate-400 font-medium">Khám trực tiếp</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
