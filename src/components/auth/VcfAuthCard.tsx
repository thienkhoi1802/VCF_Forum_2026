import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck
} from 'lucide-react';
import {
  isEmailRegisteredInSystem,
  getAccountByEmail,
  saveRegisteredAccount,
  maskEmail,
  generateAndStoreOtp,
  getStoredOtp,
  recordOtpAttempt,
  clearStoredOtp
} from '../../utils/authService';

interface VcfAuthCardProps {
  initialMode?: 'login' | 'register';
  returnUrl?: string;
  onSuccess?: () => void;
  className?: string;
}

export const VcfAuthCard: React.FC<VcfAuthCardProps> = ({
  initialMode = 'login',
  returnUrl,
  onSuccess,
  className = ''
}) => {
  const { 
    login, 
    loginWithAccount, 
    registerMember, 
    signupLite, 
    navigateTo, 
    pendingAction,
    showNotification 
  } = useApp();

  // Mode: 'login' | 'register' | 'forgot-password'
  const [cardMode, setCardMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  
  // Login Tab: 'password' | 'otp'
  const [authTab, setAuthTab] = useState<'password' | 'otp'>('password');

  // Form Fields - clean inputs, no prefilled credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regJobTitle, setRegJobTitle] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);

  // OTP State
  const [otpStage, setOtpStage] = useState<'email' | 'verify'>('email');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [maskedEmailDisplay, setMaskedEmailDisplay] = useState('');
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(60); // 60s resend timer
  const [otpRemainingValidity, setOtpRemainingValidity] = useState(300); // 5 minutes validity
  const [activeGeneratedOtp, setActiveGeneratedOtp] = useState<string | null>(null);

  // Feedback, Loading & Rate Limit States
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoadingProvider, setSocialLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rateLimitLocked, setRateLimitLocked] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Ref for the 6 OTP input boxes
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Update card mode if initialMode prop changes
  useEffect(() => {
    setCardMode(initialMode);
  }, [initialMode]);

  // Countdown timer for OTP resend and validity
  useEffect(() => {
    let interval: any = null;
    if (otpStage === 'verify') {
      interval = setInterval(() => {
        setOtpTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
        setOtpRemainingValidity(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStage]);

  const handleFinishSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else if (pendingAction) {
      // Pending action will be resumed by context
    } else {
      navigateTo('profile');
    }
  };

  // Reset errors when switching tab/mode
  const handleTabSwitch = (tab: 'password' | 'otp') => {
    setAuthTab(tab);
    setErrorMessage('');
    setFieldErrors({});
    if (tab === 'password') {
      setOtpStage('email');
      setOtpDigits(['', '', '', '', '', '']);
    }
  };

  // ----------------------------------------------------
  // Social Login / Registration (Google & Facebook)
  // ----------------------------------------------------
  const handleSocialAction = (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setSocialLoadingProvider(provider);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      setSocialLoadingProvider(null);

      const providerName = provider === 'google' ? 'Google' : 'Facebook';
      const socialEmail = provider === 'google' ? 'hoi.vien.google@vcf.org.vn' : 'hoi.vien.fb@vcf.org.vn';
      const socialFullName = provider === 'google' ? 'Đại biểu Google Member' : 'Đại biểu Facebook Member';

      saveRegisteredAccount({
        email: socialEmail,
        fullName: socialFullName,
        companyName: 'Doanh nghiệp Đối tác VCF',
        jobTitle: 'Hội viên Ban điều hành',
        registeredAt: new Date().toISOString()
      });

      if (cardMode === 'register') {
        signupLite(provider, {
          email: socialEmail,
          fullName: socialFullName
        });
      } else {
        loginWithAccount(socialEmail, socialFullName, 'Doanh nghiệp Đối tác VCF');
      }

      showNotification(`Xác thực thành công qua ${providerName}! Chào mừng quý Hội viên.`);
      handleFinishSuccess();
    }, 800);
  };

  // ----------------------------------------------------
  // Password Login
  // ----------------------------------------------------
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errors.email = 'Vui lòng nhập Email công tác';
    } else if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      errors.email = 'Email công tác không đúng định dạng';
    }

    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (rateLimitLocked) {
      setErrorMessage('Tài khoản tạm thời bị khóa do nhập sai mật khẩu quá 5 lần. Vui lòng liên hệ Ban Thư ký VCF hoặc thử lại sau 15 phút.');
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    setTimeout(() => {
      setIsLoading(false);

      const registered = isEmailRegisteredInSystem(cleanEmail);
      if (!registered) {
        setErrorMessage('Email công tác chưa có tài khoản Hội viên VCF. Quý vị vui lòng đăng ký thành viên hoặc kiểm tra lại địa chỉ email.');
        return;
      }

      if (password === 'wrongpassword') {
        const nextAttempts = passwordAttempts + 1;
        setPasswordAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setRateLimitLocked(true);
          setErrorMessage('Bạn đã nhập sai mật khẩu 5 lần. Tài khoản tạm thời bị khóa để bảo mật.');
        } else {
          setErrorMessage(`Mật khẩu không chính xác. Quý vị còn ${5 - nextAttempts} lần thử.`);
        }
        return;
      }

      const acc = getAccountByEmail(cleanEmail);
      if (cleanEmail.includes('duc.pham') || cleanEmail.includes('vinasteel')) {
        login();
      } else {
        loginWithAccount(cleanEmail, acc?.fullName, acc?.companyName);
      }

      handleFinishSuccess();
    }, 600);
  };

  // ----------------------------------------------------
  // OTP Flow
  // ----------------------------------------------------
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFieldErrors({ email: 'Vui lòng nhập Email công tác hợp lệ' });
      return;
    }

    const registered = isEmailRegisteredInSystem(cleanEmail);
    if (!registered) {
      setErrorMessage('EMAIL_NOT_FOUND');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const { code } = generateAndStoreOtp(cleanEmail);
      setActiveGeneratedOtp(code);
      setMaskedEmailDisplay(maskEmail(cleanEmail));
      setOtpStage('verify');
      setOtpTimerSeconds(60);
      setOtpRemainingValidity(300);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpAttempts(0);
      setErrorMessage('');
      setFieldErrors({});

      showNotification(`Mã xác thực OTP đã được gửi tới email ${cleanEmail}!`);

      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }, 500);
  };

  const handleResendOtp = () => {
    if (otpTimerSeconds > 0) return;
    const cleanEmail = email.trim();
    const { code } = generateAndStoreOtp(cleanEmail);
    setActiveGeneratedOtp(code);
    setOtpTimerSeconds(60);
    setOtpRemainingValidity(300);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    showNotification(`Đã gửi lại mã OTP mới tới email ${cleanEmail}!`);
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 100);
  };

  const handleDigitChange = (index: number, val: string) => {
    const numericVal = val.replace(/\D/g, '');
    if (!numericVal) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    const lastChar = numericVal.slice(-1);
    const next = [...otpDigits];
    next[index] = lastChar;
    setOtpDigits(next);

    if (index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pastedData[i] || '';
    }
    setOtpDigits(next);

    const targetFocus = Math.min(pastedData.length, 5);
    otpInputsRef.current[targetFocus]?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số của mã xác thực OTP.');
      return;
    }

    if (otpRemainingValidity <= 0) {
      setErrorMessage('Mã OTP đã hết hiệu lực (quá thời hạn 5 phút). Quý vị vui lòng bấm "Gửi lại mã" để nhận mã mới.');
      return;
    }

    const cleanEmail = email.trim();
    const stored = getStoredOtp(cleanEmail);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const validCode = stored?.code || activeGeneratedOtp;
      if (fullCode !== validCode) {
        const attempts = recordOtpAttempt(cleanEmail);
        setOtpAttempts(attempts);
        if (attempts >= 5) {
          setRateLimitLocked(true);
          setErrorMessage('Quý vị đã nhập sai mã OTP quá 5 lần. Để bảo mật tài khoản, phiên xác thực bị tạm khóa trong 15 phút.');
        } else {
          setErrorMessage(`Mã xác thực không chính xác. Quý vị còn ${5 - attempts} lần thử.`);
        }
        return;
      }

      clearStoredOtp();
      const acc = getAccountByEmail(cleanEmail);
      if (cleanEmail.includes('duc.pham') || cleanEmail.includes('vinasteel')) {
        login();
      } else {
        loginWithAccount(cleanEmail, acc?.fullName, acc?.companyName);
      }

      showNotification('Xác thực mã OTP thành công! Chào mừng quý Hội viên.');
      handleFinishSuccess();
    }, 600);
  };

  // ----------------------------------------------------
  // Registration Flow
  // ----------------------------------------------------
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    if (!regFullName.trim()) {
      errors.fullName = 'Vui lòng nhập Họ và tên của bạn';
    }

    const cleanEmail = regEmail.trim();
    if (!cleanEmail) {
      errors.email = 'Vui lòng nhập Email công tác';
    } else if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      errors.email = 'Email công tác không đúng định dạng';
    } else if (isEmailRegisteredInSystem(cleanEmail)) {
      errors.email = 'EMAIL_ALREADY_EXISTS';
    }

    if (!regPassword) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (regPassword.length < 8) {
      errors.password = 'Mật khẩu phải có tối thiểu 8 ký tự';
    }

    if (regPassword !== regConfirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    if (!regAgreeTerms) {
      errors.terms = 'Vui lòng đồng ý với Điều lệ Hội viên & Quy chế bảo mật VCF';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.email === 'EMAIL_ALREADY_EXISTS') {
        setErrorMessage('Email công tác này đã được đăng ký tài khoản Hội viên VCF.');
      } else {
        setErrorMessage('Vui lòng kiểm tra lại các trường thông tin có báo lỗi bên dưới.');
      }
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    setTimeout(() => {
      setIsLoading(false);

      saveRegisteredAccount({
        email: cleanEmail,
        fullName: regFullName.trim(),
        companyName: regCompany.trim(),
        jobTitle: regJobTitle.trim(),
        registeredAt: new Date().toISOString()
      });

      registerMember({
        fullName: regFullName.trim(),
        email: cleanEmail,
        companyName: regCompany.trim(),
        jobTitle: regJobTitle.trim(),
        isProfileComplete: true
      });

      showNotification(`Đăng ký thành viên thành công! Chào mừng ${regFullName} gia nhập Diễn đàn CEO Việt Nam.`);
      handleFinishSuccess();
    }, 800);
  };

  // ----------------------------------------------------
  // Forgot Password Flow
  // ----------------------------------------------------
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFieldErrors({ email: 'Vui lòng nhập Email công tác hợp lệ' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const registered = isEmailRegisteredInSystem(cleanEmail);
      if (!registered) {
        setErrorMessage('Email công tác chưa được đăng ký trong hệ thống Hội viên VCF.');
        return;
      }
      setForgotPasswordSuccess(true);
      showNotification(`Liên kết đặt lại mật khẩu đã được gửi đến email ${cleanEmail}!`);
    }, 600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`w-full max-w-[480px] bg-white border border-neutral-200 p-4 sm:p-7 md:p-9 shadow-sm rounded-none font-sans text-neutral-900 ${className}`}
      aria-live="polite"
    >
      {/* 2. Card Header */}
      <div className="text-center mb-3 sm:mb-5">
        <h1 className={`text-xl sm:text-2xl ${cardMode === 'login' ? 'md:text-[32px]' : 'md:text-[25px]'} font-bold text-neutral-900 tracking-tight leading-snug`}>
          {cardMode === 'login' && 'Đăng nhập'}
          {cardMode === 'register' && 'Đăng ký Hội viên'}
          {cardMode === 'forgot-password' && 'Khôi phục mật khẩu'}
        </h1>
        <p className={`${cardMode === 'login' ? 'mx-5' : ''} text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none`}>
          {cardMode === 'login' && 'Quản lý tài khoản, theo dõi sự kiện và tận hưởng đặc quyền độc quyền VCF'}
          {cardMode === 'register' && 'Trở thành thành viên Diễn đàn CEO Việt Nam để mở rộng cơ hội phát triển'}
          {cardMode === 'forgot-password' && 'Nhập email công tác để nhận liên kết thiết lập lại mật khẩu'}
        </p>
      </div>

      {/* Top inline error alert */}
      {errorMessage && (
        <div 
          role="alert"
          className="mb-3.5 sm:mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2 rounded-none"
        >
          <AlertCircle className="w-4 h-4 text-[#AB071E] shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">
            {errorMessage === 'EMAIL_NOT_FOUND' ? (
              <div>
                <span>Email chưa có tài khoản VCF? </span>
                <button
                  type="button"
                  onClick={() => {
                    setCardMode('register');
                    setRegEmail(email);
                    setErrorMessage('');
                  }}
                  className="text-[#AB071E] font-bold underline hover:text-[#8E0518] cursor-pointer"
                >
                  Đăng ký thành viên
                </button>
              </div>
            ) : (
              <span>{errorMessage}</span>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------
          VIEW A: FORGOT PASSWORD
         -------------------------------------------------- */}
      {cardMode === 'forgot-password' && (
        <div>
          {forgotPasswordSuccess ? (
            <div className="text-center py-3 space-y-3.5">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center rounded-none">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Hướng dẫn đặt lại mật khẩu đã được gửi đến email <strong className="text-neutral-900">{email}</strong>. Quý vị vui lòng kiểm tra hộp thư đến (và thư rác/Spam nếu chưa nhận được).
              </p>
              <button
                type="button"
                onClick={() => {
                  setCardMode('login');
                  setForgotPasswordSuccess(false);
                  setErrorMessage('');
                }}
                className="w-full h-11 sm:h-12 bg-[#AB071E] hover:bg-[#8E0518] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors rounded-none cursor-pointer flex items-center justify-center"
              >
                QUAY LẠI ĐĂNG NHẬP
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-semibold text-neutral-800 mb-1">
                  Địa chỉ Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({});
                  }}
                  placeholder="Email@gmail.com"
                  className={`w-full h-10 sm:h-12 px-3 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                    fieldErrors.email ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                  }`}
                  autoFocus
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-[#AB071E] hover:bg-[#8E0518] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ĐANG XỬ LÝ...
                  </>
                ) : (
                  'GỬI LIÊN KẾT ĐẶT LẠI MẬT KHẨU'
                )}
              </button>

              <div className="pt-1.5 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setCardMode('login');
                    setErrorMessage('');
                  }}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* --------------------------------------------------
          VIEW B: LOGIN & REGISTRATION COMMON SOCIAL BUTTONS
         -------------------------------------------------- */}
      {cardMode !== 'forgot-password' && (
        <>
          {/* Social Buttons: Google & Facebook */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-2.5 sm:mb-4">
            <button
              type="button"
              onClick={() => handleSocialAction('google')}
              disabled={isLoading}
              className="w-full h-12 px-1.5 sm:px-3 border border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center gap-1.5 sm:gap-2 rounded-none text-sm sm:text-[15px] md:text-base font-medium text-neutral-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 whitespace-nowrap min-w-0"
            >
              {socialLoadingProvider === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-600 shrink-0" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              )}
              <span className="whitespace-nowrap truncate">Tiếp tục với Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAction('facebook')}
              disabled={isLoading}
              className="w-full h-12 px-1.5 sm:px-3 border border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center gap-1.5 sm:gap-2 rounded-none text-sm sm:text-[15px] md:text-base font-medium text-neutral-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 whitespace-nowrap min-w-0"
            >
              {socialLoadingProvider === 'facebook' ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-600 shrink-0" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="12" fill="#1877F2" />
                  <path fill="#FFFFFF" d="M16.5 12h-3v8h-3.5v-8h-2v-3h2V7.2C10 5.4 11.2 4 13.7 4c1.2 0 2.3.1 2.3.1v2.8h-1.3c-1 0-1.2.5-1.2 1.2V9h3l-.5 3z" />
                </svg>
              )}
              <span className="whitespace-nowrap truncate">Tiếp tục với Facebook</span>
            </button>
          </div>

          {/* Divider "HOẶC" */}
          <div className="relative my-2.5 sm:my-4 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative bg-white px-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              HOẶC
            </span>
          </div>
        </>
      )}

      {/* --------------------------------------------------
          VIEW C: LOGIN TABS (Mật khẩu / Mã OTP)
         -------------------------------------------------- */}
      {cardMode === 'login' && (
        <>
          {/* Tabs: Mật khẩu | Mã OTP */}
          {/* NOTE: Active tab color changed from red to solid executive black/neutral-900 per user feedback */}
          <div className="grid grid-cols-2 gap-0 border border-neutral-300 mb-3 sm:mb-5 rounded-none overflow-hidden">
            <button
              type="button"
              onClick={() => handleTabSwitch('password')}
              className={`h-9 sm:h-11 text-xs sm:text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer rounded-none ${
                authTab === 'password'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/70'
              }`}
            >
              Mật khẩu
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('otp')}
              className={`h-9 sm:h-11 text-xs sm:text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer rounded-none ${
                authTab === 'otp'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/70'
              }`}
            >
              Mã OTP
            </button>
          </div>

          {/* Tab Content: Mật khẩu */}
          {authTab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-2.5 sm:space-y-3.5" noValidate>
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Địa chỉ Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="Email@gmail.com"
                  className={`w-full h-10 sm:h-11 px-3 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                    fieldErrors.email ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                  }`}
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="login-password" className="text-sm font-semibold text-neutral-800">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCardMode('forgot-password');
                      setErrorMessage('');
                    }}
                    className="text-sm font-medium text-[#AB071E] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder="••••••••"
                    className={`w-full h-10 sm:h-11 pl-3 pr-10 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                      fieldErrors.password ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                    }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 cursor-pointer p-1"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || rateLimitLocked}
                className="w-full h-11 sm:h-12 bg-[#AB071E] hover:bg-[#8E0518] text-white font-bold text-xs sm:text-sm tracking-wider transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 mt-4 sm:mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>

              <div className="pt-1.5 text-center text-sm text-neutral-600">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setCardMode('register');
                    setErrorMessage('');
                  }}
                  className="text-sm text-[#AB071E] font-bold hover:underline cursor-pointer"
                >
                  Đăng ký thành viên
                </button>
              </div>

              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-neutral-500">
                <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Thông tin đăng nhập được bảo mật</span>
              </div>
            </form>
          )}

          {/* Tab Content: Mã OTP */}
          {authTab === 'otp' && (
            <div>
              {otpStage === 'email' ? (
                /* Step A: Nhập email gửi mã */
                <form onSubmit={handleSendOtp} className="space-y-2.5 sm:space-y-3.5" noValidate>
                  <div>
                    <label htmlFor="otp-email" className="block text-xs font-semibold text-neutral-800 mb-1">
                      Địa chỉ Email
                    </label>
                    <input
                      id="otp-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({});
                      }}
                      placeholder="Email@gmail.com"
                      className={`w-full h-10 sm:h-11 px-3 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                        fieldErrors.email ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                      }`}
                      autoFocus
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.email}
                      </p>
                    )}
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                      Nhập Email đã đăng ký thành viên để nhận mã OTP đăng nhập nhanh
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 bg-[#AB071E] hover:bg-[#8E0518] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 mt-4 sm:mt-5 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ĐANG GỬI MÃ...
                      </>
                    ) : (
                      'GỬI MÃ OTP VỀ EMAIL'
                    )}
                  </button>

                  <div className="pt-1.5 text-center text-sm text-neutral-600">
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCardMode('register');
                        setErrorMessage('');
                      }}
                      className="text-sm text-[#AB071E] font-bold hover:underline cursor-pointer"
                    >
                      Đăng ký thành viên
                    </button>
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>Không chia sẻ mã OTP cho bất kỳ ai</span>
                  </div>
                </form>
              ) : (
                /* Step B: 6 Digit Inputs - Matches Mockup 2! */
                <form onSubmit={handleVerifyOtp} className="space-y-2.5 sm:space-y-3.5">
                  {/* Sent info & Change email */}
                  <div className="text-left text-xs sm:text-sm text-neutral-700 leading-snug mb-2 sm:mb-3">
                    <p className="text-neutral-500 text-xs">Mã xác thực đã gửi đến</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="text-neutral-900 font-semibold">{maskedEmailDisplay}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStage('email');
                          setErrorMessage('');
                          setOtpDigits(['', '', '', '', '', '']);
                        }}
                        className="text-[#AB071E] underline font-medium hover:text-[#8E0518] cursor-pointer text-xs"
                      >
                        Đổi email
                      </button>
                    </div>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div>
                    <div 
                      className="grid grid-cols-6 gap-1.5 sm:gap-2.5 max-w-full justify-center"
                      onPaste={handleDigitPaste}
                    >
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputsRef.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(index, e)}
                          aria-label={`Số thứ ${index + 1} của mã OTP`}
                          className={`w-full aspect-square max-h-11 sm:max-h-12 border text-center text-base sm:text-xl font-bold text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors ${
                            digit ? 'border-neutral-900 bg-white' : 'border-neutral-300 bg-white'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-1.5 sm:mt-2">
                      Mã có hiệu lực trong {Math.ceil(otpRemainingValidity / 60)} phút
                    </p>
                  </div>

                  {/* Primary CTA: XÁC NHẬN VÀ ĐĂNG NHẬP */}
                  <button
                    type="submit"
                    disabled={isLoading || otpDigits.join('').length < 6 || rateLimitLocked}
                    className="w-full h-11 sm:h-12 bg-[#AB071E] hover:bg-[#8E0518] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 mt-3 sm:mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ĐANG XÁC THỰC...
                      </>
                    ) : (
                      'XÁC NHẬN VÀ ĐĂNG NHẬP'
                    )}
                  </button>

                  {/* Resend timer row */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-neutral-600">
                      Gửi lại mã sau <strong className="text-neutral-900 font-semibold">{formatTime(otpTimerSeconds)}</strong>
                    </span>
                    <button
                      type="button"
                      disabled={otpTimerSeconds > 0}
                      onClick={handleResendOtp}
                      className={`font-medium underline cursor-pointer ${
                        otpTimerSeconds > 0
                          ? 'text-neutral-400 cursor-not-allowed no-underline'
                          : 'text-[#AB071E] hover:text-[#8E0518]'
                      }`}
                    >
                      Gửi lại mã
                    </button>
                  </div>

                  <div className="pt-2 text-center text-xs text-neutral-600 border-t border-neutral-100 mt-2.5">
                    Email chưa có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCardMode('register');
                        setErrorMessage('');
                      }}
                      className="text-[#AB071E] font-medium hover:underline cursor-pointer"
                    >
                      Đăng ký thành viên
                    </button>
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>Không chia sẻ mã OTP cho bất kỳ ai</span>
                  </div>
                </form>
              )}
            </div>
          )}
        </>
      )}

      {/* --------------------------------------------------
          VIEW D: REGISTRATION FORM
         -------------------------------------------------- */}
      {cardMode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-2.5 sm:space-y-3" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullname" className="block text-xs font-semibold text-neutral-800 mb-0.5">
              Họ và tên của bạn <span className="text-[#AB071E]">*</span>
            </label>
            <input
              id="reg-fullname"
              type="text"
              value={regFullName}
              onChange={(e) => {
                setRegFullName(e.target.value);
                if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
              }}
              placeholder="Nguyễn Văn A"
              className={`w-full h-10 sm:h-11 px-3 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                fieldErrors.fullName ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
              }`}
            />
            {fieldErrors.fullName && (
              <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-neutral-800 mb-0.5">
              Email công tác <span className="text-[#AB071E]">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              value={regEmail}
              onChange={(e) => {
                setRegEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="ten@doanhnghiep.vn"
              className={`w-full h-10 sm:h-11 px-3 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                fieldErrors.email ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
              }`}
            />
            {fieldErrors.email && (
              <div className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {fieldErrors.email === 'EMAIL_ALREADY_EXISTS' ? (
                  <span>
                    Email này đã có tài khoản.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCardMode('login');
                        setEmail(regEmail);
                        setErrorMessage('');
                      }}
                      className="font-bold underline text-[#AB071E]"
                    >
                      Đăng nhập ngay
                    </button>
                  </span>
                ) : (
                  <span>{fieldErrors.email}</span>
                )}
              </div>
            )}
          </div>

          {/* Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label htmlFor="reg-company" className="block text-xs font-semibold text-neutral-800 mb-0.5">
                Doanh nghiệp / Tổ chức
              </label>
              <input
                id="reg-company"
                type="text"
                value={regCompany}
                onChange={(e) => {
                  setRegCompany(e.target.value);
                }}
                placeholder="Tập đoàn ABC"
                className="w-full h-10 sm:h-11 px-3 border border-neutral-300 text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label htmlFor="reg-jobtitle" className="block text-xs font-semibold text-neutral-800 mb-0.5">
                Chức danh / Chức vụ
              </label>
              <input
                id="reg-jobtitle"
                type="text"
                value={regJobTitle}
                onChange={(e) => setRegJobTitle(e.target.value)}
                placeholder="Tổng Giám Đốc (CEO)"
                className="w-full h-10 sm:h-11 px-3 border border-neutral-300 text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-neutral-800 mb-0.5">
                Mật khẩu (≥ 8 ký tự) <span className="text-[#AB071E]">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`w-full h-10 sm:h-11 pl-3 pr-8 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                    fieldErrors.password ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-600 mt-0.5">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-semibold text-neutral-800 mb-0.5">
                Xác nhận mật khẩu <span className="text-[#AB071E]">*</span>
              </label>
              <input
                id="reg-confirm"
                type={showRegPassword ? 'text' : 'password'}
                value={regConfirmPassword}
                onChange={(e) => {
                  setRegConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="••••••••"
                className={`w-full h-10 sm:h-11 px-3 border text-xs sm:text-sm text-neutral-900 rounded-none focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                  fieldErrors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-0.5">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-0.5">
            <label className="flex items-start gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={regAgreeTerms}
                onChange={(e) => {
                  setRegAgreeTerms(e.target.checked);
                  if (fieldErrors.terms) setFieldErrors(prev => ({ ...prev, terms: '' }));
                }}
                className="mt-0.5 rounded-none accent-neutral-900 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="leading-snug text-[11px] sm:text-xs">
                Tôi đồng ý với Điều lệ Hội viên & Quy chế bảo mật Diễn đàn CEO Việt Nam (VCF)
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="text-[11px] text-red-600 mt-0.5">{fieldErrors.terms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 sm:h-12 bg-[#AB071E] hover:bg-[#8E0518] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 mt-3 sm:mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ĐANG XỬ LÝ HỒ SƠ...
              </>
            ) : (
              'HOÀN TẤT ĐĂNG KÝ HỘI VIÊN'
            )}
          </button>

          <div className="pt-1.5 text-center text-xs text-neutral-600">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={() => {
                setCardMode('login');
                setErrorMessage('');
              }}
              className="text-[#AB071E] font-bold hover:underline cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </div>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span>Thông tin đăng ký được bảo mật theo tiêu chuẩn VCF</span>
          </div>
        </form>
      )}
    </div>
  );
};
