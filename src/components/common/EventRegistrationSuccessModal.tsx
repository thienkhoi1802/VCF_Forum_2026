import React, { useEffect, useRef } from 'react';
import { Clock, Mail, X, Check, ArrowRight } from 'lucide-react';
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
  email: propEmail,
  isWaitlist: propIsWaitlist,
}) => {
  const { 
    eventSuccessModal, 
    closeEventSuccessModal, 
    navigateTo, 
    currentUser 
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : eventSuccessModal.isOpen;
  const onClose = propOnClose || closeEventSuccessModal;
  const currentEmail = propEmail || eventSuccessModal.email || currentUser?.email || 'thienkhoiart@gmail.com';
  const isWaitlist = propIsWaitlist !== undefined ? propIsWaitlist : eventSuccessModal.isWaitlist;

  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

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

  const handleViewStatus = () => {
    onClose();
    navigateTo('profile');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Dialog Container: Properly centered and constrained on all screen sizes */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-status-modal-title"
        className="relative w-full max-w-md sm:max-w-[480px] bg-white rounded-2xl shadow-2xl p-5 sm:p-7 border border-hairline my-auto overflow-hidden animate-scaleUp mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon button at top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 size-8 inline-flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer z-20"
          title="Đóng"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Success Icon with subtle celebration dots */}
        <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
          <span className="absolute -top-0.5 -left-0.5 size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="absolute top-3 -left-2.5 size-1 rounded-full bg-orange-400" />
          <span className="absolute -bottom-0.5 -left-1.5 size-1.5 rounded-full bg-amber-300" />
          <span className="absolute -top-1 right-1 size-1 rounded-full bg-sky-400" />
          <span className="absolute top-2.5 -right-2.5 size-1.5 rounded-full bg-rose-400" />
          <span className="absolute -bottom-0.5 -right-1 size-1 rounded-full bg-teal-400" />

          {/* Main Success Circle */}
          <div className="size-12 sm:size-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
            <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          </div>
        </div>

        {/* 2. Main confirmation headline */}
        <h2
          id="registration-status-modal-title"
          className="text-xl sm:text-[23px] font-extrabold text-ink tracking-tight text-center mt-2 sm:mt-2.5 leading-snug"
        >
          Đã gửi đăng ký thành công
        </h2>

        {/* 3. Current status badge */}
        <div className="flex justify-center mt-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-[11px] sm:text-xs font-semibold shadow-2xs">
            <Clock className="w-3 h-3 text-amber-600 stroke-[2.4]" />
            <span>{isWaitlist ? 'Danh sách chờ' : 'Đang chờ xét duyệt'}</span>
          </div>
        </div>

        {/* 4. Short supporting explanation */}
        <p className="text-[11.5px] sm:text-xs text-neutral-600 text-center max-w-sm mx-auto leading-relaxed mt-1.5">
          Ban Thư ký đã nhận hồ sơ của bạn và đang kiểm tra thông tin đăng ký. Chúng tôi sẽ thông báo qua email ngay khi có kết quả.
        </p>

        {/* 5. Three-step status/progress indicator: Horizontal on ALL screens */}
        <div className="mt-3.5 sm:mt-4 px-1 sm:px-2">
          <div className="flex items-center justify-between relative">
            {/* Step 1: Completed */}
            <div className="flex flex-col items-center flex-1">
              <div className="size-5 sm:size-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs z-10">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-800 text-center mt-1 leading-tight">
                Đã gửi đăng ký
              </span>
            </div>

            {/* Connecting line 1-2 */}
            <div className="h-0.5 bg-emerald-500 flex-1 -mt-4 sm:-mt-4.5 mx-0.5" />

            {/* Step 2: Current (Highlighted) */}
            <div className="flex flex-col items-center flex-1">
              <div className="size-5 sm:size-5.5 rounded-full border-2 border-amber-500 bg-white flex items-center justify-center shadow-xs z-10">
                <div className="size-2 sm:size-2.5 rounded-full bg-amber-500" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-900 text-center mt-1 leading-tight">
                Đang xét duyệt
              </span>
            </div>

            {/* Connecting line 2-3 */}
            <div className="h-0.5 bg-neutral-200 flex-1 -mt-4 sm:-mt-4.5 mx-0.5" />

            {/* Step 3: Upcoming */}
            <div className="flex flex-col items-center flex-1">
              <div className="size-5 sm:size-5.5 rounded-full border-2 border-neutral-300 bg-white flex items-center justify-center z-10" />
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-500 text-center mt-1 leading-tight">
                Nhận kết quả & QR
              </span>
            </div>
          </div>
        </div>

        {/* 6. Email information card: Compact, no "Đổi email" button */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 sm:p-3 mt-3 sm:mt-3.5 space-y-1.5 text-left shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs text-neutral-500">Kết quả gửi tới:</span>
              <span className="font-bold text-ink text-xs sm:text-[13px] break-all">
                {currentEmail}
              </span>
            </div>
          </div>

          <div className="pl-8 space-y-0.5">
            <p className="text-[10.5px] sm:text-[11.5px] text-neutral-600 leading-normal">
              Khi được duyệt, mã QR check-in sẽ xuất hiện trong <strong className="font-semibold text-ink">Hồ sơ của tôi</strong> và gửi qua email.
            </p>
            <p className="text-[10px] sm:text-[10.5px] text-neutral-400 font-medium">
              * Vui lòng kiểm tra cả thư mục Spam.
            </p>
          </div>
        </div>

        {/* 7. Primary CTA */}
        <button
          ref={primaryButtonRef}
          type="button"
          onClick={handleViewStatus}
          className="w-full min-h-[44px] py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-3 sm:mt-3.5"
        >
          <span>Xem hồ sơ của tôi</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
        </button>

        {/* 8. Secondary Action */}
        <div className="text-center mt-1.5 sm:mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-[11.5px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer py-0.5 transition-colors"
          >
            Tiếp tục xem sự kiện
          </button>
        </div>
      </div>
    </div>
  );
};
