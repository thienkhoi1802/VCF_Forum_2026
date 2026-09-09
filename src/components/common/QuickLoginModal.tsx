import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LogIn, X, Lock, Mail, AlertCircle, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

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
  const { login, loginWithAccount, showNotification } = useApp();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('duc.pham@vinasteel.com.vn');
  const [password, setPassword] = useState('••••••••');
  
  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [demoOtp, setDemoOtp] = useState('892601');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập Email công tác hợp lệ');
      return;
    }
    setError('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(randomOtp);
    setOtpSent(true);
    setCountdown(60);
    showNotification(`Mã OTP [${randomOtp}] đã gửi tới email ${email}`);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập Email công tác hợp lệ');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (email.includes('duc.pham') || email.includes('vinasteel')) {
        login();
      } else {
        loginWithAccount(email);
      }
      onClose();
      onLoginSuccess?.();
    }, 500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Vui lòng nhập đầy đủ mã OTP 6 số');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (email.includes('duc.pham') || email.includes('vinasteel')) {
        login();
      } else {
        loginWithAccount(email);
      }
      onClose();
      onLoginSuccess?.();
    }, 500);
  };

  const handleSocialLogin = (provider: 'google' | 'linkedin') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const socialEmail = provider === 'google' ? 'hoi.vien.google@vcf.org.vn' : 'hoi.vien.linkedin@vcf.org.vn';
      loginWithAccount(socialEmail, provider === 'google' ? 'Đại biểu Google' : 'Đại biểu LinkedIn');
      onClose();
      onLoginSuccess?.();
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    login();
    onClose();
    onLoginSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-md w-full overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="bg-[#1c1d1f] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded bg-[#eb1000] text-white text-xs font-black flex items-center justify-center">
              VCF
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
              DIỄN ĐÀN CEO VIỆT NAM
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white">
            Đăng Nhập Hội Viên VCF
          </h3>
          <p className="text-xs text-neutral-300 mt-0.5 font-sans">
            Đăng nhập để tự động điền hồ sơ và tra cứu vé tham dự.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Tab Switch */}
          <div className="flex border border-neutral-200 p-1 bg-neutral-100 text-xs rounded-full">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setError(''); }}
              className={`flex-1 py-1.5 font-bold rounded-full transition-all cursor-pointer ${
                authMode === 'password' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Mật khẩu
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setError(''); }}
              className={`flex-1 py-1.5 font-bold rounded-full transition-all cursor-pointer ${
                authMode === 'otp' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Mã OTP Email
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#eb1000] text-xs rounded-lg flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: Password */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Email công tác *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="duc.pham@vinasteel.com.vn"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-[#eb1000]"
                  />
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Mật khẩu *
                  </label>
                  <span 
                    onClick={() => showNotification('Đã gửi liên kết khôi phục mật khẩu vào email!')}
                    className="text-[11px] text-[#eb1000] hover:underline cursor-pointer font-semibold"
                  >
                    Quên mật khẩu?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-[#eb1000]"
                  />
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#eb1000] hover:bg-[#c90d00] text-white font-bold rounded-lg text-xs uppercase tracking-wide transition-all shadow-xs cursor-pointer disabled:opacity-70 mt-2"
              >
                {isSubmitting ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
              </button>
            </form>
          )}

          {/* TAB 2: OTP Email */}
          {authMode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Email công tác *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="duc.pham@vinasteel.com.vn"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-[#eb1000]"
                  />
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 px-4 bg-[#eb1000] hover:bg-[#c90d00] text-white font-bold rounded-lg text-xs uppercase tracking-wide cursor-pointer transition-all"
                >
                  GỬI MÃ OTP VỀ EMAIL
                </button>
              ) : (
                <div className="space-y-2.5 animate-fadeIn">
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center justify-between">
                    <span>Mã thử nghiệm: <strong className="font-mono text-emerald-950 font-bold">{demoOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(demoOtp)}
                      className="px-2 py-0.5 bg-emerald-700 text-white rounded font-bold text-[10px] cursor-pointer"
                    >
                      Điền nhanh
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Nhập mã OTP 6 số:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="VD: 892601"
                      className="w-full py-2 text-center font-mono text-lg font-bold border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-[#eb1000]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    {countdown > 0 ? (
                      <span>Gửi lại sau {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#eb1000] font-bold hover:underline cursor-pointer"
                      >
                        Gửi lại mã OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length !== 6}
                    className="w-full py-2.5 px-4 bg-[#eb1000] hover:bg-[#c90d00] text-white font-bold rounded-lg text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang xác thực...' : 'XÁC NHẬN VÀ ĐĂNG NHẬP'}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Social Login */}
          <div className="pt-1">
            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider absolute">
                Hoặc
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('linkedin')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.3a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Quick Demo 1-Click button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#eb1000]" />
            <span>Đăng nhập nhanh Demo (Phạm Minh Đức)</span>
          </button>

          {onSwitchToRegister && (
            <div className="pt-2 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-600 font-sans">
                Chưa có tài khoản Hội viên VCF?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="font-bold text-[#eb1000] hover:underline cursor-pointer"
                >
                  Đăng ký thành viên →
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
