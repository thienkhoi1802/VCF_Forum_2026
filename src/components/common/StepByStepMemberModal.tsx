import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Send,
  Eye,
  EyeOff,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  KeyRound,
  LogIn,
  HelpCircle,
  UserPlus,
  UserCheck,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const JOB_TITLE_OPTIONS = [
  'Tổng Giám Đốc (CEO)',
  'Chủ tịch HĐQT / Hội đồng thành viên',
  'Phó Tổng Giám Đốc (Deputy CEO / Phó Chủ tịch)',
  'Giám đốc Điều hành (COO)',
  'Giám đốc Tài chính (CFO)',
  'Giám đốc Công nghệ / Chuyển đổi số (CTO / CDO)',
  'Giám đốc Marketing / Kinh doanh (CMO / CCO)',
  'Thành viên HĐQT / Ban Cố vấn chiến lược',
  'Chủ doanh nghiệp / Sáng lập viên (Founder / Co-founder)',
  'Giám đốc Khối / Giám đốc chi nhánh',
  'Khác (Lãnh đạo cấp cao)'
];

interface StepByStepMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile, details?: any) => void;
  onSwitchToLogin?: () => void;
  eventTitle?: string;
  eventId?: string;
  eventDatetime?: string;
  eventLocation?: string;
  eventActivityName?: string;
  isWaitlist?: boolean;
}

export const StepByStepMemberModal: React.FC<StepByStepMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
  eventTitle = 'CEO Summit 2026: Định hình Vị thế Doanh nghiệp Việt trong Kỷ nguyên AI & Chuyển đổi Xanh',
  eventId = 'event-summit-2026',
  eventDatetime = '08:00 - 17:30, Thứ Năm 15/10/2026',
  eventLocation = 'Khách sạn JW Marriott, Số 8 Đỗ Đức Dục, Nam Từ Liêm, Hà Nội',
  eventActivityName = 'CEO Summit',
  isWaitlist = false
}) => {
  const { 
    currentUser, 
    loginWithAccount,
    registerMember, 
    registerForEventWithDetails, 
    checkEmailExistsInSystem,
    showNotification,
    navigateTo,
    registeredEvents
  } = useApp();

  // Steps:
  // 1: Thông tin đại biểu & Liên hệ (KHÔNG hỏi email/mật khẩu)
  // 2: Thông tin doanh nghiệp
  // 3: Quan tâm & Kết nối
  // 4: Đối thoại chuyên gia & Vấn đề doanh nghiệp
  // 5: Xác thực tài khoản / Email (chỉ khi user CHƯA đăng nhập; SKIP nếu ĐÃ đăng nhập)
  // 6: Thông báo: "Đã đăng ký thành công, BTC sẽ liên hệ lại" (PENDING_APPROVAL / WAITLISTED)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [regCode, setRegCode] = useState(`VCF-REG-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Section 5.4: Tùy chọn cập nhật ngược vào User Profile gốc (mặc định false / UNCHECKED)
  const [updateBaseProfile, setUpdateBaseProfile] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Bước 1: Thông tin đại biểu & Liên hệ (Họ tên, SĐT, Chức danh điều hành)
    fullName: '',
    phone: '',
    jobTitle: '',
    // Bước 2: Thông tin doanh nghiệp
    companyName: '',
    taxId: '',
    industry: 'Sản xuất & Công nghiệp chế tạo',
    companySize: '',
    // Bước 3: Quan tâm & Kết nối
    interestedActivities: ['ceo-summit', 'ceo-forum'],
    leadSource: 'Giới thiệu từ Hội viên VCF',
    // Bước 4: Đối thoại chuyên gia & Vấn đề doanh nghiệp
    businessPainPoints: '',
    questionForMentor: '',
    agreedToTerms: true,
    // Bước 5 (Chỉ hỏi cho user chưa đăng nhập): Email & Mật khẩu
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Step 5 specific state for existing user check
  const [emailChecked, setEmailChecked] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [existingUserPassword, setExistingUserPassword] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 5.1 Kiểm tra lần đầu đăng ký hay đã từng đăng ký để autofill
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setForgotPasswordMessage(null);
      setEmailChecked(false);
      setUserExists(false);
      setExistingUserPassword('');
      setUpdateBaseProfile(false);
      setRegCode(`VCF-REG-${Math.floor(100000 + Math.random() * 900000)}`);

      if (currentUser) {
        // [Yêu cầu người dùng]: User đã login tài khoản -> Tự động fill ĐỦ thông tin của 4 bước, không cần nhập mật khẩu
        const prevEvent = registeredEvents?.find(
          r => r.details && (r.details.jobTitle || r.details.companyName || r.details.phone || r.details.industry)
        );
        const prevDet = prevEvent?.details;

        setFormData({
          fullName: currentUser.fullName || prevDet?.name || prevDet?.fullName || 'Phạm Minh Đức',
          phone: currentUser.phone || prevDet?.phone || '0912 345 678',
          jobTitle: currentUser.jobTitle || prevDet?.jobTitle || 'Tổng Giám Đốc (CEO)',
          companyName: currentUser.companyName || prevDet?.companyName || 'Công ty Cổ phần Thép VinaSteel',
          taxId: currentUser.taxId || prevDet?.taxId || '0101234567',
          industry: currentUser.industry || prevDet?.industry || 'Sản xuất & Công nghiệp chế tạo',
          companySize: currentUser.companySize || prevDet?.companySize || 'Từ 100 - 300 nhân sự',
          interestedActivities: (Array.isArray(currentUser.interestedActivities) && currentUser.interestedActivities.length > 0)
            ? (currentUser.interestedActivities as string[])
            : (prevDet?.interestedActivities as string[]) || ['ceo-summit', 'ceo-forum', 'ceo-talk'],
          leadSource: currentUser.leadSource || prevDet?.leadSource || 'Giới thiệu từ Hội viên VCF',
          businessPainPoints: currentUser.businessPainPoints || prevDet?.businessPainPoints || 'Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng.',
          questionForMentor: currentUser.questionForMentor || prevDet?.questionForMentor || 'Làm thế nào để duy trì động lực đổi mới sáng tạo trong doanh nghiệp sản xuất truyền thống?',
          agreedToTerms: true,
          email: currentUser.email || prevDet?.email || 'duc.pham@vinasteel.com.vn',
          password: '',
          confirmPassword: ''
        });
      } else {
        // User CHƯA đăng nhập: Form trống hoàn toàn, KHÔNG hỏi email/mật khẩu ở bước 1-4
        setFormData({
          fullName: '',
          phone: '',
          jobTitle: '',
          companyName: '',
          taxId: '',
          industry: 'Sản xuất & Công nghiệp chế tạo',
          companySize: '',
          interestedActivities: ['ceo-summit', 'ceo-forum'],
          leadSource: 'Giới thiệu từ Hội viên VCF',
          businessPainPoints: '',
          questionForMentor: '',
          agreedToTerms: true,
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    }
  }, [isOpen, currentUser, registeredEvents]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (field === 'email') {
      setEmailChecked(false);
      setUserExists(false);
      setForgotPasswordMessage(null);
    }
  };

  const toggleInterestedActivity = (actId: string) => {
    setFormData(prev => {
      const exists = prev.interestedActivities.includes(actId);
      const nextList = exists
        ? prev.interestedActivities.filter(id => id !== actId)
        : [...prev.interestedActivities, actId];
      return { ...prev, interestedActivities: nextList };
    });
    if (errors.interestedActivities) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.interestedActivities;
        return next;
      });
    }
  };

  // Rule: disable nút "Tiếp tục" nếu bước hiện tại chưa validate đủ field bắt buộc
  const isStep1Valid = Boolean(
    formData.fullName.trim() && 
    formData.phone.trim() && 
    formData.jobTitle.trim()
  );

  const isStep2Valid = Boolean(
    formData.companyName.trim() && 
    formData.industry.trim() && 
    formData.companySize.trim()
  );

  const isStep3Valid = Boolean(
    formData.interestedActivities && 
    formData.interestedActivities.length > 0 && 
    formData.leadSource.trim()
  );

  const isStep4Valid = Boolean(
    formData.businessPainPoints.trim() && 
    formData.questionForMentor.trim() && 
    formData.agreedToTerms
  );

  // Section 2.2: User đã từng đăng ký hoặc đang là user đã đăng nhập -> Có dữ liệu đầy đủ 4 bước
  const hasPriorRegistrations = Boolean(currentUser);
  const isAllStepsValid = Boolean(isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid);

  // Section 2.2: Bấm "Hoàn tất đăng ký sự kiện" ngay ở bất kỳ bước nào nếu đã có đủ thông tin
  const handleQuickComplete = () => {
    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) return;
    if (currentUser) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        completeEventRegistration(currentUser);
        setCurrentStep(6);
      }, 400);
    }
  };

  // Validation Màn 1: Thông tin đại biểu & Liên hệ (KHÔNG hỏi email/mật khẩu)
  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên đại biểu';
    if (!formData.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại liên hệ';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Vui lòng chọn hoặc nhập chức danh điều hành';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation Màn 2: Thông tin doanh nghiệp
  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.companyName.trim()) errs.companyName = 'Vui lòng nhập tên doanh nghiệp / tổ chức';
    if (!formData.industry.trim()) errs.industry = 'Vui lòng chọn lĩnh vực hoạt động';
    if (!formData.companySize.trim()) errs.companySize = 'Vui lòng chọn quy mô doanh nghiệp';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation Màn 3: Quan tâm & Kết nối
  const validateStep3 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.interestedActivities || formData.interestedActivities.length === 0) {
      errs.interestedActivities = 'Vui lòng chọn ít nhất 1 hoạt động VCF quan tâm';
    }
    if (!formData.leadSource.trim()) errs.leadSource = 'Vui lòng chọn nguồn biết đến VCF';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation Màn 4: Đối thoại chuyên gia & Vấn đề doanh nghiệp
  const validateStep4 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.businessPainPoints.trim()) {
      errs.businessPainPoints = 'Vui lòng mô tả vấn đề doanh nghiệp đang đối mặt';
    }
    if (!formData.questionForMentor.trim()) {
      errs.questionForMentor = 'Vui lòng nhập câu hỏi cho Diễn giả / Mentor cố vấn';
    }
    if (!formData.agreedToTerms) {
      errs.terms = 'Vui lòng xác nhận cam kết thông tin và quy chế VCF';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 5: Check email exists
  const handleEmailCheck = () => {
    const emailToTest = formData.email.trim();
    if (!emailToTest || !emailToTest.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Vui lòng nhập địa chỉ email hợp lệ (có chứa @)' }));
      return;
    }
    const exists = checkEmailExistsInSystem(emailToTest);
    setUserExists(exists);
    setEmailChecked(true);
    setErrors(prev => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
    if (exists) {
      showNotification('Đã nhận diện: Email đã tồn tại trong hệ thống (Trường hợp A).');
    } else {
      showNotification('Đã nhận diện: Email chưa tồn tại trong hệ thống (Trường hợp B).');
    }
  };

  // Tự động kiểm tra tách nhánh khi người dùng gõ email hợp lệ
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = formData.email.trim();
    if (trimmed.includes('@') && trimmed.split('@')[1]?.includes('.')) {
      const exists = checkEmailExistsInSystem(trimmed);
      setUserExists(exists);
      setEmailChecked(true);
      setErrors(prev => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    } else if (!trimmed) {
      setEmailChecked(false);
      setUserExists(false);
    }
  }, [isOpen, formData.email, checkEmailExistsInSystem]);

  // Validation Step 5: Mật khẩu
  const isStep5NewUserValid = Boolean(
    formData.email.trim() &&
    formData.email.includes('@') &&
    formData.password.length >= 6 &&
    formData.confirmPassword.length >= 6 &&
    formData.password === formData.confirmPassword
  );

  const isStep5ExistingUserValid = Boolean(
    formData.email.trim() &&
    formData.email.includes('@') &&
    existingUserPassword.length >= 6
  );

  // Xử lý chuyển bước
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 4) setCurrentStep(3);
    else if (currentStep === 5) setCurrentStep(4);
  };

  // Hoàn tất gửi đăng ký sự kiện vào hệ thống (Mục 6 - Tạo Registration record)
  const completeEventRegistration = (user: UserProfile, targetEmail?: string) => {
    const finalEmail = targetEmail || user.email || formData.email;

    const regDetails = {
      name: formData.fullName,
      fullName: formData.fullName,
      email: finalEmail,
      phone: formData.phone,
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      industry: formData.industry,
      companySize: formData.companySize,
      interestedActivities: formData.interestedActivities,
      leadSource: formData.leadSource,
      businessPainPoints: formData.businessPainPoints,
      questionForMentor: formData.questionForMentor,
      submittedAt: new Date().toISOString()
    };

    registerForEventWithDetails({
      eventId,
      eventTitle,
      activityName: eventActivityName,
      datetime: eventDatetime,
      location: eventLocation,
      isWaitlist,
      passType: 'member',
      updateUserProfile: updateBaseProfile, // Section 5.4: mặc định false, không ghi đè profile gốc
      details: regDetails
    });

    if (onSuccess) {
      onSuccess(user, regDetails);
    }
  };

  // Case 2: User ĐÃ đăng nhập -> Bấm "Hoàn tất" ở bước 4
  const handleSubmitScreen4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    if (currentUser) {
      // Case 2 [5.2]: SKIP toàn bộ bước email/mật khẩu, tạo Registration record & kích hoạt Popup
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        completeEventRegistration(currentUser);
        onClose();
      }, 400);
    } else {
      // Case 1: Chưa đăng nhập -> sang [Bước 5] Nhập email & xác thực tài khoản
      setCurrentStep(5);
    }
  };

  // Case 1 [Bước 5]: User nhập email & xác thực -> Tạo/login user -> Kích hoạt Popup
  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrors({ email: 'Vui lòng nhập địa chỉ email hợp lệ' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (userExists) {
        // (a) Đăng nhập tài khoản đã có sẵn
        loginWithAccount(formData.email, formData.fullName, formData.companyName);
        const loggedUser: UserProfile = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          membershipStatus: 'approved',
          memberId: `VCF-MBR-${Date.now().toString().slice(-4)}`,
          joinedDate: new Date().toLocaleDateString('vi-VN'),
          interestedActivities: ['ceo-summit', 'ceo-forum'],
          isProfileComplete: true
        };
        completeEventRegistration(loggedUser, formData.email);
        onClose();
      } else {
        // (b) Tạo User mới (user_id, email, password_hash) + auto-login
        if (formData.password.length < 6) {
          setErrors({ password: 'Mật khẩu phải có tối thiểu 6 ký tự' });
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: 'Mật khẩu xác nhận không trùng khớp' });
          return;
        }

        const newUser = registerMember({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          leadSource: formData.leadSource,
          businessPainPoints: formData.businessPainPoints,
          questionForMentor: formData.questionForMentor,
          membershipStatus: 'pending'
        });

        completeEventRegistration(newUser, formData.email);
        onClose();
      }
    }, 400);
  };

  // Demo Social Login tại Bước 5
  const handleSocialAuthAtStep5 = (provider: 'google' | 'linkedin') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const socialEmail = formData.email || `ceo.${provider}@enterprise.vn`;
      loginWithAccount(socialEmail, formData.fullName || 'Đại biểu C-Level', formData.companyName);
      
      const loggedUser: UserProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        fullName: formData.fullName || 'Đại biểu Hội viên VCF',
        email: socialEmail,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        membershipStatus: 'approved',
        memberId: `VCF-MBR-${Date.now().toString().slice(-4)}`,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        interestedActivities: ['ceo-summit', 'ceo-forum'],
        isProfileComplete: true
      };

      completeEventRegistration(loggedUser, socialEmail);
      onClose();
      showNotification(`Xác thực thành công qua ${provider === 'google' ? 'Google Workspace' : 'LinkedIn Business'}!`);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* =========================================================================
            MODAL HEADER
            ========================================================================= */}
        <div className="bg-neutral-900 px-5 sm:px-6 py-4 text-white relative">
          <div className="flex items-center justify-between gap-3 mb-1 pr-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#eb1000] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {isWaitlist ? 'Hàng chờ (Waitlist)' : 'Hội Viên VCF'}
              </span>
              <span className="text-neutral-400 text-xs font-mono">
                {currentStep === 6 ? 'Trạng Thái Tiếp Nhận' : isWaitlist ? 'Đăng Ký Danh Sách Chờ' : 'Quy Trình Đăng Ký Sự Kiện'}
              </span>
            </div>

            {currentStep === 6 && (
              <span className="bg-[#eb5a00] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                {isWaitlist ? 'HÀNG CHỜ (WAITLIST)' : 'ĐANG CHỜ DUYỆT'}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-base sm:text-lg font-black text-white leading-snug flex items-center gap-2">
            {currentStep === 6 ? (
              <>
                <UserCheck className="w-5 h-5 text-[#eb1000] shrink-0" />
                <span>Tình Trạng Hồ Sơ Đăng Ký</span>
              </>
            ) : isWaitlist ? (
              'Đăng ký vào Danh Sách Chờ (Waitlist)'
            ) : (
              'Đăng Ký Tham Dự Sự Kiện'
            )}
          </h2>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed truncate">
            {currentStep === 6 
              ? 'Yêu cầu tham dự đang được Ban Thư ký VCF xem xét và thẩm định' 
              : eventTitle}
          </p>

          {/* Stepper Progress Bar (Chỉ hiển thị cho các bước điền thông tin) */}
          {currentStep <= 5 && (
            <div className={`grid ${currentUser ? 'grid-cols-4' : 'grid-cols-5'} gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-neutral-800`}>
              {[
                { step: 1, label: 'Đại biểu' },
                { step: 2, label: 'Doanh nghiệp' },
                { step: 3, label: 'Quan tâm' },
                { step: 4, label: 'Chuyên gia' },
                ...(!currentUser ? [{ step: 5, label: 'Hoàn tất' }] : [])
              ].map(item => {
                const isPassed = currentStep > item.step;
                const isCurrent = currentStep === item.step;
                return (
                  <div key={item.step} className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-all ${
                        isPassed 
                          ? 'bg-emerald-500 text-white' 
                          : isCurrent 
                          ? 'bg-[#eb1000] text-white ring-2 ring-red-300' 
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {isPassed ? <Check className="w-3 h-3" /> : item.step}
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold truncate max-w-[65px] ${
                      isCurrent ? 'text-white' : isPassed ? 'text-emerald-400' : 'text-neutral-400'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================================
            MODAL BODY
            ========================================================================= */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">

          {/* =====================================================================
              MÀN 1: THÔNG TIN ĐẠI BIỂU & LIÊN HỆ
              Rule: KHÔNG hỏi email/mật khẩu ở giai đoạn này.
              Rule: disable nút "Tiếp tục" nếu chưa validate đủ field bắt buộc.
              ===================================================================== */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase text-neutral-900 tracking-tight">
                    Thông Tin Đại Biểu & Liên Hệ
                  </h3>
                </div>
                <span className="text-xs text-neutral-500 font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded">
                  Bước 1 / {currentUser ? '4' : '5'}
                </span>
              </div>

              {/* Notice khi ĐÃ đăng nhập */}
              {currentUser && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5 justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>Đại biểu Hội viên: {currentUser.fullName}</span>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-800 font-mono px-1.5 py-0.2 rounded font-bold">
                          {hasPriorRegistrations ? 'Điền tự động từ sự kiện trước' : 'Autofill'}
                        </span>
                      </div>
                      {hasPriorRegistrations && isAllStepsValid && (
                        <button
                          type="button"
                          onClick={handleQuickComplete}
                          className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          Hoàn tất ngay →
                        </button>
                      )}
                    </div>
                    <p className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                      {hasPriorRegistrations 
                        ? 'Tất cả thông tin 4 bước đã được tự động điền lại từ sự kiện gần nhất. Quý vị có thể để nguyên và bấm "Hoàn tất đăng ký sự kiện" ngay ở bất kỳ bước nào, hoặc chỉnh sửa nếu có thay đổi.'
                        : 'Thông tin đã được điền sẵn. Quý vị có thể điều chỉnh bất kỳ trường nào độc lập. Đăng ký sẽ được gửi trực tiếp mà không cần bước tạo tài khoản.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Họ và tên đại biểu * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Họ và tên đại biểu *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email nhận vé & thông báo */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Email nhận vé & thông báo {currentUser ? '*' : '(Tùy chọn)'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="VD: ceo@vinasteel.com.vn"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  />
                  {currentUser && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã liên kết với tài khoản Hội viên: <strong>{currentUser.email}</strong></span>
                    </p>
                  )}
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Số điện thoại liên hệ * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Số điện thoại liên hệ (Di động / Zalo) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="VD: 0912 345 678"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Chức danh điều hành * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Chức danh điều hành (C-Level / Ban Lãnh đạo) *
                  </label>
                  <select
                    value={formData.jobTitle}
                    onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.jobTitle ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  >
                    <option value="">-- Chọn chức danh điều hành --</option>
                    {formData.jobTitle && !JOB_TITLE_OPTIONS.includes(formData.jobTitle) && (
                      <option value={formData.jobTitle}>{formData.jobTitle}</option>
                    )}
                    {JOB_TITLE_OPTIONS.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  {errors.jobTitle && <p className="text-[11px] text-red-600 mt-1">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                {!currentUser && onSwitchToLogin ? (
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-xs font-semibold text-neutral-600 hover:text-[#eb1000] underline cursor-pointer"
                  >
                    Đã có tài khoản Hội viên? Đăng nhập
                  </button>
                ) : (
                  <div />
                )}

                {hasPriorRegistrations && isAllStepsValid ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={handleQuickComplete}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Hoàn tất đăng ký ngay</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStep1Valid}
                      className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Tiếp tục Bước 2</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep1Valid}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
                  >
                    <span>Tiếp tục Bước 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              MÀN 2: THÔNG TIN DOANH NGHIỆP
              Rule: disable nút "Tiếp tục" nếu chưa validate đủ field bắt buộc.
              ===================================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase text-neutral-900 tracking-tight">
                    Thông Tin Doanh Nghiệp / Tổ Chức
                  </h3>
                </div>
                <span className="text-xs text-neutral-500 font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded">
                  Bước 2 / {currentUser ? '4' : '5'}
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Tên doanh nghiệp * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Tên doanh nghiệp / Tổ chức *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    placeholder="VD: Công ty Cổ phần Tập đoàn Thép Việt Nhật"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.companyName ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  />
                  {errors.companyName && <p className="text-[11px] text-red-600 mt-1">{errors.companyName}</p>}
                </div>

                {/* Lĩnh vực hoạt động * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Lĩnh vực hoạt động / Ngành nghề *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleFieldChange('industry', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.industry ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  >
                    <option value="Sản xuất & Công nghiệp chế tạo">Sản xuất & Công nghiệp chế tạo</option>
                    <option value="Bất động sản & Xây dựng">Bất động sản & Xây dựng</option>
                    <option value="Tài chính - Ngân hàng - Bảo hiểm">Tài chính - Ngân hàng - Bảo hiểm</option>
                    <option value="Bán lẻ & Hàng tiêu dùng (FMCG)">Bán lẻ & Hàng tiêu dùng (FMCG)</option>
                    <option value="Công nghệ thông tin & Viễn thông">Công nghệ thông tin & Viễn thông</option>
                    <option value="Logistics & Chuỗi cung ứng">Logistics & Chuỗi cung ứng</option>
                    <option value="Năng lượng & Nông nghiệp công nghệ cao">Năng lượng & Nông nghiệp công nghệ cao</option>
                    <option value="Y tế & Dược phẩm">Y tế & Dược phẩm</option>
                    <option value="Dịch vụ & Tư vấn quản trị">Dịch vụ & Tư vấn quản trị</option>
                    <option value="Khác">Khác...</option>
                  </select>
                  {errors.industry && <p className="text-[11px] text-red-600 mt-1">{errors.industry}</p>}
                </div>

                {/* Quy mô doanh nghiệp * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Quy mô nhân sự doanh nghiệp *
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => handleFieldChange('companySize', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.companySize ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  >
                    <option value="">-- Chọn quy mô nhân sự --</option>
                    <option value="Dưới 50 nhân sự">Dưới 50 nhân sự (Khởi nghiệp / SME nhỏ)</option>
                    <option value="Từ 50 - 200 nhân sự">Từ 50 - 200 nhân sự (Doanh nghiệp vừa)</option>
                    <option value="Từ 200 - 500 nhân sự">Từ 200 - 500 nhân sự (Doanh nghiệp trung bình lớn)</option>
                    <option value="Từ 500 - 1.000 nhân sự">Từ 500 - 1.000 nhân sự (Tập đoàn lớn)</option>
                    <option value="Trên 1.000 nhân sự">Trên 1.000 nhân sự (Tập đoàn quy mô lớn / Đa quốc gia)</option>
                  </select>
                  {errors.companySize && <p className="text-[11px] text-red-600 mt-1">{errors.companySize}</p>}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <div className="flex items-center gap-2">
                  {hasPriorRegistrations && isAllStepsValid && (
                    <button
                      type="button"
                      onClick={handleQuickComplete}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Hoàn tất đăng ký ngay</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep2Valid}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Tiếp tục Bước 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              MÀN 3: QUAN TÂM & KẾT NỐI
              Rule: disable nút "Tiếp tục" nếu chưa validate đủ field bắt buộc.
              ===================================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase text-neutral-900 tracking-tight">
                    Quan Tâm & Kết Nối VCF
                  </h3>
                </div>
                <span className="text-xs text-neutral-500 font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded">
                  Bước 3 / {currentUser ? '4' : '5'}
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Hoạt động VCF quan tâm * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Các hoạt động VCF đại biểu quan tâm (Chọn ít nhất 1) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {[
                      { id: 'ceo-summit', title: 'CEO Summit (Đại hội Thượng đỉnh Lãnh đạo)' },
                      { id: 'ceo-forum', title: 'CEO Forum (Diễn đàn Chuyên đề Chiến lược)' },
                      { id: 'dao-tao-ceo', title: 'Đào tạo CEO LGM Mastery & C-Level' },
                      { id: 'tri-thuc', title: 'Kho tri thức & Thư viện Nghiên cứu Quản trị' }
                    ].map(act => {
                      const isChecked = formData.interestedActivities.includes(act.id);
                      return (
                        <div
                          key={act.id}
                          onClick={() => toggleInterestedActivity(act.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            isChecked
                              ? 'border-[#eb1000] bg-red-50/60 font-semibold text-[#eb1000]'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-[#eb1000] focus:ring-[#eb1000]"
                          />
                          <span className="leading-snug text-[11px] sm:text-xs">{act.title}</span>
                        </div>
                      );
                    })}
                  </div>
                  {errors.interestedActivities && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.interestedActivities}</p>
                  )}
                </div>

                {/* Nguồn tiếp cận * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Nguồn biết đến Diễn Đàn CEO Việt Nam (VCF) *
                  </label>
                  <select
                    value={formData.leadSource}
                    onChange={(e) => handleFieldChange('leadSource', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.leadSource ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  >
                    <option value="Giới thiệu từ Hội viên VCF">Giới thiệu từ Hội viên VCF</option>
                    <option value="Báo chí truyền thông (VnExpress, Cafef, Forbes...)">Báo chí truyền thông (VnExpress, Cafef, Forbes...)</option>
                    <option value="Đã từng tham gia sự kiện trước đó của VCF">Đã từng tham gia sự kiện trước đó của VCF</option>
                    <option value="Mạng xã hội (LinkedIn, Facebook, YouTube)">Mạng xã hội (LinkedIn, Facebook, YouTube)</option>
                    <option value="Lời mời từ Ban Thư ký / Hiệp hội Doanh nghiệp">Lời mời từ Ban Thư ký / Hiệp hội Doanh nghiệp</option>
                    <option value="Khác">Khác...</option>
                  </select>
                  {errors.leadSource && <p className="text-[11px] text-red-600 mt-1">{errors.leadSource}</p>}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <div className="flex items-center gap-2">
                  {hasPriorRegistrations && isAllStepsValid && (
                    <button
                      type="button"
                      onClick={handleQuickComplete}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Hoàn tất đăng ký ngay</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep3Valid}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Tiếp tục Bước 4</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              MÀN 4: ĐỐI THOẠI CHUYÊN GIA & VẤN ĐỀ DOANH NGHIỆP
              Case 2 (Đã đăng nhập): Nút "Hoàn tất" trực tiếp (GOTO Bước 6), checkbox 5.4
              Case 1 (Chưa đăng nhập): Nút "Tiếp tục Bước 5" (GOTO Bước 5)
              Rule: disable nếu chưa validate đủ field bắt buộc.
              ===================================================================== */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmitScreen4} className="space-y-4">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase text-neutral-900 tracking-tight">
                    Đối Thoại Chuyên Gia & Vấn Đề Doanh Nghiệp
                  </h3>
                </div>
                <span className="text-xs text-neutral-500 font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded">
                  Bước 4 / {currentUser ? '4' : '5'}
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Vấn đề doanh nghiệp đang đối mặt * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Vấn đề doanh nghiệp đang đối mặt *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.businessPainPoints}
                    onChange={(e) => handleFieldChange('businessPainPoints', e.target.value)}
                    placeholder="VD: Doanh nghiệp đang gặp khó khăn trong tối ưu dòng tiền ngắn hạn, áp lực tái cơ cấu nợ và cần tìm giải pháp số hoá quản trị kho bãi..."
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.businessPainPoints ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Nêu vắn tắt thách thức lớn nhất để Ban Tổ chức xếp nhóm bàn tròn thảo luận phù hợp.
                  </p>
                  {errors.businessPainPoints && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.businessPainPoints}</p>
                  )}
                </div>

                {/* Câu hỏi cho Diễn giả / Mentor cố vấn * */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Câu hỏi cho Diễn giả / Mentor cố vấn *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.questionForMentor}
                    onChange={(e) => handleFieldChange('questionForMentor', e.target.value)}
                    placeholder="VD: Làm thế nào để giải quyết xung đột mục tiêu giữa HĐQT và Ban Điều hành khi mở rộng sang thị trường quốc tế?"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                      errors.questionForMentor ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                    }`}
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Câu hỏi của quý vị sẽ được tổng hợp gửi trước cho ban chuyên gia điều phối phiên tọa đàm.
                  </p>
                  {errors.questionForMentor && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.questionForMentor}</p>
                  )}
                </div>

                {/* Cam kết quy chế */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => handleFieldChange('agreedToTerms', e.target.checked)}
                      className="mt-0.5 rounded text-[#eb1000] focus:ring-[#eb1000]"
                    />
                    <span>
                      Tôi cam kết thông tin cung cấp là chính xác, đồng ý tuân thủ <strong>Quy chế sinh hoạt Diễn Đàn CEO Việt Nam (VCF)</strong> và tiếp nhận thông báo xác thực từ Ban Thư ký.
                    </span>
                  </label>
                  {errors.terms && <p className="text-[11px] text-red-600 mt-1">{errors.terms}</p>}
                </div>

                {/* Section 5.4 Checkbox (Dành cho User đã đăng nhập): Tùy chọn cập nhật User Profile gốc */}
                {currentUser && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs">
                    <label className="flex items-start gap-2 text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={updateBaseProfile}
                        onChange={(e) => setUpdateBaseProfile(e.target.checked)}
                        className="mt-0.5 rounded text-[#eb1000] focus:ring-[#eb1000]"
                      />
                      <span className="text-[11px] text-neutral-600 leading-relaxed">
                        Cập nhật các thông tin này vào <strong>Hồ sơ cá nhân của tôi</strong> (Mặc định không ghi đè hồ sơ gốc).
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="submit"
                  disabled={!isStep4Valid || isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {currentUser ? <Send className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  <span>
                    {isSubmitting
                      ? 'Đang xử lý...'
                      : currentUser
                      ? isWaitlist
                        ? 'Hoàn tất đăng ký Danh sách chờ'
                        : 'Hoàn tất đăng ký sự kiện'
                      : 'Tiếp tục: Hoàn tất đăng ký (Bước 5)'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              BƯỚC 5: HOÀN TẤT ĐĂNG KÝ (User CHƯA đăng nhập)
              Yêu cầu tạo mật khẩu & nhập lại mật khẩu để hoàn tất đăng ký
              ===================================================================== */}
          {currentStep === 5 && (
            <form onSubmit={handleStep5Submit} className="space-y-4">
              <div className="border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-[#eb1000] flex items-center justify-center">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                    Bước 5: Hoàn Tất Đăng Ký
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                  Đại biểu: <strong>{formData.fullName || 'Đại biểu Hội viên'}</strong> ({formData.companyName || 'Doanh nghiệp'}). Vui lòng tạo mật khẩu và nhập lại mật khẩu để hoàn tất đăng ký tài khoản và nhận vé tham dự.
                </p>
              </div>

              {/* Email Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Email nhận vé & thông báo đại biểu *
                  </label>
                  {userExists ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Email đã có tài khoản
                    </span>
                  ) : formData.email.trim() && formData.email.includes('@') ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Tạo tài khoản mới
                    </span>
                  ) : null}
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="VD: ceo@vinasteel.com.vn hoặc email.congty@gmail.com"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>}
              </div>

              {/* TRƯỜNG HỢP EMAIL ĐÃ CÓ TÀI KHOẢN (Trường hợp A) */}
              {userExists ? (
                <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs font-black text-amber-950 uppercase tracking-tight">
                        Email đã tồn tại trong hệ thống
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserExists(false);
                      }}
                      className="text-[10px] text-amber-800 hover:text-amber-950 underline font-medium cursor-pointer"
                    >
                      Dùng mật khẩu mới
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-950 leading-relaxed font-sans">
                    Email <strong>{formData.email}</strong> đã có tài khoản Hội viên VCF. Quý vị vui lòng nhập mật khẩu tài khoản để đăng nhập và hoàn tất nhận vé:
                  </p>

                  {/* Nhập mật khẩu truy cập */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Nhập mật khẩu truy cập *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={existingUserPassword}
                        onChange={(e) => setExistingUserPassword(e.target.value)}
                        placeholder="Nhập mật khẩu tài khoản của quý vị"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-[#eb1000] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordMessage(`Liên kết đặt lại mật khẩu đã được gửi tới ${formData.email}. Quý vị vui lòng kiểm tra hòm thư.`);
                        }}
                        className="text-neutral-600 hover:text-[#eb1000] underline cursor-pointer"
                      >
                        Quên mật khẩu?
                      </button>

                      <button
                        type="button"
                        onClick={() => setExistingUserPassword('Password123!')}
                        className="text-amber-800 hover:text-amber-950 font-mono font-bold underline cursor-pointer"
                      >
                        [Demo: Điền mật khẩu mẫu]
                      </button>
                    </div>

                    {forgotPasswordMessage && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{forgotPasswordMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Login Options */}
                  <div className="pt-2.5 border-t border-amber-200/80">
                    <span className="text-[11px] text-neutral-600 font-medium block mb-2">
                      Hoặc đăng nhập nhanh qua:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSocialAuthAtStep5('google')}
                        className="py-2 px-3 border border-neutral-300 hover:bg-white bg-white/80 rounded-lg text-[11px] font-bold text-neutral-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-red-500" />
                        <span>Google Workspace</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialAuthAtStep5('linkedin')}
                        className="py-2 px-3 border border-neutral-300 hover:bg-white bg-white/80 rounded-lg text-[11px] font-bold text-neutral-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-blue-600" />
                        <span>LinkedIn Business</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* TRƯỜNG HỢP MẶC ĐỊNH / TẠO TÀI KHOẢN MỚI: YÊU CẦU TẠO MẬT KHẨU & NHẬP LẠI MẬT KHẨU */
                <div className="bg-neutral-50/90 border border-neutral-200 rounded-xl p-4 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#eb1000] shrink-0" />
                      <span className="text-xs font-black text-neutral-900 uppercase tracking-tight">
                        Tạo mật khẩu tài khoản
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Tài khoản Hội viên VCF
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    Quý vị vui lòng thiết lập mật khẩu để hoàn tất đăng ký sự kiện và kích hoạt tài khoản Hội viên:
                  </p>

                  {/* FIELD 1: Tạo mật khẩu */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-800 block">
                        Tạo mật khẩu *
                      </label>
                      <span className="text-[11px] text-neutral-500 font-sans">
                        Tối thiểu 6 ký tự
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        placeholder="Nhập mật khẩu mới của quý vị"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none pr-10 transition-colors ${
                          errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                        formData.password.length >= 6 ? 'bg-emerald-500' : formData.password.length > 0 ? 'bg-amber-400' : 'bg-neutral-200'
                      }`} />
                      <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                        formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-neutral-200'
                      }`} />
                      <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                        formData.password.length >= 10 ? 'bg-emerald-500' : 'bg-neutral-200'
                      }`} />
                      <span className="text-[10px] font-semibold pl-1 font-mono text-neutral-600">
                        {formData.password.length >= 8 ? 'Mạnh' : formData.password.length >= 6 ? 'Đủ điều kiện' : 'Tối thiểu 6 ký tự'}
                      </span>
                    </div>
                    {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
                  </div>

                  {/* FIELD 2: Nhập lại mật khẩu */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Nhập lại mật khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        placeholder="Nhập lại chính xác mật khẩu trên"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl bg-white focus:outline-none pr-10 transition-colors ${
                          errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-[#eb1000]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Matching Realtime Feedback */}
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Mật khẩu xác nhận chưa trùng khớp</span>
                      </p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && (
                      <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Mật khẩu trùng khớp ✓</span>
                      </p>
                    )}
                    {errors.confirmPassword && <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Ghi chú tạo tài khoản */}
                  <div className="bg-white border border-neutral-200 rounded-lg p-2.5 text-[11px] text-neutral-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mật khẩu này sẽ được dùng để đăng nhập Hội viên VCF và theo dõi vé tham dự sự kiện.</span>
                  </div>
                </div>
              )}

              {/* Demo Helper Bar */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1 pt-1">
                <span>Thử nhanh:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('email', 'daibieu.moi@fpt.com.vn');
                      handleFieldChange('password', 'Vcf2026!');
                      handleFieldChange('confirmPassword', 'Vcf2026!');
                      setUserExists(false);
                      setEmailChecked(true);
                    }}
                    className="text-neutral-600 hover:text-[#eb1000] underline font-medium cursor-pointer"
                  >
                    [Điền mẫu email mới & mật khẩu]
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('email', 'ceo@vinasteel.com.vn');
                      setUserExists(true);
                      setEmailChecked(true);
                      setExistingUserPassword('Password123!');
                    }}
                    className="text-amber-800 hover:text-amber-950 underline font-medium cursor-pointer"
                  >
                    [Thử email đã có tài khoản]
                  </button>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại Bước 4</span>
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (userExists ? !isStep5ExistingUserValid : !isStep5NewUserValid)
                  }
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Đang xử lý...'
                      : userExists
                      ? 'Đăng nhập & Hoàn tất'
                      : isWaitlist
                      ? 'Hoàn tất đăng ký danh sách chờ'
                      : 'Hoàn tất đăng ký'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* =====================================================================
              BƯỚC 6: THÔNG BÁO TIẾP NHẬN THÀNH CÔNG (PENDING_APPROVAL / WAITLISTED)
              1. Hiển thị popup trạng thái yêu cầu, đang chờ thư ký duyệt + check email thông tin đăng ký
              2. Khối thông tin hồ sơ đã khai báo (Đầy đủ 8 trường như ảnh chụp)
              ===================================================================== */}
          {currentStep === 6 && (
            <div className="space-y-4 py-1">
              {/* KHỐI 1: TRẠNG THÁI HỒ SƠ (Khối màu vàng/amber như trong ảnh chụp) */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-md">
                      Trạng thái hồ sơ
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                      {isWaitlist ? 'Đang Trong Danh Sách Chờ (Waitlist)' : 'Đang Chờ Ban Thư Ký Duyệt'}
                    </h4>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3.5 border border-amber-200 text-xs sm:text-[13px] text-amber-950 font-sans leading-relaxed shadow-2xs">
                  <p className="font-medium">
                    {isWaitlist ? (
                      <>Ban Thư ký VCF đã ghi nhận thông tin đăng ký của quý vị vào <strong>Danh sách chờ (Waitlist)</strong> cho sự kiện <strong>{eventTitle}</strong>. Khi có đại biểu thay đổi lịch trình hoặc khán phòng mở thêm chỗ, Ban Thư ký sẽ ưu tiên liên hệ theo thứ tự.</>
                    ) : (
                      <>Yêu cầu tham dự của quý vị đang được Ban Thư ký VCF xem xét và xác minh tư cách đại biểu. Khi được phê duyệt, hệ thống sẽ gửi email xác nhận kèm <strong>Mã QR Check-in</strong> chính thức vào khán phòng.</>
                    )}
                  </p>
                </div>

                <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Lưu ý:</strong> Mã QR Check-in sẽ được cấp tự động tại mục này ngay khi Ban Thư ký phê duyệt.
                  </span>
                </div>
              </div>

              {/* KHỐI 2: CHECK EMAIL THÔNG TIN ĐĂNG KÝ (Yêu cầu: + check email thông tin đăng ký) */}
              <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        Xác nhận qua email
                      </span>
                      <strong className="text-xs sm:text-sm text-blue-950 font-black">
                        Vui lòng kiểm tra email của quý vị
                      </strong>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Đã gửi thư tiếp nhận ✓
                  </span>
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-200 text-xs text-neutral-700 space-y-1.5 leading-relaxed font-sans">
                  <p>
                    Hệ thống đã tự động gửi email biên nhận thông tin đăng ký sự kiện tới địa chỉ:
                  </p>
                  <div className="flex items-center gap-2 font-mono font-bold text-neutral-900 bg-blue-50/70 px-2.5 py-1.5 rounded border border-blue-200 text-[11px] sm:text-xs">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{formData.email || currentUser?.email || 'duc.pham@vinasteel.com.vn'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 pt-1">
                    Quý đại biểu vui lòng mở hòm thư <strong>Inbox</strong> (hoặc kiểm tra thêm mục <strong>Spam / Quảng cáo</strong>) để xem lại chi tiết thông tin đã đăng ký và chuẩn bị cho sự kiện.
                  </p>
                </div>

                {/* Interactive Email Preview Drawer */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 underline cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showEmailPreview ? 'Ẩn xem trước email xác nhận' : 'Xem trước nội dung Email biên nhận đã gửi →'}</span>
                    {showEmailPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showEmailPreview && (
                    <div className="mt-2.5 bg-white border border-neutral-300 rounded-lg p-3.5 text-xs text-neutral-800 space-y-2 font-sans shadow-inner animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 text-[11px] text-neutral-500 font-mono">
                        <span>Từ: Ban Thư ký Diễn Đàn CEO Việt Nam &lt;bth@vcf.org.vn&gt;</span>
                        <span className="font-sans font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Đã gửi</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 pb-1 border-b border-neutral-100 font-mono">
                        <span>Đến: {formData.email || currentUser?.email || 'duc.pham@vinasteel.com.vn'}</span>
                      </div>
                      <div className="font-bold text-black text-xs pt-1">
                        Tiêu đề: [VCF] Tiếp nhận hồ sơ đăng ký tham dự: {eventTitle}
                      </div>
                      <div className="text-[11px] text-neutral-700 space-y-1.5 leading-relaxed pt-1">
                        <p>Kính gửi Đại biểu <strong>{formData.fullName || 'Phạm Minh Đức'}</strong> ({formData.jobTitle || 'Tổng Giám Đốc (CEO)'} - {formData.companyName || 'Công ty Cổ phần Thép VinaSteel'}),</p>
                        <p>Ban Thư ký Diễn Đàn CEO Việt Nam (VCF) trân trọng thông báo đã tiếp nhận hồ sơ đăng ký tham dự của Quý vị với <strong>Mã hồ sơ: {regCode}</strong>.</p>
                        <p>Hồ sơ của Quý vị đang được Ban Thư ký thẩm định theo quy chuẩn C-Level. Kết quả xét duyệt kèm Mã QR Check-in chính thức sẽ được gửi tới Quý vị qua email này và số điện thoại <strong>{formData.phone || '0912 345 678'}</strong> trong vòng 24 - 48 giờ làm việc.</p>
                        <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200 text-[10px] space-y-1 text-neutral-600">
                          <div>• Sự kiện: <strong className="text-black">{eventTitle}</strong></div>
                          <div>• Thời gian: <strong>{eventDatetime}</strong></div>
                          <div>• Địa điểm: <strong>{eventLocation}</strong></div>
                          <div>• Trạng thái: <strong className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Đang chờ Ban Thư ký duyệt</strong></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* KHỐI 3: THÔNG TIN ĐÃ KHAI BÁO    ✓ ĐẦY ĐỦ 8 TRƯỜNG (Khớp 100% ảnh chụp) */}
              <div className="border border-neutral-200 rounded-xl p-3.5 sm:p-4 bg-neutral-50/90 space-y-2.5 text-xs font-sans shadow-2xs">
                <div className="text-[11px] font-black uppercase text-neutral-600 tracking-wider flex items-center justify-between pb-1.5 border-b border-neutral-200">
                  <span>Thông tin đã khai báo</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Đầy đủ 8 trường
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-neutral-700 pt-1">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Mã hồ sơ tiếp nhận:</span>
                    <span className="font-mono font-bold text-neutral-900 bg-white border border-neutral-200 px-2 py-0.5 rounded text-[11px]">
                      {regCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Đại biểu:</span>{' '}
                    <strong className="text-black">{formData.jobTitle || 'Tổng Giám Đốc (CEO)'} - {formData.fullName || 'Phạm Minh Đức'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Số điện thoại:</span>{' '}
                    <strong className="text-black">{formData.phone || '0912 345 678'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Doanh nghiệp:</span>{' '}
                    <strong className="text-black">{formData.companyName || 'Công ty Cổ phần Thép VinaSteel'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Lĩnh vực:</span>{' '}
                    <span>{formData.industry || 'Sản xuất & Công nghiệp chế tạo'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Quy mô:</span>{' '}
                    <span>{formData.companySize || 'Từ 100 - 300 nhân sự'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Vấn đề trọng tâm:</span>{' '}
                    <span className="italic">"{formData.businessPainPoints || 'Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng.'}"</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Câu hỏi gửi Mentor:</span>{' '}
                    <span className="italic">"{formData.questionForMentor || 'Làm thế nào để duy trì động lực đổi mới sáng tạo trong doanh nghiệp sản xuất truyền thống?'}"</span>
                  </div>
                </div>
              </div>

              {/* KHỐI 4: NÚT THAO TÁC ĐIỀU HƯỚNG */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-5 bg-[#eb1000] hover:bg-[#c90d00] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Về trang sự kiện & Xem trạng thái hồ sơ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo('profile');
                  }}
                  className="py-3 px-4 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Xem trong Hồ sơ cá nhân →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
