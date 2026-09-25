import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Mail,
  User,
  Briefcase,
  AlertCircle,
  Clock,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { JOB_TITLE_OPTIONS } from './StepByStepMemberModal';

export interface MobileEventRegistrationModalProps {
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

export const MobileEventRegistrationModal: React.FC<MobileEventRegistrationModalProps> = ({
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

  // Steps: 1..4 (or 1..5 for guest)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [fastTrackMode, setFastTrackMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showEmailPreview, setShowEmailPreview] = useState<boolean>(false);
  const [regCode, setRegCode] = useState<string>('');

  // Password fields for guest quick account creation (Step 5)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // Tùy chọn cập nhật ngược vào User Profile gốc (mặc định false)
  const [updateBaseProfile, setUpdateBaseProfile] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Đại biểu
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    // Step 2: Doanh nghiệp
    companyName: '',
    industry: 'Sản xuất & Công nghiệp chế tạo',
    companySize: '',
    // Step 3: Quan tâm & Kết nối
    interestedActivities: ['ceo-summit', 'ceo-forum'],
    leadSource: 'Giới thiệu từ Hội viên VCF',
    // Step 4: Chuyên gia & Cam kết
    businessPainPoints: '',
    questionForMentor: '',
    agreedToTerms: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Refs for focusing first invalid field
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const jobTitleRef = useRef<HTMLSelectElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLSelectElement>(null);
  const companySizeRef = useRef<HTMLSelectElement>(null);
  const painPointsRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize or reset flow whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const generatedCode = `VCF-REG-${Math.floor(100000 + Math.random() * 900000)}`;
      setRegCode(generatedCode);
      setErrors({});
      setIsSuccess(false);
      setIsSubmitting(false);
      setShowTermsModal(false);
      setShowEmailPreview(false);
      setUpdateBaseProfile(false);
      setPassword('');
      setConfirmPassword('');
      setUserExists(false);

      if (currentUser) {
        const prevEvent = registeredEvents?.find(
          r => r.details && (r.details.jobTitle || r.details.companyName || r.details.phone || r.details.industry)
        );
        const prevDet = prevEvent?.details;

        const initialData = {
          fullName: currentUser.fullName || prevDet?.name || prevDet?.fullName || 'Phạm Minh Đức',
          email: currentUser.email || prevDet?.email || 'duc.pham@vinasteel.com.vn',
          phone: currentUser.phone || prevDet?.phone || '0912 345 678',
          jobTitle: currentUser.jobTitle || prevDet?.jobTitle || 'Tổng Giám Đốc (CEO)',
          companyName: currentUser.companyName || prevDet?.companyName || 'Công ty Cổ phần Thép VinaSteel',
          industry: currentUser.industry || prevDet?.industry || 'Sản xuất & Công nghiệp chế tạo',
          companySize: currentUser.companySize || prevDet?.companySize || 'Từ 100 - 300 nhân sự',
          interestedActivities: (Array.isArray(currentUser.interestedActivities) && currentUser.interestedActivities.length > 0)
            ? (currentUser.interestedActivities as string[])
            : (prevDet?.interestedActivities as string[]) || ['ceo-summit', 'ceo-forum'],
          leadSource: currentUser.leadSource || prevDet?.leadSource || 'Giới thiệu từ Hội viên VCF',
          businessPainPoints: currentUser.businessPainPoints || prevDet?.businessPainPoints || 'Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng.',
          questionForMentor: currentUser.questionForMentor || prevDet?.questionForMentor || '',
          agreedToTerms: true
        };

        setFormData(initialData);

        // Check if all mandatory fields exist for Fast Track
        const hasAllMandatory = Boolean(
          initialData.fullName.trim() &&
          initialData.phone.trim() &&
          initialData.jobTitle.trim() &&
          initialData.companyName.trim() &&
          initialData.industry.trim() &&
          initialData.companySize.trim() &&
          initialData.interestedActivities.length > 0 &&
          initialData.businessPainPoints.trim()
        );

        if (hasAllMandatory) {
          setFastTrackMode(true);
          setCurrentStep(1);
        } else {
          setFastTrackMode(false);
          setCurrentStep(1);
        }
      } else {
        // Guest mode: start empty
        setFastTrackMode(false);
        setCurrentStep(1);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          jobTitle: '',
          companyName: '',
          industry: 'Sản xuất & Công nghiệp chế tạo',
          companySize: '',
          interestedActivities: ['ceo-summit', 'ceo-forum'],
          leadSource: 'Giới thiệu từ Hội viên VCF',
          businessPainPoints: '',
          questionForMentor: '',
          agreedToTerms: true
        });
      }
    }
  }, [isOpen, currentUser, registeredEvents]);

  // Check email existence when email field updates
  useEffect(() => {
    if (!currentUser && formData.email.trim() && formData.email.includes('@')) {
      const exists = checkEmailExistsInSystem(formData.email.trim());
      setUserExists(exists);
    } else {
      setUserExists(false);
    }
  }, [formData.email, currentUser, checkEmailExistsInSystem]);

  // Scroll to top of form when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, fastTrackMode, isSuccess]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
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

  // Validation functions
  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên đại biểu';
      fullNameRef.current?.focus();
    } else if (!formData.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại liên hệ';
      phoneRef.current?.focus();
    } else if (!formData.jobTitle.trim()) {
      errs.jobTitle = 'Vui lòng chọn hoặc nhập chức danh';
      jobTitleRef.current?.focus();
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.companyName.trim()) {
      errs.companyName = 'Vui lòng nhập tên doanh nghiệp / tổ chức';
      companyNameRef.current?.focus();
    } else if (!formData.industry.trim()) {
      errs.industry = 'Vui lòng chọn lĩnh vực hoạt động';
      industryRef.current?.focus();
    } else if (!formData.companySize.trim()) {
      errs.companySize = 'Vui lòng chọn quy mô doanh nghiệp';
      companySizeRef.current?.focus();
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.interestedActivities || formData.interestedActivities.length === 0) {
      errs.interestedActivities = 'Vui lòng chọn ít nhất 1 hoạt động quan tâm';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.businessPainPoints.trim()) {
      errs.businessPainPoints = 'Vui lòng nêu thách thức lớn nhất của doanh nghiệp';
      painPointsRef.current?.focus();
    }
    if (!formData.agreedToTerms) {
      errs.agreedToTerms = 'Vui lòng xác nhận đồng ý với Quy chế sinh hoạt VCF';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Vui lòng nhập email hợp lệ để nhận vé';
    }
    if (!password) {
      errs.password = 'Vui lòng nhập mật khẩu';
      passwordRef.current?.focus();
    } else if (password.length < 6) {
      errs.password = 'Mật khẩu phải có tối thiểu 6 ký tự';
      passwordRef.current?.focus();
    }
    if (!userExists && password !== confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận chưa trùng khớp';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submission handler for Logged-In Members
  const handleMemberSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const regDetails = {
        name: formData.fullName,
        fullName: formData.fullName,
        email: formData.email || currentUser?.email || '',
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
        updateUserProfile: updateBaseProfile,
        details: regDetails
      });

      if (onSuccess && currentUser) {
        onSuccess(currentUser, regDetails);
      }

      // Close mobile registration modal so EventRegistrationSuccessModal takes full focus without double modals
      onClose();
      showNotification(isWaitlist ? 'Đã ghi nhận vào Danh sách chờ!' : 'Đăng ký sự kiện thành công!');
    }, 450);
  };

  // Submission handler for Guest Quick Account Creation (Step 5)
  const handleGuestAccountSubmit = () => {
    if (!validateStep5()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const effectiveEmail = formData.email.trim();
      let effectiveUser: UserProfile;

      if (userExists) {
        // Đăng nhập tài khoản đã có
        loginWithAccount(effectiveEmail, formData.fullName, formData.companyName);
        effectiveUser = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          memberId: `VCF-MBR-${Date.now().toString().slice(-4)}`,
          fullName: formData.fullName,
          email: effectiveEmail,
          phone: formData.phone,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          membershipStatus: 'approved',
          joinedDate: new Date().toLocaleDateString('vi-VN'),
          interestedActivities: formData.interestedActivities as any,
          isProfileComplete: true
        };
      } else {
        // Tạo tài khoản Hội viên mới
        effectiveUser = registerMember({
          fullName: formData.fullName,
          email: effectiveEmail,
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
      }

      const regDetails = {
        name: formData.fullName,
        fullName: formData.fullName,
        email: effectiveEmail,
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
        updateUserProfile: true,
        details: regDetails
      });

      if (onSuccess) {
        onSuccess(effectiveUser, regDetails);
      }

      // Close mobile registration modal so EventRegistrationSuccessModal takes full focus without double modals
      onClose();
      showNotification(isWaitlist ? 'Đã ghi nhận vào Danh sách chờ!' : 'Đăng ký sự kiện thành công!');
    }, 450);
  };

  // Step navigation
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    } else if (currentStep === 4) {
      if (validateStep4()) {
        if (currentUser) {
          handleMemberSubmit();
        } else {
          setCurrentStep(5);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 4) setCurrentStep(3);
    else if (currentStep === 5) setCurrentStep(4);
  };

  // Auto-grow textarea handler
  const handleTextareaAutoGrow = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${Math.max(76, target.scrollHeight)}px`;
  };

  // Google Calendar helper for Success state
  const handleAddToCalendar = () => {
    const gcalStart = '20261015T010000Z'; // 08:00 VN time (UTC+7)
    const gcalEnd = '20261015T103000Z';   // 17:30 VN time
    const title = encodeURIComponent(eventTitle);
    const details = encodeURIComponent(
      `Đăng ký tham dự VCF: ${eventTitle}\nMã hồ sơ: ${regCode}\nĐại biểu: ${formData.fullName}\nDoanh nghiệp: ${formData.companyName}`
    );
    const location = encodeURIComponent(eventLocation);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gcalStart}/${gcalEnd}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-reg-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
    >
      {/* Click outside backdrop on desktop */}
      <div 
        className="fixed inset-0 hidden sm:block -z-10" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Responsive Unified Modal Card */}
      <div className="relative z-10 flex flex-col bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:shadow-2xl sm:border sm:border-neutral-200 overflow-hidden">
        {/* =========================================================================
            HEADER (Unified Modern Style: Clean White, Clear Typography)
            ========================================================================= */}
        <header className="sticky top-0 z-30 bg-white border-b border-hairline px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-3.5 shrink-0 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 id="mobile-reg-title" className="text-[32px] font-extrabold tracking-tight text-ink leading-tight">
                {isWaitlist ? 'Đăng ký danh sách chờ' : 'Đăng ký tham dự'}
              </h1>
              <p className="text-[18px] text-ink-secondary font-medium line-clamp-2 mt-1 leading-snug">
                {eventTitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="flex size-10 shrink-0 -mr-1 -mt-1 items-center justify-center rounded-full text-neutral-500 hover:text-ink hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="size-5 sm:size-6" />
            </button>
          </div>

          {/* =======================================================================
              STEPPER (Short labels on mobile, full labels on desktop, no truncation)
              ======================================================================= */}
          {!fastTrackMode && !isSuccess && (
            <div className="mt-3.5 pt-3 border-t border-hairline/80">
              <div className={`relative grid ${currentUser ? 'grid-cols-4' : 'grid-cols-5'}`}>
                <div
                  aria-hidden="true"
                  className="absolute top-3 sm:top-3.5 h-px bg-hairline"
                  style={{ left: `${50 / (currentUser ? 4 : 5)}%`, right: `${50 / (currentUser ? 4 : 5)}%` }}
                />
                {[
                  { step: 1, label: 'Thông tin', fullLabel: 'Thông tin' },
                  { step: 2, label: 'Công ty', fullLabel: 'Doanh nghiệp' },
                  { step: 3, label: 'Quan tâm', fullLabel: 'Quan tâm' },
                  { step: 4, label: 'Câu hỏi', fullLabel: 'Câu hỏi' },
                  ...(!currentUser ? [{ step: 5, label: 'Tài khoản', fullLabel: 'Tài khoản' }] : [])
                ].map(item => {
                  const isCompleted = currentStep > item.step;
                  const isCurrent = currentStep === item.step;

                  return (
                    <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                      <div className="flex items-center justify-center mb-1">
                        <div
                          className={`vcf-step-indicator size-6 sm:size-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-semibold transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-brand-primary text-white ring-2 ring-red-200 shadow-xs'
                              : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                          }`}
                        >
                          {isCompleted ? <Check className="size-3.5 stroke-[2.5]" /> : item.step}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-medium leading-none truncate w-full ${
                          isCurrent
                            ? 'text-brand-primary font-bold'
                            : isCompleted
                            ? 'text-emerald-700'
                            : 'text-neutral-500'
                        }`}
                      >
                        <span className="sm:hidden">{item.label}</span>
                        <span className="hidden sm:inline">{item.fullLabel}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* =========================================================================
            SCROLLABLE FORM CONTENT CONTAINER
            ========================================================================= */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 overscroll-contain bg-white"
        >
        {/* =======================================================================
            BRANCH A: MEMBER FAST TRACK (Separate branch BEFORE wizard)
            ======================================================================= */}
        {fastTrackMode && !isSuccess && (
          <div className="space-y-4 max-w-xl mx-auto">
            {/* Header info */}
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-brand-primary border border-red-200">
                <Sparkles className="size-3" />
                Hội viên VCF
              </span>
              <h2 className="text-lg font-bold text-ink tracking-tight pt-1">
                Thông tin đã có sẵn
              </h2>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Hệ thống đã nhận diện hồ sơ của Quý vị. Quý vị có thể xác nhận đăng ký nhanh ngay hoặc chỉnh sửa lại thông tin trước khi nộp.
              </p>
            </div>

            {/* Profile summary card */}
            <div className="bg-parchment/80 border border-hairline rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/8 text-xs font-semibold text-neutral-800">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5 text-brand-primary" />
                  Hồ sơ đại biểu
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Đầy đủ dữ liệu
                </span>
              </div>

              <div className="space-y-2 text-xs text-neutral-800 font-sans">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-ink-secondary shrink-0">Đại biểu:</span>
                  <strong className="text-right text-ink font-semibold">{formData.fullName}</strong>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-ink-secondary shrink-0">Chức danh:</span>
                  <span className="text-right text-ink">{formData.jobTitle}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-ink-secondary shrink-0">Doanh nghiệp:</span>
                  <strong className="text-right text-ink font-semibold">{formData.companyName}</strong>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-ink-secondary shrink-0">Điện thoại:</span>
                  <span className="text-right font-mono text-ink">{formData.phone}</span>
                </div>

                {formData.email && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-ink-secondary shrink-0">Email vé:</span>
                    <span className="text-right font-mono text-ink text-[11px] truncate max-w-[200px]">
                      {formData.email}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-black/8">
                  <span className="text-ink-secondary block mb-1">Thách thức chia sẻ:</span>
                  <p className="text-[11px] text-neutral-700 italic bg-white/70 p-2.5 rounded-lg border border-hairline">
                    "{formData.businessPainPoints}"
                  </p>
                </div>
              </div>
            </div>

            {/* Fast Track Action buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleMemberSubmit}
                disabled={isSubmitting}
                className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <span>Đăng ký nhanh</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFastTrackMode(false);
                  setCurrentStep(1);
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer border border-neutral-300"
              >
                Chỉnh sửa / bổ sung
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            BRANCH B: WIZARD STEPS
            ======================================================================= */}
        {!fastTrackMode && !isSuccess && (
          <div className="space-y-4 max-w-xl mx-auto">
            {/* -----------------------------------------------------------------
                STEP 1: THÔNG TIN ĐẠI BIỂU
                ----------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5">
                  <h2 className="text-base font-bold text-ink">
                    Thông tin đại biểu
                  </h2>
                  <span className="shrink-0 text-[11px] font-sans font-bold text-brand-primary uppercase tracking-wider" style={{ fontFamily: '"Inter Variable", Arial, sans-serif' }}>
                    Bước 1/{currentUser ? '4' : '5'}
                  </span>
                </div>

                {/* Compact Member Prefill Status */}
                {currentUser && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-emerald-950 block text-[11px]">
                          ✓ Đã điền từ hồ sơ Hội viên
                        </span>
                        <span className="text-emerald-700 text-[11px] truncate block">
                          {currentUser.fullName} · {currentUser.companyName || 'VCF Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3.5">
                  {/* Họ và tên * */}
                  <div>
                    <label htmlFor="reg-mobile-fullname" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Họ và tên đại biểu *
                    </label>
                    <input
                      id="reg-mobile-fullname"
                      ref={fullNameRef}
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                      }`}
                    />
                    {errors.fullName && <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.fullName}</p>}
                  </div>

                  {/* Email nhận vé & thông báo */}
                  <div>
                    <label htmlFor="reg-mobile-email" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Email nhận vé & thông báo
                    </label>
                    <input
                      id="reg-mobile-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="VD: ceo@vinasteel.com.vn"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Vé điện tử và mã QR check-in sẽ được gửi tới hòm thư này.
                    </p>
                  </div>

                  {/* Số điện thoại * */}
                  <div>
                    <label htmlFor="reg-mobile-phone" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      id="reg-mobile-phone"
                      ref={phoneRef}
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="VD: 0912 345 678"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                      }`}
                    />
                    {errors.phone && <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.phone}</p>}
                  </div>

                  {/* Chức danh / Vai trò * */}
                  <div>
                    <label htmlFor="reg-mobile-jobtitle" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Chức danh / Vai trò *
                    </label>
                    <select
                      id="reg-mobile-jobtitle"
                      ref={jobTitleRef}
                      value={formData.jobTitle}
                      onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.jobTitle ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
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
                    {errors.jobTitle && <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.jobTitle}</p>}
                  </div>
                </div>

                {/* Optional login link for guests */}
                {!currentUser && onSwitchToLogin && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-[15px] text-ink-secondary hover:text-brand-primary underline cursor-pointer"
                    >
                      Đã có tài khoản Hội viên? Đăng nhập
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 2: THÔNG TIN DOANH NGHIỆP
                ----------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-hairline pb-2.5">
                  <span className="text-sm font-sans font-bold text-brand-primary uppercase tracking-wider block" style={{ fontFamily: '"Inter Variable", Arial, sans-serif' }}>
                    Bước 2/{currentUser ? '4' : '5'}
                  </span>
                  <h2 className="text-base font-bold text-ink">
                    Thông tin doanh nghiệp
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Tên doanh nghiệp * */}
                  <div>
                    <label htmlFor="reg-mobile-company" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Tên doanh nghiệp / Tổ chức *
                    </label>
                    <input
                      id="reg-mobile-company"
                      ref={companyNameRef}
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      placeholder="VD: Công ty Cổ phần Thép VinaSteel"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.companyName ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                      }`}
                    />
                    {errors.companyName && <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.companyName}</p>}
                  </div>

                  {/* Lĩnh vực hoạt động * */}
                  <div>
                    <label htmlFor="reg-mobile-industry" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Lĩnh vực hoạt động / Ngành nghề *
                    </label>
                    <select
                      id="reg-mobile-industry"
                      ref={industryRef}
                      value={formData.industry}
                      onChange={(e) => handleFieldChange('industry', e.target.value)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.industry ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
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
                    {errors.industry && <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.industry}</p>}
                  </div>

                  {/* Quy mô nhân sự * */}
                  <div>
                    <label htmlFor="reg-mobile-companysize" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Quy mô nhân sự *
                    </label>
                    <select
                      id="reg-mobile-companysize"
                      ref={companySizeRef}
                      value={formData.companySize}
                      onChange={(e) => handleFieldChange('companySize', e.target.value)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.companySize ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                      }`}
                    >
                      <option value="">-- Chọn quy mô nhân sự --</option>
                      <option value="Dưới 50 nhân sự">Dưới 50 nhân sự (Khởi nghiệp / SME nhỏ)</option>
                      <option value="Từ 50 - 200 nhân sự">Từ 50 - 200 nhân sự (Doanh nghiệp vừa)</option>
                      <option value="Từ 200 - 500 nhân sự">Từ 200 - 500 nhân sự (Doanh nghiệp trung bình lớn)</option>
                      <option value="Từ 500 - 1.000 nhân sự">Từ 500 - 1.000 nhân sự (Tập đoàn lớn)</option>
                      <option value="Trên 1.000 nhân sự">Trên 1.000 nhân sự (Tập đoàn quy mô lớn / Đa quốc gia)</option>
                    </select>
                    {errors.companySize && <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.companySize}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 3: QUAN TÂM & KẾT NỐI
                ----------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-hairline pb-2.5">
                  <span className="text-sm font-sans font-bold text-brand-primary uppercase tracking-wider block" style={{ fontFamily: '"Inter Variable", Arial, sans-serif' }}>
                    Bước 3/{currentUser ? '4' : '5'}
                  </span>
                  <h2 className="text-base font-bold text-ink">
                    Quan tâm & Kết nối
                  </h2>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-sm font-semibold text-neutral-800 block mb-1">
                      Hoạt động quan tâm (Chọn ít nhất 1) *
                    </label>
                    <p className="text-[11px] text-neutral-500 mb-2">
                      Chọn các chương trình Quý vị mong muốn kết nối trong khuôn khổ VCF.
                    </p>

                    <div className="space-y-2">
                      {[
                        { id: 'ceo-summit', title: 'CEO Summit', desc: 'Đại hội Thượng đỉnh Lãnh đạo' },
                        { id: 'ceo-forum', title: 'CEO Forum', desc: 'Diễn đàn Chuyên đề Chiến lược' },
                        { id: 'dao-tao-ceo', title: 'Đào tạo CEO', desc: 'Chương trình LGM Mastery & C-Level' },
                        { id: 'tri-thuc', title: 'Kho tri thức VCF', desc: 'Thư viện Nghiên cứu & Kỷ yếu Quản trị' }
                      ].map(act => {
                        const isChecked = formData.interestedActivities.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            onClick={() => toggleInterestedActivity(act.id)}
                            className={`p-3 rounded-xl border text-sm cursor-pointer transition-all flex items-start gap-3 min-h-[48px] ${
                              isChecked
                                ? 'border-brand-primary bg-red-50/70 text-ink shadow-2xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                            }`}
                          >
                            <div
                              className={`size-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                                isChecked
                                  ? 'bg-brand-primary border-brand-primary text-white'
                                  : 'border-neutral-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="size-3 stroke-[3]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`block font-bold leading-tight ${isChecked ? 'text-brand-primary' : 'text-neutral-900'}`}>
                                {act.title}
                              </span>
                              <span className="text-[11px] text-neutral-500 block mt-0.5">
                                {act.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {errors.interestedActivities && (
                      <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.interestedActivities}</p>
                    )}
                  </div>

                  {/* Nguồn tiếp cận (Secondary & Optional) */}
                  <div className="pt-1">
                    <label htmlFor="reg-mobile-leadsource" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Nguồn biết đến VCF (Tùy chọn)
                    </label>
                    <select
                      id="reg-mobile-leadsource"
                      value={formData.leadSource}
                      onChange={(e) => handleFieldChange('leadSource', e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-brand-primary text-neutral-700"
                    >
                      <option value="Giới thiệu từ Hội viên VCF">Giới thiệu từ Hội viên VCF</option>
                      <option value="Báo chí truyền thông (VnExpress, Cafef, Forbes...)">Báo chí truyền thông</option>
                      <option value="Đã từng tham gia sự kiện trước đó của VCF">Đã từng tham gia sự kiện trước</option>
                      <option value="Mạng xã hội (LinkedIn, Facebook, YouTube)">Mạng xã hội (LinkedIn, Facebook)</option>
                      <option value="Lời mời từ Ban Thư ký / Hiệp hội Doanh nghiệp">Lời mời từ Ban Thư ký</option>
                      <option value="Khác">Khác...</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 4: ĐỐI THOẠI CHUYÊN GIA / MENTOR
                ----------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="border-b border-hairline pb-2.5">
                  <span className="text-sm font-sans font-bold text-brand-primary uppercase tracking-wider block" style={{ fontFamily: '"Inter Variable", Arial, sans-serif' }}>
                    Bước 4/{currentUser ? '4' : '5'}
                  </span>
                  <h2 className="text-base font-bold text-ink">
                    Đối thoại chuyên gia
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Thách thức lớn nhất * */}
                  <div>
                    <label htmlFor="reg-mobile-painpoints" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Thách thức lớn nhất của doanh nghiệp *
                    </label>
                    <textarea
                      id="reg-mobile-painpoints"
                      ref={painPointsRef}
                      rows={3}
                      value={formData.businessPainPoints}
                      onInput={handleTextareaAutoGrow}
                      onChange={(e) => handleFieldChange('businessPainPoints', e.target.value)}
                      placeholder="VD: Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng..."
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors resize-none overflow-hidden ${
                        errors.businessPainPoints ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                      }`}
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Nêu vắn tắt thách thức lớn nhất để BTC xếp nhóm bàn tròn thảo luận phù hợp.
                    </p>
                    {errors.businessPainPoints && (
                      <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.businessPainPoints}</p>
                    )}
                  </div>

                  {/* Câu hỏi cho Diễn giả / Mentor (Không bắt buộc) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="reg-mobile-mentorquestion" className="text-sm font-semibold text-neutral-800 block">
                        Câu hỏi cho Diễn giả / Mentor
                      </label>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        Không bắt buộc
                      </span>
                    </div>
                    <textarea
                      id="reg-mobile-mentorquestion"
                      rows={2}
                      value={formData.questionForMentor}
                      onInput={handleTextareaAutoGrow}
                      onChange={(e) => handleFieldChange('questionForMentor', e.target.value)}
                      placeholder="VD: Làm thế nào để duy trì động lực đổi mới sáng tạo trong doanh nghiệp truyền thống?"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-brand-primary resize-none overflow-hidden"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Bạn có thể gửi trước câu hỏi để BTC tổng hợp cho phiên thảo luận.
                    </p>
                  </div>

                  {/* Consent Clean copy */}
                  <div className="pt-2 border-t border-hairline">
                    <label className="flex items-start gap-2.5 text-sm text-neutral-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleFieldChange('agreedToTerms', e.target.checked)}
                        className="mt-0.5 size-4 rounded text-brand-primary focus:ring-brand-primary shrink-0"
                      />
                      <span className="leading-snug">
                        Tôi xác nhận thông tin đã cung cấp là chính xác và đồng ý với Quy chế sinh hoạt VCF.{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTermsModal(!showTermsModal);
                          }}
                          className="text-brand-primary hover:underline font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          Xem Quy chế →
                        </button>
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.agreedToTerms}</p>
                    )}

                    {/* Inline Collapsible Terms */}
                    {showTermsModal && (
                      <div className="mt-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 space-y-1.5 animate-fadeIn font-sans">
                        <strong className="block text-ink font-semibold">Tóm tắt Quy chế sinh hoạt VCF:</strong>
                        <p>1. Thông tin thảo luận trong khán phòng tuân theo Chatham House Rule (được sử dụng tri thức nhưng không trích dẫn định danh người phát biểu).</p>
                        <p>2. Trang phục tham dự Business Formal và xuất trình mã QR cá nhân tại bàn VIP check-in.</p>
                        <p>3. Tôn trọng cam kết thời gian và không chào bán thương mại trực tiếp ngoài khu vực networking.</p>
                      </div>
                    )}
                  </div>

                  {/* Save to Profile (Member only, Secondary) */}
                  {currentUser && (
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-sm">
                      <label className="flex items-start gap-2 text-neutral-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={updateBaseProfile}
                          onChange={(e) => setUpdateBaseProfile(e.target.checked)}
                          className="mt-0.5 size-3.5 rounded text-brand-primary focus:ring-brand-primary shrink-0"
                        />
                        <span className="text-[11px] text-neutral-600 leading-snug">
                          Lưu các thay đổi vào hồ sơ Hội viên
                          <span className="block text-[10px] text-neutral-500 mt-0.5">
                            Hồ sơ gốc sẽ không thay đổi nếu bạn bỏ chọn.
                          </span>
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 5: TẠO TÀI KHOẢN NHANH (Chỉ dành cho Đại biểu CHƯA đăng nhập)
                ----------------------------------------------------------------- */}
            {!currentUser && currentStep === 5 && (
              <div className="space-y-4">
                <div className="border-b border-hairline pb-2.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="size-5 rounded-full bg-red-100 text-brand-primary flex items-center justify-center">
                      <KeyRound className="size-3" />
                    </div>
                  <span className="text-sm font-sans font-bold text-brand-primary uppercase tracking-wider block" style={{ fontFamily: '"Inter Variable", Arial, sans-serif' }}>
                      Bước 5/5
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-ink">
                    Tạo tài khoản nhanh & Nhận vé
                  </h2>
                  <p className="text-xs text-ink-secondary mt-1">
                    Đại biểu: <strong>{formData.fullName || 'Đại biểu'}</strong> ({formData.companyName || 'Doanh nghiệp'}). Vui lòng thiết lập mật khẩu để hoàn tất đăng ký tài khoản Hội viên và nhận mã vé điện tử.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Email nhận vé & đăng nhập */}
                  <div>
                    <label htmlFor="reg-mobile-step5-email" className="text-sm font-semibold text-neutral-800 block mb-1">
                      Email đăng nhập & nhận vé *
                    </label>
                    <input
                      id="reg-mobile-step5-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="VD: ceo@vinasteel.com.vn"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.email}</p>
                    )}

                    {userExists && (
                      <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Email này đã có tài khoản Hội viên VCF.</strong>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            Vui lòng nhập mật khẩu tài khoản để đăng nhập và hoàn tất đăng ký sự kiện.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mật khẩu */}
                  <div>
                    <label htmlFor="reg-mobile-password" className="text-sm font-semibold text-neutral-800 block mb-1">
                      {userExists ? 'Mật khẩu tài khoản *' : 'Mật khẩu mới (tối thiểu 6 ký tự) *'}
                    </label>
                    <div className="relative">
                      <input
                        id="reg-mobile-password"
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors(prev => {
                              const next = { ...prev };
                              delete next.password;
                              return next;
                            });
                          }
                        }}
                        placeholder=""
                        className={`w-full min-h-[44px] px-3.5 py-2.5 pr-11 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                          errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Ẩn mật khẩu (Đang hiện)' : 'Hiện mật khẩu (Đang ẩn)'}
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors cursor-pointer ${
                          showPassword
                            ? 'text-brand-primary bg-red-50 hover:bg-red-100'
                            : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4.5 stroke-[2.2]" />
                        ) : (
                          <Eye className="size-4.5 stroke-[2]" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.password}</p>
                    )}
                  </div>

                  {/* Nhập lại mật khẩu (chỉ khi tạo tài khoản mới) */}
                  {!userExists && (
                    <div>
                      <label htmlFor="reg-mobile-confirm-password" className="text-sm font-semibold text-neutral-800 block mb-1">
                        Xác nhận lại mật khẩu *
                      </label>
                      <div className="relative">
                        <input
                          id="reg-mobile-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          autoComplete="new-password"
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) {
                              setErrors(prev => {
                                const next = { ...prev };
                                delete next.confirmPassword;
                                return next;
                              });
                            }
                          }}
                          placeholder=""
                          className={`w-full min-h-[44px] px-3.5 py-2.5 pr-11 text-sm border rounded-xl bg-white focus:outline-none transition-colors ${
                            errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          title={showConfirmPassword ? 'Ẩn mật khẩu (Đang hiện)' : 'Hiện mật khẩu (Đang ẩn)'}
                          aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors cursor-pointer ${
                            showConfirmPassword
                              ? 'text-brand-primary bg-red-50 hover:bg-red-100'
                              : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4.5 stroke-[2.2]" />
                          ) : (
                            <Eye className="size-4.5 stroke-[2]" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && password === confirmPassword && password.length >= 6 && (
                        <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                          <Check className="size-3.5 shrink-0" />
                          <span>Mật khẩu trùng khớp ✓</span>
                        </p>
                      )}
                      {errors.confirmPassword && (
                        <p className="text-[14px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="size-3" />{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Ghi chú tạo tài khoản */}
                  <div className="bg-neutral-50 border border-hairline rounded-xl p-3 text-[11px] text-ink-secondary flex items-start gap-2">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mật khẩu này sẽ được dùng để đăng nhập Hội viên VCF và theo dõi mã QR check-in sự kiện.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================================
            BRANCH C: MÀN HÌNH THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG (SUCCESS STATE)
            Item 2: Hiển thị đầy đủ thông tin xác nhận đăng ký sự kiện thành công
            ======================================================================= */}
        {isSuccess && (
          <div className="space-y-4 max-w-xl mx-auto py-1 animate-fadeIn">
            {/* KHỐI TRẠNG THÁI HỒ SƠ */}
            <div className="space-y-2.5 pb-2 border-b border-hairline text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
                <Clock className="size-4 text-amber-700 shrink-0 stroke-[2.2]" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  TRẠNG THÁI HỒ SƠ
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                {isWaitlist ? 'Đăng ký đang trong danh sách chờ' : 'Đăng ký đang chờ xét duyệt'}
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-neutral-700">
                {isWaitlist ? (
                  <>Ban Thư ký VCF đã ghi nhận thông tin đăng ký của quý vị vào <strong>Danh sách chờ (Waitlist)</strong> cho sự kiện <strong>{eventTitle}</strong>. Khi có chỗ trống, Ban Thư ký sẽ ưu tiên liên hệ theo thứ tự.</>
                ) : (
                  <>Ban Thư ký đã tiếp nhận đăng ký và đang xác minh tư cách đại biểu của quý vị.</>
                )}
              </p>
            </div>

            {/* KHỐI THÔNG TIN EMAIL: Hộp gửi kết quả */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-left">
              <div className="flex items-start gap-2.5">
                <div className="size-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 shadow-2xs">
                  <Mail className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Kết quả sẽ được gửi đến <strong className="font-semibold text-ink font-mono">{formData.email || currentUser?.email || 'email đại biểu'}</strong>. Sau khi được duyệt, mã QR check-in sẽ xuất hiện trong mục <strong>Hồ sơ của tôi</strong> và được gửi qua email.
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Vui lòng kiểm tra cả hộp thư Spam.
                  </p>
                </div>
              </div>

              {/* Xem trước nội dung Email biên nhận */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                  className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="size-3.5" />
                  <span>{showEmailPreview ? 'Ẩn xem trước email xác nhận' : 'Xem trước nội dung Email biên nhận đã gửi →'}</span>
                  {showEmailPreview ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>

                {showEmailPreview && (
                  <div className="mt-2.5 bg-white border border-neutral-300 rounded-lg p-3 text-xs text-neutral-800 space-y-2 font-sans shadow-inner animate-fadeIn">
                    <div className="flex items-center justify-between pb-1.5 border-b border-hairline text-[11px] text-ink-secondary font-mono">
                      <span>Từ: Ban Thư ký Diễn Đàn CEO Việt Nam &lt;bth@vcf.org.vn&gt;</span>
                      <span className="font-sans font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Đã gửi</span>
                    </div>
                    <div className="text-[11px] text-ink-secondary pb-1 border-b border-neutral-100 font-mono truncate">
                      <span>Đến: {formData.email || currentUser?.email || 'daibieu@enterprise.vn'}</span>
                    </div>
                    <div className="font-semibold text-ink text-xs pt-1">
                      Tiêu đề: [VCF] Tiếp nhận hồ sơ đăng ký tham dự: {eventTitle}
                    </div>
                    <div className="text-[11px] text-neutral-700 space-y-1.5 leading-relaxed pt-1">
                      <p>Kính gửi Đại biểu <strong>{formData.fullName || 'Đại biểu'}</strong> ({formData.jobTitle || 'Lãnh đạo'} - {formData.companyName || 'Doanh nghiệp'}),</p>
                      <p>Ban Thư ký Diễn Đàn CEO Việt Nam (VCF) trân trọng thông báo đã tiếp nhận hồ sơ đăng ký tham dự của Quý vị với <strong>Mã hồ sơ: {regCode}</strong>.</p>
                      <p>Hồ sơ của Quý vị đang được Ban Thư ký thẩm định theo quy chuẩn C-Level. Kết quả xét duyệt kèm Mã QR Check-in chính thức sẽ được gửi tới Quý vị qua email này và số điện thoại <strong>{formData.phone}</strong>.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KHỐI THÔNG TIN ĐÃ KHAI BÁO (ĐẦY ĐỦ 8 TRƯỜNG) */}
            <div className="border border-hairline rounded-xl p-3.5 bg-parchment/90 space-y-2 text-xs font-sans text-left shadow-2xs">
              <div className="text-[11px] font-semibold uppercase text-ink-secondary tracking-wider flex items-center justify-between pb-1.5 border-b border-hairline">
                <span>Thông tin đã khai báo</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Check className="size-3.5" /> Đầy đủ 8 trường
                </span>
              </div>

              <div className="space-y-1.5 text-neutral-700 pt-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-hairline">
                  <span className="text-ink-secondary">Mã hồ sơ tiếp nhận:</span>
                  <span className="font-mono font-bold text-neutral-900 bg-white border border-hairline px-2 py-0.5 rounded text-[11px]">
                    {regCode}
                  </span>
                </div>
                <div>
                  <span className="text-ink-secondary">Đại biểu:</span>{' '}
                  <strong className="text-ink">{formData.jobTitle} - {formData.fullName}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary">Số điện thoại:</span>{' '}
                  <strong className="text-ink font-mono">{formData.phone}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary">Doanh nghiệp:</span>{' '}
                  <strong className="text-ink">{formData.companyName}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary">Lĩnh vực:</span>{' '}
                  <span>{formData.industry}</span>
                </div>
                <div>
                  <span className="text-ink-secondary">Quy mô:</span>{' '}
                  <span>{formData.companySize}</span>
                </div>
                <div>
                  <span className="text-ink-secondary">Vấn đề trọng tâm:</span>{' '}
                  <span className="italic">"{formData.businessPainPoints}"</span>
                </div>
                {formData.questionForMentor && (
                  <div>
                    <span className="text-ink-secondary">Câu hỏi gửi Mentor:</span>{' '}
                    <span className="italic">"{formData.questionForMentor}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* KHỐI NÚT HÀNH ĐỘNG THÀNH CÔNG */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCalendar}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Calendar className="size-4" />
                <span>Thêm vào lịch (Google Calendar)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigateTo('profile');
                }}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>Xem trạng thái hồ sơ</span>
                <ArrowRight className="size-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer border border-neutral-300"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          STICKY BOTTOM ACTION BAR (Unified for Mobile & Desktop)
          ========================================================================= */}
      {!fastTrackMode && !isSuccess && (
        <footer className="sticky bottom-0 z-30 bg-white border-t border-hairline px-4 sm:px-6 py-3 sm:py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0 shadow-lg">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Quay lại"
                title="Quay lại"
                className="size-11 sm:size-12 rounded-xl text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0 border border-neutral-200 shadow-2xs"
              >
                <ArrowLeft className="size-5 stroke-[2.2]" />
              </button>
            ) : (
              <div />
            )}

            <div className="flex-1 sm:flex-initial sm:min-w-[240px] flex justify-end">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto sm:min-w-[200px] min-h-[46px] py-2.5 px-5 rounded-xl text-base sm:text-base font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>Tiếp tục Bước {currentStep + 1}</span>
                  <ArrowRight className="size-4" />
                </button>
              ) : currentStep === 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep4()) {
                      if (currentUser) {
                        handleMemberSubmit();
                      } else {
                        setCurrentStep(5);
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto sm:min-w-[220px] min-h-[46px] py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <span>Đang xử lý...</span>
                  ) : currentUser ? (
                    <>
                      <span>Xác nhận đăng ký</span>
                      <Check className="size-4 stroke-[2.5]" />
                    </>
                  ) : (
                    <>
                      <span>Tiếp tục Bước 5</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              ) : (
                /* Step 5: Quick account creation submit */
                <button
                  type="button"
                  onClick={handleGuestAccountSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto sm:min-w-[240px] min-h-[46px] py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <span>Đang xử lý...</span>
                  ) : (
                    <>
                      <span>{userExists ? 'Đăng nhập & Hoàn tất' : 'Hoàn tất đăng ký & Nhận vé'}</span>
                      <Check className="size-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
      </div>
    </div>
  );
};
