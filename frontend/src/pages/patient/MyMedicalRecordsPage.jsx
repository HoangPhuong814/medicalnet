import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { medicalRecordApi } from '../../api/medicalRecordApi';

export default function MyMedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      const data = await medicalRecordApi.getMyMedicalRecords();
      setRecords(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải sổ bệnh án điện tử.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-1 border border-teal-200/60">
            <i className="fa-solid fa-file-medical text-teal-600"></i>
            Hồ Sơ Y Tế Điện Tử
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sổ Bệnh Án & Toa Thuốc Của Tôi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ lịch sử khám bệnh, chẩn đoán xác định và đơn thuốc chỉ định từ bác sĩ chuyên khoa
          </p>
        </div>

        <Link
          to="/my-appointments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
        >
          <i className="fa-regular fa-calendar-check text-xs"></i>
          Xem lịch hẹn khám
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
          <i className="fa-solid fa-circle-exclamation text-xs text-red-600"></i>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Đang tải hồ sơ bệnh án...
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <i className="fa-solid fa-folder-open text-3xl"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">Chưa có bệnh án điện tử nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Sau khi bạn hoàn thành buổi khám bệnh với bác sĩ, bệnh án và toa thuốc điện tử sẽ tự động xuất hiện tại đây.
          </p>
          <div className="pt-2">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              Đặt lịch khám ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Record Top Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                      Mã hồ sơ: MR-{rec.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-1.5">
                      Bác sĩ: {rec.doctorName}
                      <i className="fa-solid fa-circle-check text-sky-500 text-xs"></i>
                    </h3>
                    <p className="text-xs text-slate-500">Chuyên khoa: {rec.specialityName}</p>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(rec.createdAt)}
                  </span>
                </div>

                {/* Clinical Diagnosis Box */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Chẩn đoán lâm sàng:
                  </span>
                  <p className="font-bold text-slate-900 text-sm">
                    {rec.diagnosis}
                  </p>
                </div>

                {/* Prescription Snippet */}
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <i className="fa-solid fa-pills text-teal-600"></i> Toa thuốc chỉ định:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-800 line-clamp-3 whitespace-pre-line">
                    {rec.prescription}
                  </div>
                </div>

                {/* Follow up tag */}
                {rec.followUpDate && (
                  <div className="text-xs text-teal-800 bg-teal-50/70 p-2 rounded-lg border border-teal-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium">
                      <i className="fa-regular fa-calendar text-teal-600"></i>
                      Hẹn tái khám:
                    </span>
                    <strong>{rec.followUpDate}</strong>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ca khám #{rec.appointmentId}</span>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className="px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-expand text-[10px]"></i>
                  Xem toa thuốc đầy đủ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Full View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <i className="fa-solid fa-file-waveform"></i>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Hồ Sơ Bệnh Án & Toa Thuốc Điện Tử
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Mã hồ sơ: MR-{selectedRecord.id} • {formatDate(selectedRecord.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 flex items-start justify-between">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                    Bệnh viện Đa khoa MedicalNet
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    TOA THUỐC ĐIỆN TỬ
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mã hồ sơ: <strong>MR-{selectedRecord.id}</strong> • Ca khám: #{selectedRecord.appointmentId}
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[11px]">Bác sĩ chỉ định</span>
                  <strong className="text-slate-900 flex items-center gap-1 justify-end font-semibold">
                    {selectedRecord.doctorName}
                    <i className="fa-solid fa-circle-check text-sky-500 text-[10px]"></i>
                  </strong>
                  <span className="text-teal-700 text-[11px]">{selectedRecord.specialityName}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-400 text-[11px] block">Triệu chứng:</span>
                <span className="text-slate-800">{selectedRecord.symptoms || 'Khám lâm sàng'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs space-y-1">
                <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px] block">
                  Chẩn đoán xác định:
                </span>
                <p className="text-slate-900 font-bold text-sm">
                  {selectedRecord.diagnosis}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-pills text-teal-600"></i>
                  Đơn thuốc & Hướng dẫn sử dụng:
                </span>
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedRecord.prescription}
                </div>
              </div>

              {selectedRecord.treatmentPlan && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    Lời dặn & Hướng dẫn sinh hoạt:
                  </span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedRecord.treatmentPlan}
                  </p>
                </div>
              )}

              {selectedRecord.followUpDate && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/60 text-xs text-teal-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <i className="fa-regular fa-calendar text-teal-600"></i>
                    Hẹn ngày tái khám định kỳ:
                  </span>
                  <strong className="text-slate-900 font-bold">{selectedRecord.followUpDate}</strong>
                </div>
              )}

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-print text-xs"></i>
                  In toa thuốc
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
