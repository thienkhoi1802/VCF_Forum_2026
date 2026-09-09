import React from 'react';
import { Clock, AlertCircle, Mail, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface EventRegistrationSuccessModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  eventTitle?: string;
  email?: string;
  isWaitlist?: boolean;
}

export const EventRegistrationSuccessModal: React.FC<EventRegistrationSuccessModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  eventTitle: propEventTitle,
  email: propEmail,
  isWaitlist: propIsWaitlist,
}) => {
  const { eventSuccessModal, closeEventSuccessModal, navigateTo } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : eventSuccessModal.isOpen;
  const onClose = propOnClose || closeEventSuccessModal;
  const email = propEmail || eventSuccessModal.email || 'duc.pham@vinasteel.com.vn';
  const isWaitlist = propIsWaitlist !== undefined ? propIsWaitlist : eventSuccessModal.isWaitlist;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 border border-neutral-200/80 my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Đóng thông báo"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            CARD 1: TRẠNG THÁI HỒ SƠ (Khối viền vàng / nền kem chuẩn như hình ảnh)
            ========================================================================= */}
        <div className="bg-[#fffbeb] border-2 border-[#fde047] rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs">
          {/* Header Row */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full border-2 border-[#fde047] bg-[#fef08a]/70 flex items-center justify-center text-[#d97706] shrink-0 shadow-2xs">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="bg-[#fef08a] text-[#854d0e] font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md inline-block">
                TRẠNG THÁI HỒ SƠ
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#451a03] mt-1 tracking-tight">
                {isWaitlist ? 'Đang Trong Danh Sách Chờ' : 'Đang Chờ Ban Thư Ký Duyệt'}
              </h3>
            </div>
          </div>

          {/* Inner White Description Box */}
          <div className="bg-white rounded-xl p-4 border border-[#fef08a]/90 text-[13.5px] sm:text-[14px] text-[#78350f] leading-relaxed font-medium shadow-2xs">
            {isWaitlist ? (
              <p>
                Yêu cầu tham dự của quý vị đã được ghi nhận vào <strong>Danh sách chờ (Waitlist)</strong>. Khi có đại biểu thay đổi lịch trình hoặc khán phòng mở thêm chỗ, Ban Thư ký VCF sẽ gửi email thông báo xác nhận chính thức.
              </p>
            ) : (
              <p>
                Yêu cầu tham dự của quý vị đang được Ban Thư ký VCF xem xét và xác minh tư cách đại biểu. Khi được phê duyệt, hệ thống sẽ gửi email xác nhận kèm <strong className="font-black text-[#451a03]">Mã QR Check-in</strong> chính thức vào khán phòng.
              </p>
            )}
          </div>

          {/* Inner Note Box */}
          <div className="bg-[#fef9c3] rounded-xl p-3.5 border border-[#fef08a] flex items-center gap-3 text-[12.5px] sm:text-[13px] text-[#713f12]">
            <AlertCircle className="w-5 h-5 text-[#b45309] shrink-0" />
            <p className="leading-snug">
              <strong className="font-black text-[#451a03]">Lưu ý:</strong> Mã QR Check-in sẽ được cấp tự động tại mục này ngay khi Ban Thư ký phê duyệt.
            </p>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: THÔNG BÁO TỪ BAN THƯ KÝ (Khối xanh lam nhạt chuẩn như hình ảnh)
            ========================================================================= */}
        <div className="bg-[#eff6ff] border-2 border-[#bfdbfe] rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dbeafe] border border-[#93c5fd] flex items-center justify-center text-[#2563eb] shrink-0 shadow-2xs">
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1d4ed8] block">
                THÔNG BÁO TỪ BAN THƯ KÝ
              </span>
              <h4 className="text-[15px] sm:text-base font-black text-[#1e3a8a] tracking-tight">
                Vui lòng kiểm tra email thông tin đăng ký
              </h4>
            </div>
          </div>

          <p className="text-[13px] sm:text-[13.5px] text-[#334155] leading-relaxed pt-0.5">
            Hệ thống đã gửi biên nhận xác nhận tiếp nhận đăng ký tới địa chỉ: <strong className="font-bold text-black font-mono">{email}</strong>. Quý vị vui lòng mở hòm thư Inbox hoặc Spam để kiểm tra.
          </p>
        </div>

        {/* Actions Button Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigateTo('profile');
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer text-center"
          >
            Xem trong Hồ sơ của tôi
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã hiểu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
