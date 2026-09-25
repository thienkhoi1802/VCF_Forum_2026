import React, { useState, useEffect, useRef } from 'react';
import { Clock, Mail, X, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const { 
    eventSuccessModal, 
    closeEventSuccessModal, 
    navigateTo, 
    currentUser, 
    updateUserProfile, 
    showNotification 
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : eventSuccessModal.isOpen;
  const onClose = propOnClose || closeEventSuccessModal;
  const fallbackEmail = propEmail || eventSuccessModal.email || currentUser?.email || 'duc.pham@vinasteel.com.vn';
  const isWaitlist = propIsWaitlist !== undefined ? propIsWaitlist : eventSuccessModal.isWaitlist;

  const [currentEmail, setCurrentEmail] = useState(fallbackEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState(fallbackEmail);

  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Sync email when prop or context changes
  useEffect(() => {
    if (fallbackEmail) {
      setCurrentEmail(fallbackEmail);
      setEditedEmail(fallbackEmail);
    }
  }, [fallbackEmail]);

  // Accessibility: Focus trap, Esc key listener, return focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const focusTimer = setTimeout(() => {
        primaryButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editedEmail.trim();
    if (!trimmed || !trimmed.includes('@')) {
      showNotification('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    setCurrentEmail(trimmed);
    setIsEditingEmail(false);
    if (updateUserProfile) {
      updateUserProfile({ email: trimmed });
    }
    showNotification('Đã cập nhật email tiếp nhận kết quả thành công');
  };

  const handleViewStatus = () => {
    onClose();
    navigateTo('profile');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Dialog Container: 640px max width on desktop, 90vw max, max 90vh with scroll for 393px mobile */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-status-modal-title"
        className="relative w-full max-w-[640px] max-w-[90vw] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 border border-hairline my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Nút đóng ở góc trên bên phải (Hit area >= 44x44px, không chạm viền) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Đóng thông báo"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2 + 3 + 4 + 5. Header & Trạng thái: Eyebrow + Tiêu đề + Nội dung */}
        <div className="space-y-3 sm:space-y-3.5 pr-8">
          {/* Eyebrow Label & Status Icon (Khối nền vàng nhạt duy nhất biểu thị trạng thái chờ) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 stroke-[2.2]" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              TRẠNG THÁI HỒ SƠ
            </span>
          </div>

          {/* Tiêu đề: Desktop 30px (sm:text-[30px]), mobile 24px (text-2xl) */}
          <h2
            id="registration-status-modal-title"
            className="text-2xl sm:text-[30px] sm:leading-[36px] font-bold text-ink tracking-tight"
          >
            {isWaitlist ? 'Đăng ký đang trong danh sách chờ' : 'Đăng ký đang chờ xét duyệt'}
          </h2>

          {/* Nội dung chính: Body text 16px, line-height >= 24px */}
          <p className="text-base leading-relaxed text-neutral-700">
            {isWaitlist
              ? 'Ban Thư ký đã tiếp nhận đăng ký của quý vị vào danh sách chờ và đang xác minh thông tin tư cách đại biểu.'
              : 'Ban Thư ký đã tiếp nhận đăng ký và đang xác minh tư cách đại biểu của quý vị.'}
          </p>
        </div>

        {/* 6 + 7. Khối thông tin email: Nền xám trung tính / xanh rất nhạt */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 shadow-2xs">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-[14.5px] sm:text-base leading-relaxed text-neutral-700">
                Kết quả sẽ được gửi đến{' '}
                <span className="font-semibold text-ink font-mono break-all">{currentEmail}</span>. Sau
                khi được duyệt, mã QR check-in sẽ xuất hiện trong mục{' '}
                <strong className="font-semibold text-ink">Hồ sơ của tôi</strong> và được gửi qua
                email.
              </p>

              {/* Email update inline toggle/form */}
              {!isEditingEmail ? (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedEmail(currentEmail);
                      setIsEditingEmail(true);
                    }}
                    className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Email chưa đúng? Cập nhật</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveEmail} className="pt-2 flex flex-wrap items-center gap-2">
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Nhập email chính xác..."
                    className="flex-1 min-w-[200px] text-xs font-mono px-3 py-1.5 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(false)}
                    className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    Hủy
                  </button>
                </form>
              )}

              {/* Dòng phụ: Vui lòng kiểm tra cả hộp thư Spam */}
              <p className="text-xs text-neutral-500 pt-0.5">
                Vui lòng kiểm tra cả hộp thư Spam.
              </p>
            </div>
          </div>
        </div>

        {/* 8 + 9. CTA Buttons:
            Trên mobile xếp dọc, CTA chính nằm trên và full-width;
            Trên desktop xếp ngang, CTA chính nổi bật màu đỏ thương hiệu, CTA phụ trung tính.
            Các nút cao tối thiểu 44px (min-h-[44px]). */}
        <div className="pt-1 flex flex-col sm:flex-row-reverse sm:items-center sm:justify-start gap-3">
          {/* CTA chính: “Xem trạng thái hồ sơ” (Màu đỏ thương hiệu, min-h-[44px]) */}
          <button
            ref={primaryButtonRef}
            type="button"
            onClick={handleViewStatus}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-sm sm:text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Xem trạng thái hồ sơ</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* CTA phụ: “Đóng” (Nút outline/text trung tính, min-h-[44px]) */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-sm sm:text-base font-medium text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

