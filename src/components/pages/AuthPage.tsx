import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SpecBadge } from '../wireframe/SpecBadge';
import { Lock, Mail, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { navigateTo, login, loginWithAccount, showSpecAnnotations, showNotification } = useApp();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('duc.pham@vinasteel.com.vn');
  const [password, setPassword] = useState('••••••••');
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [generatedOtp, setGeneratedOtp] = useState('892601');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập Email công tác hợp lệ');
      return;
    }
    setErrorMessage('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setCountdown(60);
    showNotification(`Mã OTP xác thực [${randomOtp}] đã được gửi tới email ${email}!`);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập Email công tác');
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
      navigateTo('profile');
    }, 600);
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số');
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
      showNotification('Xác thực mã OTP thành công! Chào mừng quý Hội viên.');
      navigateTo('profile');
    }, 600);
  };

  const handleSocialLogin = (provider: 'google' | 'linkedin') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const socialEmail = provider === 'google' ? 'hoi.vien.google@vcf.org.vn' : 'hoi.vien.linkedin@vcf.org.vn';
      const socialName = provider === 'google' ? 'Đại biểu Google Member' : 'Đại biểu LinkedIn Executive';
      loginWithAccount(socialEmail, socialName, 'Doanh nghiệp Đối tác');
      showNotification(`Đăng nhập thành công qua ${provider === 'google' ? 'Google' : 'LinkedIn'}!`);
      navigateTo('profile');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 pb-24 space-y-6 font-sans">
      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
          <SpecBadge label="Cổng Đăng nhập Hội viên VCF [Luồng duy nhất]" type="page" />
          <span className="text-neutral-500">Email & Social Login • OTP</span>
        </div>
      )}

      {/* Main Login Card - Exact Match with Screenshot 2 */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm rounded-2xl">
        {/* Logo & Title */}
        <div className="text-center space-y-2 pb-2">
          <div className="w-12 h-12 rounded-full bg-[#eb1000] text-white mx-auto flex items-center justify-center font-black font-mono shadow-xs text-base">
            VCF
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            Đăng Nhập Hội Viên VCF
          </h1>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            Cổng thông tin dành riêng cho thành viên Diễn đàn CEO Việt Nam
          </p>
        </div>

        {/* Tab switch between Password and OTP Email */}
        <div className="flex border border-neutral-200 p-1 bg-neutral-100 text-xs rounded-full">
          <button
            type="button"
            onClick={() => { 
              setAuthMode('password'); 
              setErrorMessage(''); 
            }}
            className={`flex-1 py-2 font-bold rounded-full transition-all duration-150 cursor-pointer ${
              authMode === 'password' 
                ? 'bg-[#eb1000] text-white shadow-xs' 
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            Mật khẩu
          </button>
          <button
            type="button"
            onClick={() => { 
              setAuthMode('otp'); 
              setErrorMessage(''); 
            }}
            className={`flex-1 py-2 font-bold rounded-full transition-all duration-150 cursor-pointer ${
              authMode === 'otp' 
                ? 'bg-[#eb1000] text-white shadow-xs' 
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            Mã OTP Email
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-[#eb1000] text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: Mật khẩu */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-800 block">Email công tác *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="duc.pham@vinasteel.com.vn"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-[#eb1000] font-sans transition-all duration-150 bg-white"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-neutral-800">Mật khẩu *</label>
                <button
                  type="button"
                  onClick={() => showNotification('Liên kết khôi phục mật khẩu đã được gửi về email của bạn!')}
                  className="text-[11px] text-[#eb1000] hover:underline font-bold cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-[#eb1000] font-sans transition-all duration-150 bg-white"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#eb1000] hover:bg-[#c90d00] text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
            </button>
          </form>
        )}

        {/* TAB 2: Mã OTP Email */}
        {authMode === 'otp' && (
          <form onSubmit={handleOtpLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-800 block">Email công tác *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="duc.pham@vinasteel.com.vn"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-[#eb1000] font-sans transition-all duration-150 bg-white"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>

            {!otpSent ? (
              <div className="space-y-2 pt-1">
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Hệ thống sẽ gửi mã xác thực OTP dùng một lần (6 chữ số) đến email của Quý vị.
                </p>
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="w-full py-3 bg-[#eb1000] hover:bg-[#c90d00] text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>GỬI MÃ OTP VỀ EMAIL</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1 animate-fadeIn">
                {/* OTP Sent Banner */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-emerald-950 block">Mã OTP đã được gửi thành công!</span>
                    <span className="text-emerald-700 text-[11px] block mt-0.5">
                      Vui lòng kiểm tra hòm thư <strong>{email}</strong>
                    </span>
                  </div>
                </div>

                {/* Fast demo OTP helper button */}
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-neutral-600">
                    Mã OTP thử nghiệm: <strong className="text-[#eb1000] font-mono font-black">{generatedOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp)}
                    className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-bold text-[10px] cursor-pointer"
                  >
                    Điền nhanh
                  </button>
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Nhập mã OTP (6 chữ số) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="VD: 892601"
                    className="w-full py-3 px-4 text-center font-mono text-xl tracking-widest border border-neutral-300 rounded-xl focus:outline-none focus:border-[#eb1000] font-black bg-white"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                  {countdown > 0 ? (
                    <span>Gửi lại mã sau <strong>{countdown}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="text-[#eb1000] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Gửi lại mã OTP</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-neutral-500 hover:text-black underline cursor-pointer"
                  >
                    Đổi email
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length !== 6}
                  className="w-full py-3 bg-[#eb1000] hover:bg-[#c90d00] text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang xác thực...' : 'ĐĂNG NHẬP VỚI MÃ OTP'}
                </button>
              </div>
            )}
          </form>
        )}

        {/* SOCIAL LOGIN SECTION: Email & Social Login */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-neutral-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Hoặc tiếp tục với
            </span>
            <div className="flex-grow border-t border-neutral-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-2">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:border-neutral-400 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* LinkedIn Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('linkedin')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:border-neutral-400 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.3a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Demo Fast Login Hint - Exact Match with Screenshot 2 */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-700 space-y-1">
          <div className="font-bold text-black">Tài khoản demo:</div>
          <div>Email: <strong className="text-[#eb1000]">duc.pham@vinasteel.com.vn</strong></div>
          <div className="text-neutral-500 text-[11px]">(Bấm "Đăng nhập" để vào thẳng Hồ sơ hội viên)</div>
        </div>

        {/* Registration Branch Button (Dẫn nhánh đến màn Đăng ký thành viên) */}
        <div className="pt-3 border-t border-neutral-100 text-center space-y-2">
          <div className="text-xs text-neutral-500 font-medium">Bạn chưa là thành viên Diễn đàn?</div>
          <button
            type="button"
            onClick={() => navigateTo('register-member')}
            className="w-full py-2.5 px-4 border border-neutral-300 hover:border-black text-neutral-900 hover:bg-neutral-50 font-bold rounded-full text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Đăng Ký Thành Viên VCF →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
