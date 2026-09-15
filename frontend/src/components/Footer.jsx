import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <i className="fa-solid fa-heart-pulse text-sm"></i>
              </div>
              <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight">
                Medical<span className="text-teal-600">Net</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống kết nối và đặt lịch khám chữa bệnh trực tuyến thông minh, tối ưu thời gian chờ đợi cho bệnh nhân và nâng cao hiệu quả làm việc của y bác sĩ.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Dịch vụ</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Khám chuyên khoa Tim mạch</li>
              <li>Chăm sóc Da liễu & Thẩm mỹ</li>
              <li>Nhi khoa & Tiêm chủng</li>
              <li>Tư vấn sức khỏe trực tuyến</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Thông tin</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Quy trình đặt lịch hẹn</li>
              <li>Chính sách bảo mật y tế</li>
              <li>Hồ sơ bệnh án điện tử</li>
              <li>Điều khoản sử dụng</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Liên hệ hỗ trợ</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-xs text-teal-600 w-4"></i>
                <span>Hotline: 1900 6868 (24/7)</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-envelope text-xs text-teal-600 w-4"></i>
                <span>support@medicalnet.com</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-xs text-teal-600 w-4"></i>
                <span>Tòa nhà MedicalNet, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 MedicalNet Platform. Bản quyền đã được đăng ký bảo hộ.</p>
          <p className="mt-2 sm:mt-0">Hệ thống chuẩn y khoa bảo mật dữ liệu HIPAA & ISO 27001</p>
        </div>
      </div>
    </footer>
  );
}
