import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { CustomButton } from '../common/CustomButton';
import { SpecBadge } from '../wireframe/SpecBadge';
import { 
  UserCheck, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const MemberRegistrationPage: React.FC = () => {
  const { 
    navigateTo, 
    showSpecAnnotations, 
    showNotification, 
    signupLite, 
    verifyEmailAndActivate,
    pendingAction,
    clearPendingAction
  } = useApp();

  // Lite form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);

  // OTP Email Verification State
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('892601');
  const [countdown, setCountdown] = useState(60);
  const [otpError, setOtpError] = useState('');

  // States: S-EMPTY-FORM, S-VALIDATION-ERROR, S-SUBMITTING, S-EMAIL-VERIFY-SENT, S-SUCCESS, S-SPAM-BLOCKED
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [signupState, setSignupState] = useState<
    'idle' | 'submitting' | 'email-verify-sent' | 'success'
  >('idle');

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (signupState === 'email-verify-sent' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signupState, countdown]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Vui lòng nhập Họ và tên của bạn';
    if (!email.trim() || !email.includes('@')) errs.email = 'Vui lòng nhập Email công tác hợp lệ';
    if (!password || password.length < 8) errs.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    if (password !== confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    if (!captchaChecked) errs.captcha = 'Vui lòng tích xác nhận mã bảo mật / chống spam';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSocialSignup = (provider: 'google' | 'facebook') => {
    signupLite(provider, {
      fullName: provider === 'google' ? 'Đại biểu Google Member' : 'Đại biểu Facebook Member',
      email: provider === 'google' ? 'member.google@vcf.org.vn' : 'member.fb@vcf.org.vn'
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showNotification('Vui lòng kiểm tra lại các trường thông tin báo lỗi đỏ!');
      return;
    }

    setSignupState('submitting');
    setTimeout(() => {
      // Step B: Gửi mã OTP xác thực qua email
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoOtp(randomOtp);
      setOtpCode('');
      setCountdown(60);
      setSignupState('email-verify-sent');
      showNotification(`Mã xác thực OTP [${randomOtp}] đã được gửi tới email ${email}!`);
    }, 800);
  };

  const handleResendOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(randomOtp);
    setCountdown(60);
    showNotification(`Đã gửi lại mã OTP mới [${randomOtp}] tới email ${email}!`);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setOtpError('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số');
      return;
    }

    setOtpError('');
    verifyEmailAndActivate({
      fullName,
      email
    });
    setSignupState('success');
    showNotification('Xác thực OTP thành công! Chào mừng bạn gia nhập Diễn đàn CEO Việt Nam.');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8 font-sans">
      <Breadcrumb items={[{ label: 'Đăng ký thành viên' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="03-dang-ky-thanh-vien: LITE SIGNUP" type="page" />
            <SpecBadge label="Không có OTP • Không hỏi chức danh/công ty lúc này" type="source" />
          </div>
          <span className="text-neutral-500">
            States: S-EMPTY-FORM, S-EMAIL-VERIFY-SENT, S-SUCCESS
          </span>
        </div>
      )}

      {/* Notice if gated from pending action */}
      {pendingAction && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#eb1000] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-black">
                {pendingAction.type === 'register-event' 
                  ? 'Đăng ký tài khoản nhanh để hoàn tất tham dự sự kiện' 
                  : 'Đăng ký tài khoản nhanh để nhận tư vấn chương trình'}
              </p>
              <p className="text-neutral-600 mt-0.5">
                Hệ thống đã ghi nhớ hành động của bạn và sẽ tự động tiếp tục ngay sau khi tạo tài khoản.
              </p>
            </div>
          </div>
          <button 
            onClick={clearPendingAction}
            className="text-neutral-400 hover:text-neutral-600 text-[11px] underline shrink-0"
          >
            Hủy thao tác cũ
          </button>
        </div>
      )}

      {/* SUCCESS CONFIRMATION STATE */}
      {signupState === 'success' ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center space-y-6 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black tracking-tight">
              Tài khoản VCF đã được kích hoạt thành công!
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Chào mừng <strong>{fullName || 'Quý Hội viên'}</strong> gia nhập Diễn đàn CEO Việt Nam. Bạn đang ở trạng thái <strong>Hội viên cơ bản (Lite Member)</strong>.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-600 max-w-md mx-auto text-left space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-black">
              <span className="w-2 h-2 rounded-full bg-[#eb1000]" />
              Tiếp theo:
            </div>
            <p>• Bạn có thể đăng ký vé tham dự các sự kiện và theo dõi tài liệu.</p>
            <p>• Khi đăng ký sự kiện cụ thể, bạn có thể hoàn thiện thêm hồ sơ doanh nghiệp bất cứ lúc nào.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <CustomButton
              variant="primary"
              size="lg"
              onClick={() => navigateTo('events')}
            >
              Khám phá Lịch sự kiện sắp tới →
            </CustomButton>
            <CustomButton
              variant="secondary"
              size="lg"
              onClick={() => navigateTo('profile')}
            >
              Xem Hồ sơ cá nhân
            </CustomButton>
          </div>
        </div>
      ) : signupState === 'email-verify-sent' ? (
        /* EMAIL OTP VERIFICATION STATE */
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-sm animate-fadeIn max-w-lg mx-auto">
          <div className="w-16 h-16 bg-red-50 text-[#eb1000] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#eb1000] bg-red-50 px-3 py-1 rounded-full border border-red-200">
              XÁC THỰC EMAIL BẰNG MÃ OTP
            </span>
            <h2 className="text-2xl font-black text-black tracking-tight pt-1">
              Nhập mã OTP xác thực
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Hệ thống đã gửi mã OTP xác thực gồm 6 chữ số tới địa chỉ email <strong className="text-black">{email}</strong>.
            </p>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            {/* Quick Demo OTP helper */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-2 text-xs">
              <span className="text-neutral-600">
                Mã OTP thử nghiệm: <strong className="text-[#eb1000] font-mono font-black text-sm">{demoOtp}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setOtpCode(demoOtp);
                  setOtpError('');
                }}
                className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors shadow-2xs"
              >
                Điền nhanh mã OTP
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Nhập mã OTP 6 số: <span className="text-[#eb1000]">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  setOtpError('');
                }}
                placeholder="VD: 892601"
                className="w-full py-3.5 px-4 text-center font-mono text-2xl tracking-[0.3em] font-black border border-neutral-300 rounded-xl focus:outline-none focus:border-[#eb1000] bg-white transition-colors"
                autoFocus
              />
              {otpError && <p className="text-xs text-red-600 mt-1.5 font-medium">{otpError}</p>}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              {countdown > 0 ? (
                <span>Gửi lại mã sau <strong className="text-neutral-800">{countdown}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#eb1000] font-bold hover:underline cursor-pointer"
                >
                  Gửi lại mã OTP qua email
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSignupState('idle');
                  setOtpCode('');
                }}
                className="hover:underline text-neutral-600 cursor-pointer"
              >
                ← Thay đổi địa chỉ email
              </button>
            </div>

            <CustomButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center py-3.5 text-sm font-black uppercase tracking-wide shadow-md"
            >
              Xác thực OTP & Kích hoạt tài khoản →
            </CustomButton>
          </form>
        </div>
      ) : (
        /* MAIN LITE SIGNUP CARD */
        <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* Header & Value Proposition */}
          <div className="text-center space-y-2 border-b border-neutral-100 pb-6">
            <div className="w-12 h-12 bg-red-50 text-[#eb1000] rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Đăng ký thành viên VCF
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
              Gia nhập mạng lưới lãnh đạo doanh nghiệp hàng đầu Việt Nam. Khởi tạo tài khoản nhanh chóng chỉ trong 30 giây.
            </p>
          </div>

          {/* 1. SOCIAL SIGNUP OPTIONS (Ngang hàng) */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignup('google')}
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-neutral-200 rounded-full hover:bg-neutral-50 hover:border-neutral-300 font-semibold text-xs text-neutral-700 transition-all shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Đăng ký với Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignup('facebook')}
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-neutral-200 rounded-full hover:bg-neutral-50 hover:border-neutral-300 font-semibold text-xs text-neutral-700 transition-all shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Đăng ký với Facebook</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider absolute">
                Hoặc đăng ký bằng Email
              </span>
            </div>
          </div>

          {/* 2. EMAIL FORM */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                Họ và tên của bạn <span className="text-[#eb1000]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn An"
                className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000] transition-colors ${
                  errors.fullName ? 'border-red-500 bg-red-50/40' : 'border-neutral-200'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email công tác */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                Email công tác <span className="text-[#eb1000]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="an.nguyen@company.com"
                className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000] transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50/40' : 'border-neutral-200'
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Mật khẩu & Xác nhận */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  Mật khẩu <span className="text-[#eb1000]">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000] transition-colors ${
                    errors.password ? 'border-red-500 bg-red-50/40' : 'border-neutral-200'
                  }`}
                />
                {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  Xác nhận mật khẩu <span className="text-[#eb1000]">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000] transition-colors ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50/40' : 'border-neutral-200'
                  }`}
                />
                {errors.confirmPassword && <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Anti-spam CAPTCHA checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200 bg-neutral-50/60 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={captchaChecked}
                  onChange={e => setCaptchaChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-[#eb1000] focus:ring-[#eb1000]"
                />
                <ShieldCheck className="w-4 h-4 text-neutral-500" />
                <span>Tôi không phải là người máy (Xác thực bảo mật chống spam)</span>
              </label>
              {errors.captcha && <p className="text-[11px] text-red-600 mt-1">{errors.captcha}</p>}
            </div>

            {/* Note on Progressive Profile */}
            <div className="p-3 bg-neutral-50 rounded-lg text-[11px] text-neutral-500 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
              <span>
                Thông tin doanh nghiệp (Chức danh, Quy mô, Vấn đề cần tư vấn) sẽ được bổ sung tự nhiên khi bạn đăng ký sự kiện hoặc khoá đào tạo.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={signupState === 'submitting'}
                className="w-full justify-center py-3.5 text-sm"
              >
                {signupState === 'submitting' ? 'Đang tạo tài khoản...' : 'Tạo tài khoản thành viên VCF →'}
              </CustomButton>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t border-neutral-100 text-xs text-neutral-600">
            <span>Bạn đã có tài khoản thành viên? </span>
            <button
              onClick={() => navigateTo('login')}
              className="text-[#eb1000] font-bold hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
