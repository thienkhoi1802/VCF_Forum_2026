import React from 'react';
import { X } from 'lucide-react';
import { VcfAuthCard } from '../auth/VcfAuthCard';

interface QuickLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
  eventTitle?: string;
}

export const QuickLoginModal: React.FC<QuickLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
  eventTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-[500px] bg-white shadow-2xl border border-neutral-200 my-8 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-login-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {eventTitle && (
          <div className="bg-neutral-100 border-b border-neutral-200 px-6 py-3 text-xs text-neutral-700">
            Đang đăng nhập để tiếp tục đăng ký: <strong className="text-neutral-900">{eventTitle}</strong>
          </div>
        )}

        <VcfAuthCard 
          initialMode="login" 
          onSuccess={() => {
            onClose();
            onLoginSuccess?.();
          }}
          className="border-none shadow-none p-6 sm:p-8"
        />
      </div>
    </div>
  );
};
