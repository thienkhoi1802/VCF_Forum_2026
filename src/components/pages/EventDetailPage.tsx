import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { MOCK_EVENTS, MOCK_ACTIVITIES } from '../../data/mockData';
import { getComputedEventStatus } from '../../utils/eventWorkflow';
import { StepByStepMemberModal, JOB_TITLE_OPTIONS } from '../common/StepByStepMemberModal';
import { QuickLoginModal } from '../common/QuickLoginModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building,
  Mail,
  Phone,
  QrCode,
  Sparkles,
  BookmarkCheck,
  HelpCircle,
  AlertCircle,
  Check,
  Layers,
  Briefcase,
  Building2,
  RefreshCw,
  Send,
  UserCheck,
  UserPlus,
  LogIn,
  Crown,
  Navigation,
  CalendarPlus,
  Edit3,
  Info,
  XCircle
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { 
    selectedEventId, 
    navigateTo, 
    showSpecAnnotations, 
    isLoggedIn, 
    currentUser, 
    login,
    logout,
    registerForEvent, 
    registerForEventWithDetails,
    approveEventRegistration,
    resetEventRegistration,
    cancelRegistration,
    leaveWaitlist,
    confirmWaitlistPromotion,
    reRegisterEvent,
    registeredEvents,
    simulatedState,
    signupLite,
    showEventSuccessModal,
    showNotification
  } = useApp();

  // Find event or fallback to default summit
  const event = MOCK_EVENTS.find(e => e.id === selectedEventId) || MOCK_EVENTS[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'speakers' | 'tickets' | 'venue' | 'partners'>('overview');
  const [selectedPassType, setSelectedPassType] = useState<'member' | 'standard'>('member');
  
  const isManualScrollingRef = React.useRef(false);
  const manualScrollTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const navContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Modals for step-by-step registration and quick login on the current page
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isWaitlistModal, setIsWaitlistModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Registration form state: Full 8 fields according to PRD + contact info
  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    jobTitle: currentUser?.jobTitle || '',
    companyName: currentUser?.companyName || '',
    industry: currentUser?.industry || 'Sản xuất & Công nghiệp',
    companySize: currentUser?.companySize || '',
    interestedActivities: (currentUser?.interestedActivities as string[]) || [event.activityId || 'ceo-summit', 'ceo-forum'],
    leadSource: currentUser?.leadSource || 'Giới thiệu từ Hội viên VCF',
    businessPainPoints: currentUser?.businessPainPoints || '',
    questionForMentor: currentUser?.questionForMentor || ''
  });

  const [sidebarStep, setSidebarStep] = useState<1 | 2 | 3 | 4>(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [justRegistered, setJustRegistered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [reopenMemberModalAfterLogin, setReopenMemberModalAfterLogin] = useState(false);
  const [isEditingExistingRegistration, setIsEditingExistingRegistration] = useState(false);

  // Tìm sự kiện trước đó đã được người dùng khai báo thông tin đầy đủ để tái sử dụng
  const prevRegistrationWithDetails = registeredEvents.find(
    r => r.details && (r.details.jobTitle || r.details.companyName || r.details.phone || r.details.industry)
  );
  const prevDetails = prevRegistrationWithDetails?.details;

  // Kiểm tra xem người dùng đã từng fill thông tin ở sự kiện nào trước đây chưa (hoặc có sẵn trong hồ sơ)
  const hasPreviouslyFilled = Boolean(
    currentUser ||
    (currentUser?.jobTitle && currentUser?.companyName) ||
    (prevDetails?.jobTitle && prevDetails?.companyName)
  );

  // Sync with currentUser & previous registration when available (Auto-fill on subsequent event registrations or login)
  useEffect(() => {
    if (currentUser) {
      // Tìm sự kiện trước đó có details để autofill nếu trường trong profile còn thiếu
      const prevEvent = registeredEvents.find(
        r => r.details && (r.details.jobTitle || r.details.companyName || r.details.phone || r.details.industry)
      );
      const prevDet = prevEvent?.details;

      setFormData({
        name: currentUser.fullName || prevDet?.name || prevDet?.fullName || 'Phạm Minh Đức',
        email: currentUser.email || prevDet?.email || 'duc.pham@vinasteel.com.vn',
        phone: currentUser.phone || prevDet?.phone || '0912 345 678',
        jobTitle: currentUser.jobTitle || prevDet?.jobTitle || 'Tổng Giám Đốc (CEO)',
        companyName: currentUser.companyName || prevDet?.companyName || 'Công ty Cổ phần Thép VinaSteel',
        industry: currentUser.industry || prevDet?.industry || 'Sản xuất & Công nghiệp chế tạo',
        companySize: currentUser.companySize || prevDet?.companySize || 'Từ 100 - 300 nhân sự',
        interestedActivities: (Array.isArray(currentUser.interestedActivities) && currentUser.interestedActivities.length > 0)
          ? (currentUser.interestedActivities as string[])
          : (prevDet?.interestedActivities as string[]) || [event.activityId || 'ceo-summit', 'ceo-forum'],
        leadSource: currentUser.leadSource || prevDet?.leadSource || 'Giới thiệu từ Hội viên VCF',
        businessPainPoints: currentUser.businessPainPoints || prevDet?.businessPainPoints || 'Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng.',
        questionForMentor: currentUser.questionForMentor || prevDet?.questionForMentor || 'Làm thế nào để duy trì động lực đổi mới sáng tạo trong doanh nghiệp sản xuất truyền thống?'
      });
    } else {
      // Đã đăng xuất -> Hệ thống quay lại từ đầu đăng ký, xóa dữ liệu cũ
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        companyName: '',
        industry: 'Sản xuất & Công nghiệp chế tạo',
        companySize: '',
        interestedActivities: [event.activityId || 'ceo-summit', 'ceo-forum'],
        leadSource: 'Giới thiệu từ Hội viên VCF',
        businessPainPoints: '',
        questionForMentor: ''
      });
      setJustRegistered(false);
      setIsEditingExistingRegistration(false);
      setSidebarStep(1);
      setFormErrors({});
    }
  }, [currentUser, registeredEvents, event.activityId]);

  // Scrollspy effect: automatically update activeTab based on scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isManualScrollingRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          // If scrolled near bottom of page, highlight the last section
          if (scrollY + windowHeight >= docHeight - 80) {
            setActiveTab('partners');
            ticking = false;
            return;
          }

          const sections: { id: 'overview' | 'agenda' | 'speakers' | 'venue' | 'partners'; el: HTMLElement | null }[] = [
            { id: 'overview', el: document.getElementById('section-overview') },
            { id: 'agenda', el: document.getElementById('section-agenda') },
            { id: 'speakers', el: document.getElementById('section-speakers') },
            { id: 'venue', el: document.getElementById('section-venue') },
            { id: 'partners', el: document.getElementById('section-partners') },
          ];

          // Offset threshold below sticky subnav (sticky at top-0, height ~52px)
          const offset = 85;
          let currentTab: 'overview' | 'agenda' | 'speakers' | 'venue' | 'partners' = 'overview';

          for (let i = 0; i < sections.length; i++) {
            const item = sections[i];
            if (item.el) {
              const rect = item.el.getBoundingClientRect();
              if (rect.top <= offset) {
                currentTab = item.id;
              }
            }
          }

          setActiveTab(currentTab);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current);
      }
    };
  }, []);

  // When activeTab changes, auto scroll tab button into view on mobile
  useEffect(() => {
    if (!navContainerRef.current) return;
    const activeButton = navContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement | null;
    if (activeButton) {
      const container = navContainerRef.current;
      const btnLeft = activeButton.offsetLeft;
      const btnRight = btnLeft + activeButton.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;

      if (btnLeft < scrollLeft + 16) {
        container.scrollTo({ left: Math.max(0, btnLeft - 20), behavior: 'smooth' });
      } else if (btnRight > scrollLeft + clientWidth - 16) {
        container.scrollTo({ left: btnRight - clientWidth + 20, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  // Chỉ kiểm tra đơn đăng ký khi user ĐANG ĐĂNG NHẬP. Khi đã đăng xuất, luôn quay về trạng thái chưa đăng ký ban đầu.
  const registeredItem = isLoggedIn ? registeredEvents.find(r => r.eventId === event.id && r.status !== 'cancelled') : undefined;
  const isAlreadyRegistered = Boolean(isLoggedIn && registeredItem);
  const isPendingApproval = Boolean(isLoggedIn && registeredItem?.status === 'pending_approval');
  const isConfirmed = Boolean(isLoggedIn && registeredItem?.status === 'confirmed');
  const isWaitlisted = Boolean(isLoggedIn && registeredItem?.status === 'waitlisted');
  const isFullEffective = event.isFull || simulatedState === 'S-FULL';
  const isPast = event.status === 'past';

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleInterestedActivity = (actId: string) => {
    setFormData(prev => {
      const exists = prev.interestedActivities.includes(actId);
      const updated = exists 
        ? prev.interestedActivities.filter(id => id !== actId)
        : [...prev.interestedActivities, actId];
      return { ...prev, interestedActivities: updated };
    });
    if (formErrors.interestedActivities) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.interestedActivities;
        return next;
      });
    }
  };

  // Step-by-step validations for sidebar 4-step registration
  const validateSidebarStep1 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Vui lòng nhập họ và tên đại biểu';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Vui lòng nhập email nhận vé & thông báo';
    if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại liên hệ';
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Vui lòng nhập chức danh điều hành (VD: CEO / Chủ tịch)';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const validateSidebarStep2 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.companyName.trim()) errors.companyName = 'Vui lòng nhập tên doanh nghiệp / tổ chức';
    if (!formData.industry.trim()) errors.industry = 'Vui lòng chọn hoặc nhập lĩnh vực hoạt động';
    if (!formData.companySize.trim()) errors.companySize = 'Vui lòng nhập quy mô doanh nghiệp (free text)';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const validateSidebarStep3 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.interestedActivities || formData.interestedActivities.length === 0) {
      errors.interestedActivities = 'Vui lòng chọn ít nhất 1 hoạt động quan tâm';
    }
    if (!formData.leadSource.trim()) errors.leadSource = 'Vui lòng cho biết nguồn biết đến VCF';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const validateSidebarStep4 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.businessPainPoints.trim()) errors.businessPainPoints = 'Vui lòng mô tả ngắn vấn đề hoặc nhu cầu trọng tâm của doanh nghiệp';
    if (!formData.questionForMentor.trim()) errors.questionForMentor = 'Vui lòng nhập câu hỏi dành cho diễn giả / chuyên gia';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const isAllSidebarStepsValid = Boolean(
    formData.name?.trim() &&
    formData.email?.trim() &&
    formData.phone?.trim() &&
    formData.jobTitle?.trim() &&
    formData.companyName?.trim() &&
    formData.industry?.trim() &&
    formData.companySize?.trim() &&
    formData.interestedActivities && formData.interestedActivities.length > 0 &&
    formData.leadSource?.trim() &&
    formData.businessPainPoints?.trim() &&
    formData.questionForMentor?.trim()
  );

  const handleNextSidebarStep = (step: 1 | 2 | 3) => {
    if (step === 1 && validateSidebarStep1()) {
      setSidebarStep(2);
    } else if (step === 2 && validateSidebarStep2()) {
      setSidebarStep(3);
    } else if (step === 3 && validateSidebarStep3()) {
      setSidebarStep(4);
    }
  };

  const handleRegisterSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isFullEffective && !isAlreadyRegistered) return;

    // Validate current step 4 and previous steps
    if (!validateSidebarStep1()) {
      setSidebarStep(1);
      return;
    }
    if (!validateSidebarStep2()) {
      setSidebarStep(2);
      return;
    }
    if (!validateSidebarStep3()) {
      setSidebarStep(3);
      return;
    }
    if (!validateSidebarStep4()) {
      setSidebarStep(4);
      return;
    }

    setFormErrors({});
    const success = registerForEventWithDetails({
      eventId: event.id,
      eventTitle: event.title,
      activityName: event.activityName,
      datetime: event.datetime,
      location: event.location,
      passType: selectedPassType,
      isWaitlist: false,
      details: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        interestedActivities: formData.interestedActivities as any,
        leadSource: formData.leadSource,
        businessPainPoints: formData.businessPainPoints,
        questionForMentor: formData.questionForMentor
      }
    });

    if (success) {
      setJustRegistered(true);
      setIsEditingExistingRegistration(false);
    }
  };

  const handleWaitlistSubmit = () => {
    const success = registerForEventWithDetails({
      eventId: event.id,
      eventTitle: event.title,
      activityName: event.activityName,
      datetime: event.datetime,
      location: event.location,
      passType: 'standard',
      isWaitlist: true,
      details: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jobTitle: formData.jobTitle || 'Lãnh đạo doanh nghiệp',
        companyName: formData.companyName || 'Doanh nghiệp đại biểu',
        industry: formData.industry,
        companySize: formData.companySize,
        interestedActivities: formData.interestedActivities as any,
        leadSource: formData.leadSource,
        businessPainPoints: formData.businessPainPoints,
        questionForMentor: formData.questionForMentor
      }
    });

    if (success) {
      setJustRegistered(true);
      setIsEditingExistingRegistration(false);
    }
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToSection = (tab: 'overview' | 'agenda' | 'speakers' | 'tickets' | 'venue' | 'partners') => {
    setActiveTab(tab);
    isManualScrollingRef.current = true;
    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }
    // Release manual scroll lock after smooth scroll animation completes (~800ms)
    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 800);

    const targetId = tab === 'tickets' ? 'section-tickets' : `section-${tab}`;
    const element = document.getElementById(targetId) || document.getElementById('registration-form-container');
    if (element) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      // Offset: In-page sticky subnav (~52px) + 16px buffer
      const headerOffset = isMobile ? 60 : 72;
      const elementPosition = element.getBoundingClientRect().top;
      const targetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `Sự kiện: ${event.title}\nĐơn vị tổ chức: Diễn Đàn CEO Việt Nam (VCF)\nĐịa điểm: ${event.location}\nChương trình quy tụ các chuyên gia kinh tế, nhà hoạch định chính sách và lãnh đạo C-Level hàng đầu.\nThông tin & check-in: ${window.location.href}`
    );
    const location = encodeURIComponent(event.location);
    // Summit date: 15/10/2026 from 08:00 to 17:30 ICT (UTC+7 -> 01:00Z to 10:30Z)
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261015T010000Z/20261015T103000Z&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
    setShowCalendarMenu(false);
  };

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Diễn Đàn CEO Việt Nam//VCF Events//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id || 'ceo-summit-2026'}-20261015@vcf.org.vn`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'DTSTART:20261015T010000Z',
      'DTEND:20261015T103000Z',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:Sự kiện ${event.title} do Diễn Đàn CEO Việt Nam (VCF) tổ chức. Địa điểm: ${event.location}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id || 'vcf-ceo-summit-2026'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowCalendarMenu(false);
  };

  const faqs = [
    {
      q: 'Hội viên chính thức của VCF có cần trả phí vé tham dự không?',
      a: 'Hoàn toàn KHÔNG. Theo điều lệ VCF, toàn bộ Hội viên chính thức đã đóng hội phí năm được cấp 01 vé VIP Pass miễn phí (trị giá 12.500.000 VNĐ) bao gồm chỗ ngồi ưu tiên tại khán phòng chính, trọn bộ tài liệu học thuật và quyền tham dự Tiệc trưa Networking C-Level cùng các diễn giả.'
    },
    {
      q: 'Đại biểu chưa là hội viên có thể đăng ký tham gia không?',
      a: 'Có. Đại biểu chưa phải là hội viên có thể đăng ký theo hình thức "Vé Đại biểu Tiêu chuẩn (Standard Pass)". Ngoài ra, quý đại biểu có thể hoàn tất thủ tục Đăng ký Hội viên VCF ngay hôm nay để nhận quyền lợi tham gia miễn phí cùng toàn bộ quyền lợi kết nối thường niên.'
    },
    {
      q: 'Quy trình nhận vé và Check-in tại sự kiện diễn ra như thế nào?',
      a: 'Sau khi hoàn tất đăng ký trực tuyến, hệ thống sẽ gửi Email xác nhận kèm mã QR Check-in cá nhân hoá. Khi đến Trung tâm Hội nghị Quốc gia, quý đại biểu chỉ cần xuất trình mã QR tại Bàn tiếp đón VIP để nhận Thẻ Đại biểu chính thức và bộ tài liệu sự kiện.'
    },
    {
      q: 'Sự kiện có phiên dịch song ngữ hay hỗ trợ đại biểu nước ngoài không?',
      a: 'Chương trình được dẫn dắt bằng Tiếng Việt và trang bị hệ thống tai nghe dịch song song (Cabin Interpretation) Tiếng Anh - Tiếng Việt chất lượng cao tại toàn bộ các phiên hội trường chính.'
    }
  ];

  return (
    <div className="bg-parchment min-h-screen pb-24 font-sans text-ink">
      {/* Spec Annotation if enabled */}
      {showSpecAnnotations && (
        <div className="bg-neutral-100 border-b border-hairline px-4 py-2 text-xs font-mono text-neutral-700 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C5.1: Chi tiết Sự kiện [Cấu trúc chuẩn WAN-IFRA Summit / Congress]" type="page" />
            <SpecBadge label="Reference: latam-media-leaders-summit-2026 & distripress-congress-2026" type="source" />
          </div>
          <span className="text-ink-secondary">
            Event ID: {event.id} • {isAlreadyRegistered ? '[ĐÃ ĐĂNG KÝ]' : '[CHƯA ĐĂNG KÝ]'}
          </span>
        </div>
      )}

      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-5 pb-2">
        <Breadcrumb 
          items={[
            { label: 'Lịch sự kiện VCF', route: 'events' },
            { label: event.title }
          ]} 
        />
      </div>

      {/* =========================================================================
          HERO BANNER (WAN-IFRA Summit Style)
          ========================================================================= */}
      <section className="bg-surface-dark text-white relative overflow-hidden">
        {/* Full-width Event Photo Ambient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src={event.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=86'}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/68" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="max-w-4xl space-y-6">
            {/* Event Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider bg-brand-primary text-white px-3.5 py-1 rounded-full shadow-xs">
                {event.activityName}
              </span>

              {/* Event Status Badges */}
              {isPast ? (
                isConfirmed ? (
                  <span className="text-xs font-semibold text-neutral-200 bg-neutral-800 border border-neutral-600 px-3.5 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ĐÃ THAM DỰ (VÉ ĐÃ SỬ DỤNG)
                  </span>
                ) : (isPendingApproval || isWaitlisted) ? (
                  <span className="text-xs font-semibold text-amber-300 bg-amber-950/90 border border-amber-500/50 px-3.5 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    SỰ KIỆN ĐÃ KẾT THÚC
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-neutral-300 bg-neutral-800 border border-neutral-700 px-3.5 py-1 rounded-full">
                    SỰ KIỆN ĐÃ KẾT THÚC
                  </span>
                )
              ) : isConfirmed ? (
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-900/90 border border-emerald-500/50 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ĐÃ ĐƯỢC DUYỆT (MÃ QR SẴN SÀNG)
                </span>
              ) : isPendingApproval ? (
                <span className="text-xs font-semibold text-amber-300 bg-amber-950/90 border border-amber-500/50 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  ĐANG CHỜ DUYỆT
                </span>
              ) : isWaitlisted ? (
                <span className="text-xs font-semibold text-amber-300 bg-amber-950/90 border border-amber-500/50 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  DANH SÁCH CHỜ (WAITLIST)
                </span>
              ) : isFullEffective ? (
                <span className="text-xs font-semibold text-rose-300 bg-rose-950/90 border border-rose-600/70 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  HẾT CHỖ (ĐĂNG KÝ CHỜ)
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Còn chỗ ({event.availableSeats}/{event.totalSeats})
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold tracking-[-0.04em] leading-[1.05] text-white font-sans">
              {event.title}
            </h1>

            {/* Tối giản thông tin Thời gian & Địa điểm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Thời gian */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center shrink-0 text-brand-primary mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Thời gian diễn ra
                  </div>
                  <div className="font-semibold text-white text-sm sm:text-base mt-0.5">
                    {event.datetime}
                  </div>
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 transition-colors cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Thêm vào lịch</span>
                      <ChevronDown className="w-3 h-3 text-neutral-400" />
                    </button>

                    {showCalendarMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setShowCalendarMenu(false)} 
                        />
                        <div className="absolute left-0 top-full mt-1.5 w-52 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1.5 z-30 text-xs font-sans">
                          <button
                            type="button"
                            onClick={handleAddToGoogleCalendar}
                            className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-neutral-800 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="font-semibold">Google Calendar</span>
                            </div>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadIcs}
                            className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-neutral-800 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="font-semibold">Apple / Outlook (.ics)</span>
                            </div>
                            <Download className="w-3 h-3 text-neutral-400" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Địa điểm */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center shrink-0 text-brand-primary mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Địa điểm tổ chức
                  </div>
                  <div className="font-semibold text-white text-sm sm:text-base mt-0.5">
                    {event.location}
                  </div>
                  <div className="mt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || 'Trung tâm Hội nghị Quốc gia, Đại lộ Thăng Long, Hà Nội')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Chỉ đường Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400 opacity-80" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CustomButton
                variant={
                  isPast
                    ? 'secondary'
                    : registeredItem?.status === 'confirmed'
                    ? 'success'
                    : (isFullEffective || registeredItem?.status === 'waitlisted')
                    ? 'gray'
                    : 'primary'
                }
                size="lg"
                onClick={() => {
                  if (isPast) {
                    scrollToSection('overview');
                  } else if (isAlreadyRegistered) {
                    scrollToSection('tickets');
                  } else if (isFullEffective) {
                    setIsWaitlistModal(true);
                    setIsMemberModalOpen(true);
                  } else {
                    setIsWaitlistModal(false);
                    setIsMemberModalOpen(true);
                  }
                }}
                className={isPast ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : ''}
              >
                {isPast
                  ? 'Sự kiện đã kết thúc'
                  : registeredItem?.status === 'confirmed'
                  ? 'Đã xác nhận tham dự'
                  : registeredItem?.status === 'pending_approval'
                  ? 'Đang chờ Ban tổ chức duyệt'
                  : registeredItem?.status === 'waitlisted'
                  ? `Đang trong danh sách chờ (#${registeredItem?.waitlistPosition ? String(registeredItem.waitlistPosition).padStart(2, '0') : '07'})`
                  : isFullEffective
                  ? 'Đăng ký danh sách chờ'
                  : 'Đăng ký sự kiện ngay'}
              </CustomButton>

              <button
                onClick={() => scrollToSection('agenda')}
                className="px-5 py-3 rounded-full text-xs font-semibold border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-neutral-300" />
                <span>Xem khung chương trình</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-4 py-3 rounded-full text-xs font-medium border border-neutral-700 hover:border-neutral-500 text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sao chép liên kết sự kiện"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STICKY IN-PAGE NAVIGATION (Menu cấp 2 - Sticky top-0 when scrolling)
          ========================================================================= */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-hairline shadow-xs transition-shadow">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-1 gap-1">
            {/* Back button to events list */}
            <div className="flex items-center gap-1.5 shrink-0 pr-2 sm:pr-3 border-r border-hairline my-1">
              <button
                type="button"
                onClick={() => navigateTo('events')}
                className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-brand-primary transition-colors py-1.5 px-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                title="Quay lại danh sách sự kiện"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sự kiện</span>
              </button>
            </div>

            {/* Scrollable Tabs */}
            <div ref={navContainerRef} className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-1">
              {[
                { id: 'overview', label: 'Tổng quan' },
                { id: 'agenda', label: 'Chương trình nghị sự' },
                { id: 'speakers', label: 'Diễn giả & Cố vấn' },
                { id: 'venue', label: 'Địa điểm & Di chuyển' },
                { id: 'partners', label: 'Ban tổ chức & Đối tác' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => scrollToSection(tab.id as any)}
                  className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-ink-secondary hover:text-ink hover:border-neutral-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Action button */}
            <div className="flex items-center pl-2 sm:pl-4 border-l border-hairline py-1 shrink-0">
              <CustomButton
                variant={isPast ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => {
                  if (isPast) {
                    scrollToSection('overview');
                  } else if (isAlreadyRegistered) {
                    scrollToSection('tickets');
                  } else if (isFullEffective) {
                    setIsWaitlistModal(true);
                    setIsMemberModalOpen(true);
                  } else {
                    setIsWaitlistModal(false);
                    setIsMemberModalOpen(true);
                  }
                }}
              >
                {isPast
                  ? 'Xem tài liệu'
                  : registeredItem?.status === 'confirmed'
                  ? 'Xem vé'
                  : registeredItem?.status === 'pending_approval'
                  ? 'Chờ duyệt'
                  : registeredItem?.status === 'waitlisted'
                  ? 'DS chờ'
                  : isFullEffective
                  ? 'DS chờ'
                  : 'Đăng ký vé'}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTENT AREA (2 Columns WAN-IFRA Layout)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =====================================================================
              LEFT COLUMN: DETAILED SECTIONS (~7 COLS)
              ===================================================================== */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* SECTION 1: TỔNG QUAN & NỘI DUNG TRỌNG TÂM */}
            <section id="section-overview" className="bg-white border border-hairline rounded-xl p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-16 sm:scroll-mt-20">
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-brand-primary">
                  Giới thiệu tổng quan
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-1">
                  Về {event.activityName}
                </h2>
              </div>

              <div className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-neutral-700 space-y-4">
                <p>
                  {event.description}
                </p>
                {event.subtitle && <p>{event.subtitle}</p>}
              </div>

              {/* Target Audience */}
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-primary" />
                  Đối tượng tham dự mục tiêu
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 font-medium">
                  {(event.targetAudience || []).map((audience) => (
                    <li key={audience} className="flex items-center gap-2 p-2 bg-parchment rounded-md">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* SECTION 2: CHƯƠNG TRÌNH NGHỊ SỰ CHI TIẾT */}
            <section id="section-agenda" className="bg-white border border-hairline rounded-xl p-6 sm:p-8 shadow-xs space-y-5 scroll-mt-16 sm:scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[11px] uppercase font-semibold tracking-wider text-brand-primary">
                    Chương trình nghị sự
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-1">
                    Khung Chương Trình Chi Tiết
                  </h2>
                </div>

                <button
                  onClick={() => alert('Đang tạo và tải về tài liệu Agenda PDF bản chuẩn in ấn (5.2 MB)...')}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 hover:border-black rounded-lg text-xs font-semibold transition-all bg-parchment hover:bg-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-ink-secondary" />
                  <span>Tải Agenda (PDF)</span>
                </button>
              </div>

              {/* Agenda Timeline: chỉ tiêu đề chính + kèm thời gian + Diễn giả */}
              <div className="space-y-3 pt-1">
                {event.agenda.map((item, i) => (
                  <div key={i} className="border border-hairline rounded-lg p-4 hover:border-brand-primary transition-colors bg-parchment/50 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span className="font-mono text-xs font-semibold text-ink">{item.time}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-ink leading-snug">
                      {item.topic}
                    </h4>

                    {item.presenter && (
                      <div className="pt-1 flex items-center gap-2 text-xs text-neutral-700">
                        <span className="text-ink-secondary font-medium">Diễn giả:</span>
                        <strong className="text-ink">{item.presenter}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: DIỄN GIẢ & KHÁCH MỜI DANH DỰ (Avatar + Tên + Chức vụ) */}
            <section id="section-speakers" className="bg-white border border-hairline rounded-xl p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-16 sm:scroll-mt-20">
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-brand-primary">
                  Diễn giả & Chuyên gia
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-1">
                  Đội Ngũ Diễn Giả Hàng Đầu
                </h2>
                <p className="text-xs text-ink-secondary mt-1 font-sans">
                  Quy tụ các nhà hoạch định chính sách, chuyên gia kinh tế và lãnh đạo doanh nghiệp xuất sắc
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((spk, idx) => (
                  <div key={spk.name} className="border border-hairline rounded-lg p-4 flex items-center gap-4 bg-parchment hover:bg-white hover:border-brand-primary transition-all group">
                    <div className="w-14 h-14 rounded-full bg-neutral-200 border-2 border-white shadow-xs shrink-0 flex items-center justify-center font-semibold text-base text-neutral-700 group-hover:bg-brand-primary group-hover:text-white transition-colors overflow-hidden">
                      {spk.avatarUrl ? <img src={spk.avatarUrl} alt="" className="h-full w-full object-cover" /> : spk.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-ink leading-tight group-hover:text-brand-primary transition-colors">
                        {spk.name}
                      </h4>
                      <div className="text-xs text-ink-secondary font-medium leading-snug">
                        {spk.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: ĐỊA ĐIỂM (Chỉ giữ địa điểm + button Điều hướng Google Maps) */}
            <section id="section-venue" className="bg-white border border-hairline rounded-xl p-6 sm:p-8 shadow-xs space-y-4 scroll-mt-16 sm:scroll-mt-20">
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-brand-primary">
                  Địa điểm
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-1">
                  Địa Điểm Tổ Chức
                </h2>
              </div>

              <div className="border border-hairline rounded-lg p-5 bg-parchment flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-base text-ink">{event.venueDetails?.hall || event.location}</div>
                    <div className="text-xs text-ink-secondary mt-0.5">
                      {event.venueDetails?.address || event.location}
                    </div>
                    {event.venueDetails?.notes && <div className="text-xs text-ink-secondary mt-1">{event.venueDetails.notes}</div>}
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover transition-colors shadow-xs shrink-0 cursor-pointer w-fit"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Điều hướng Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </section>

            {/* SECTION 5: ĐƠN VỊ CHỦ TRÌ & NHÀ TÀI TRỢ (Chỉ listing các nhà tài trợ + cắt giảm text tối đa) */}
            <section id="section-partners" className="bg-white border border-hairline rounded-xl p-6 sm:p-8 shadow-xs space-y-5 scroll-mt-16 sm:scroll-mt-20">
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-brand-primary">
                  Hệ sinh thái đồng hành
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-1">
                  Đơn Vị Chủ Trì & Nhà Tài Trợ
                </h2>
              </div>

              <div className="space-y-3">
                {/* Đơn vị chủ trì */}
                <div className="border border-hairline rounded-lg p-3.5 bg-parchment flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-primary text-white rounded-md flex items-center justify-center font-semibold text-sm shrink-0">
                      VCF
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Đơn vị chủ trì</span>
                      <strong className="text-sm font-semibold text-ink">Diễn Đàn CEO Việt Nam (Vietnam CEO Forum)</strong>
                    </div>
                  </div>
                </div>

                {/* Listing Nhà tài trợ & Đối tác */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {[
                    { tier: 'Bảo trợ học thuật', name: 'Viện Quản trị LGM' },
                    { tier: 'Bảo trợ truyền thông', name: 'VnExpress' },
                    { tier: 'Tài trợ Kim Cương', name: 'VinaSteel Corp' },
                    { tier: 'Tài trợ Vàng', name: 'Techcombank' },
                    { tier: 'Tài trợ Vàng', name: 'FPT Corporation' },
                    { tier: 'Đối tác Công nghệ', name: 'Viettel Solutions' },
                    { tier: 'Tài trợ Bạc', name: 'Thaco Group' },
                    { tier: 'Đồng hành', name: 'PTIT Academy' }
                  ].map((sponsor, idx) => (
                    <div key={idx} className="border border-hairline rounded-lg p-3 bg-white hover:border-brand-primary transition-colors text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        {sponsor.tier}
                      </span>
                      <span className="text-xs font-semibold text-ink block">
                        {sponsor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 6: CÂU HỎI THƯỜNG GẶP (FAQ) */}
            <section className="bg-white border border-hairline rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-brand-primary">
                  Hỏi đáp
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-1">
                  Câu Hỏi Thường Gặp Của Đại Biểu
                </h2>
              </div>

              <div className="divide-y divide-neutral-200">
                {faqs.map((faq, index) => (
                  <div key={index} className="py-3">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full text-left flex items-center justify-between font-semibold text-sm text-ink hover:text-brand-primary transition-colors py-1 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaqIndex === index && (
                      <p className="text-xs text-ink-secondary leading-relaxed pt-2 pl-6 font-sans">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* =====================================================================
              RIGHT COLUMN: STICKY REGISTRATION & PASS WIDGET (~5 COLS)
              (WAN-IFRA Ticket Booking on-page, No popup needed!)
              ===================================================================== */}
          <div id="section-tickets" className="lg:col-span-4 lg:sticky lg:top-20 space-y-6 self-start scroll-mt-16 sm:scroll-mt-20 z-10">
            
            {/* Registration Card */}
            <div id="registration-form-container" className="bg-white border-2 border-neutral-900 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden scroll-mt-16 sm:scroll-mt-20">
              <div className={`absolute top-0 right-0 text-white text-[10px] font-semibold px-3 py-1 rounded-bl-lg uppercase tracking-wider ${
                isPast 
                  ? 'bg-neutral-700' 
                  : isConfirmed 
                  ? 'bg-emerald-600' 
                  : isPendingApproval 
                  ? 'bg-amber-600' 
                  : isWaitlisted 
                  ? 'bg-amber-500' 
                  : isFullEffective 
                  ? 'bg-neutral-800' 
                  : 'bg-brand-primary'
              }`}>
                {isPast 
                  ? 'Đã kết thúc' 
                  : isConfirmed 
                  ? 'Đã xác nhận' 
                  : isPendingApproval 
                  ? 'Đang chờ duyệt' 
                  : isWaitlisted 
                  ? 'Danh sách chờ' 
                  : isFullEffective 
                  ? 'Đã đầy chỗ' 
                  : 'Mở đăng ký'}
              </div>

              <div className="space-y-1 mb-5">
                <h3 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-primary" />
                  {isPast
                    ? 'Sự Kiện Đã Kết Thúc'
                    : isConfirmed 
                    ? 'Thẻ Vé Đại Biểu' 
                    : isPendingApproval 
                    ? 'Tình Trạng Hồ Sơ Đăng Ký' 
                    : isWaitlisted
                    ? 'Danh Sách Chờ Tham Dự'
                    : isFullEffective
                    ? 'Sự Kiện Đã Kín Chỗ'
                    : 'Đăng Ký Tham Dự Sự Kiện'}
                </h3>
                <p className="text-xs text-ink-secondary font-sans">
                  {isPast
                    ? `Sự kiện đã diễn ra vào ngày ${event.datetime}. Cổng đăng ký trực tuyến đã đóng.`
                    : isConfirmed
                    ? 'Xuất trình mã QR tại Bàn tiếp đón VIP để check-in'
                    : isPendingApproval
                    ? 'Yêu cầu tham dự đang được Ban Thư ký VCF xem xét và thẩm định'
                    : isWaitlisted
                    ? 'Quý vị đã được ghi danh vào danh sách chờ. Ban Thư ký sẽ liên hệ khi có chỗ trống.'
                    : isFullEffective
                    ? 'Khán phòng đã kín chỗ. Quý vị vui lòng đăng ký vào Danh sách chờ.'
                    : 'Bấm "Đăng ký sự kiện ngay" để mở form đăng ký tham dự.'}
                </p>
              </div>

              {/* =========================================================
                  STATE 0: PAST EVENT (Đã diễn ra)
                  ========================================================= */}
              {isPast ? (
                <div className="space-y-4">
                  <div className="bg-parchment border border-hairline rounded-xl p-5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-neutral-900">
                        Chương Trình Đã Tổ Chức Thành Công
                      </div>
                      <p className="text-xs text-ink-secondary font-sans leading-relaxed mt-1">
                        Sự kiện đã diễn ra vào ngày <strong>{event.datetime}</strong> tại <strong>{event.location}</strong> với sự hiện diện của đông đảo lãnh đạo C-Level.
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-hairline text-xs text-left space-y-2 text-neutral-700">
                      <div className="font-semibold text-neutral-900 pb-1 border-b border-neutral-100 flex items-center justify-between">
                        <span>Tài nguyên & Kỷ yếu lưu trữ:</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">Sẵn sàng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Báo cáo đúc kết & Kỷ yếu hội nghị</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Bộ ảnh lưu niệm & Video clip toàn cảnh</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Slide bài giảng & Tài liệu thuyết trình diễn giả</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 px-4 bg-neutral-200 text-ink-secondary font-semibold rounded-lg text-xs cursor-not-allowed text-center"
                      >
                        Sự kiện đã kết thúc
                      </button>
                      <CustomButton
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => navigateTo('knowledge')}
                      >
                        Xem tài liệu / kỷ yếu sự kiện →
                      </CustomButton>
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => navigateTo('events')}
                      >
                        Khám phá sự kiện sắp diễn ra
                      </CustomButton>
                    </div>
                  </div>
                </div>
              ) : (isConfirmed && !isEditingExistingRegistration) ? (
                /* =========================================================
                   STATE 1 (Priority): CONFIRMED (Đã xác nhận / Đã duyệt - Có QR Code)
                   ========================================================= */
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-emerald-950">
                        Xác Nhận Giữ Chỗ Thành Công!
                      </div>
                      <p className="text-xs text-emerald-800 font-sans leading-relaxed mt-1">
                        Ban Thư ký VCF đã phê duyệt tư cách tham dự. Thẻ đại biểu điện tử đã được ghi nhận vào hồ sơ và gửi về email: <strong>{formData.email || currentUser?.email}</strong>
                      </p>
                    </div>

                    {/* Official QR Code with Ticket ID */}
                    <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block mx-auto shadow-sm">
                      <QrCode className="w-32 h-32 text-ink mx-auto" />
                      <div className="text-[11px] font-mono font-semibold text-neutral-800 mt-2 bg-neutral-100 py-1 px-2.5 rounded border border-hairline">
                        Mã vé: VCF-TICKET-{event.id.toUpperCase()}-{selectedPassType === 'member' ? 'VIP' : 'STD'}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider mt-1">
                        {selectedPassType === 'member' ? 'Vé VIP Hội Viên VCF (Miễn phí)' : 'Vé Đại Biểu Tiêu Chuẩn'}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <CustomButton
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => navigateTo('profile')}
                      >
                        Xem trong Hồ sơ cá nhân
                      </CustomButton>

                      <button
                        onClick={() => alert('Đang tạo và tải Thẻ Đại Biểu PDF kèm mã QR Check-in chính thức...')}
                        className="text-xs text-ink-secondary hover:text-ink font-semibold underline py-1 cursor-pointer"
                      >
                        Tải thẻ vé điện tử (PDF)
                      </button>

                      <button
                        type="button"
                        onClick={() => resetEventRegistration(event.id)}
                        className="text-[11px] text-ink-secondary hover:text-red-600 pt-1 underline cursor-pointer"
                      >
                        Làm mới để thử lại luồng đăng ký
                      </button>
                    </div>
                  </div>
                </div>
              ) : (isPendingApproval && !isEditingExistingRegistration) ? (
                /* =========================================================
                   STATE 2 (Priority): PENDING APPROVAL (Đang chờ duyệt)
                   ========================================================= */
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                          Trạng thái hồ sơ
                        </span>
                        <h4 className="text-sm font-semibold text-amber-950 mt-0.5">
                          Đang Chờ Ban Thư Ký Duyệt
                        </h4>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-lg p-3 border border-amber-200 text-xs text-amber-900 font-sans leading-relaxed">
                      <p className="font-medium">
                        Yêu cầu tham dự của quý vị đang được Ban Thư ký VCF xem xét và xác minh tư cách đại biểu. Khi được phê duyệt, hệ thống sẽ gửi email xác nhận kèm <strong>Mã QR Check-in</strong> chính thức vào khán phòng.
                      </p>
                    </div>

                    <div className="text-[11px] text-amber-800 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>Lưu ý:</strong> Mã QR Check-in sẽ được cấp tự động tại mục này ngay khi Ban Thư ký phê duyệt.
                      </span>
                    </div>
                  </div>

                  {/* Actions & Simulator */}
                  <div className="pt-1 space-y-2">
                    {/* Simulator */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-primary flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Mô phỏng Ban Thư ký duyệt:
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-secondary font-sans">
                        Bấm nút dưới đây để mô phỏng phê duyệt ngay lập tức và xem hiển thị Mã QR Check-in chính thức:
                      </p>
                      <CustomButton
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => approveEventRegistration(registeredItem.id)}
                        className="font-semibold py-2 shadow-xs"
                      >
                        ⚡ Phê duyệt yêu cầu tham dự ngay
                      </CustomButton>
                    </div>

                    <div className="flex gap-2">
                      {/* Nút Hủy đăng ký theo Spec 3.2 */}
                      <button
                        type="button"
                        onClick={() => {
                          if (registeredItem) {
                            cancelRegistration(registeredItem.id);
                          } else {
                            resetEventRegistration(event.id);
                          }
                        }}
                        className="flex-1 py-2 px-3 text-xs border border-red-200 text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        Hủy đăng ký
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateTo('profile')}
                        className="flex-1 py-2 px-3 text-xs bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Xem trong Hồ sơ →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (isWaitlisted && !isEditingExistingRegistration) ? (
                /* =========================================================
                   STATE 3: WAITLISTED (Hàng chờ)
                   ========================================================= */
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-semibold text-base text-amber-950">
                      Đang Trong Danh Sách Chờ (Waitlist)
                    </div>
                    <p className="text-xs text-amber-800 font-sans leading-relaxed mt-1">
                      Quý vị đã được ghi danh vào danh sách chờ sự kiện. Ban Thư ký sẽ thông báo qua email ngay khi có đại biểu hủy chỗ.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-200 inline-block mx-auto text-xs text-amber-900 font-mono font-semibold">
                    Thứ tự: #{registeredItem?.waitlistPosition ? String(registeredItem.waitlistPosition).padStart(2, '0') : '07'} (Đang ưu tiên Hội viên)
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => registeredItem && confirmWaitlistPromotion(registeredItem.id)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>⚡ Mô phỏng: Có chỗ trống & Giữ chỗ</span>
                    </button>
                    <CustomButton
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => navigateTo('profile')}
                    >
                      Xem trong Hồ sơ cá nhân
                    </CustomButton>
                    <button
                      type="button"
                      onClick={() => {
                        if (registeredItem) {
                          leaveWaitlist(registeredItem.id);
                        } else {
                          resetEventRegistration(event.id);
                        }
                      }}
                      className="w-full py-2 px-3 text-xs border border-red-200 text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Hủy đăng ký danh sách chờ</span>
                    </button>
                  </div>
                </div>
              ) : isFullEffective ? (
                /* =========================================================
                   STATE 4: FULL -> WAITLIST CTA
                   ========================================================= */
                <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-6 text-center space-y-3">
                  <div className="font-semibold text-base text-ink">
                    Sự Kiện Đã Đạt Số Lượng Đại Biểu Tối Đa
                  </div>
                  <p className="text-xs text-ink-secondary font-sans leading-relaxed">
                    Khán phòng đã được đăng ký kín. Quý vị vui lòng đăng ký danh sách chờ (Waitlist) để nhận thông báo sớm khi có đại biểu thay đổi lịch.
                  </p>
                  <CustomButton
                    variant="gray"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setIsWaitlistModal(true);
                      setIsMemberModalOpen(true);
                    }}
                  >
                    Đăng ký danh sách chờ
                  </CustomButton>
                </div>
              ) : !isEditingExistingRegistration ? (
                /* =========================================================
                   STATE 5: EVENT REGISTRATION CTA (FOR ALL USERS)
                   - Show VIP Member Pass privilege
                   - Single clean primary CTA: "Đăng ký sự kiện ngay"
                   ========================================================= */
                <div className="space-y-4">
                  {/* Pass Type Preview */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-800 block">
                      Đặc quyền loại vé tham dự:
                    </label>

                    {/* VIP Member Pass Preview */}
                    <div className="p-3.5 border-2 border-brand-primary/30 bg-red-50/40 rounded-xl relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-semibold text-xs text-ink">Vé VIP Hội Viên VCF</span>
                        </div>
                        <span className="text-xs font-semibold text-brand-primary bg-white px-2 py-0.5 rounded border border-red-200">
                          MIỄN PHÍ
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-secondary mt-1.5 font-sans space-y-0.5">
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Hàng ghế VIP khán phòng chính</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>Tiệc trưa Networking C-Level cùng diễn giả</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>Trọn bộ slide tài liệu & kỷ yếu nghiên cứu</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Single CTA Action Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWaitlistModal(false);
                        setIsMemberModalOpen(true);
                      }}
                      className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <span>Đăng ký sự kiện ngay</span>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                /* =========================================================
                   STATE 6: EDIT EXISTING REGISTRATION FORM
                   ========================================================= */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Top Bar for Inline Form */}
                  <div className="flex items-center justify-between pb-1 border-b border-hairline">
                    <span className="text-xs font-semibold text-neutral-800">Chỉnh sửa thông tin 4 bước</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingExistingRegistration(false);
                      }}
                      className="text-[11px] text-ink-secondary hover:text-neutral-800 underline cursor-pointer"
                    >
                      Thu gọn về thẻ đăng ký nhanh
                    </button>
                  </div>
                  {/* Banner khi đang ở chế độ chỉnh sửa hồ sơ sự kiện đã nộp */}
                  {isEditingExistingRegistration && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs flex items-center justify-between text-amber-900 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <strong className="block text-amber-950">Chế độ chỉnh sửa hồ sơ đăng ký</strong>
                          <span className="text-[11px] text-amber-800">Quý vị có thể cập nhật lại thông tin qua 4 bước bên dưới.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingExistingRegistration(false)}
                        className="text-[11px] bg-white hover:bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded border border-amber-300 transition-colors shrink-0 cursor-pointer"
                      >
                        Quay lại thẻ vé
                      </button>
                    </div>
                  )}

                  {/* Account Status / Pre-fill Notice */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-emerald-700 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Hội viên VCF đã xác thực:</span>
                      </div>
                      <strong className="text-ink truncate block mt-0.5">
                        {currentUser?.jobTitle ? `${currentUser.jobTitle} - ` : ''}{currentUser?.fullName}
                      </strong>
                      {currentUser?.companyName && (
                        <div className="text-[11px] text-ink-secondary truncate">{currentUser.companyName}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className="text-[10px] font-mono text-brand-primary bg-white border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                        {currentUser?.memberId}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsLoginModalOpen(true);
                        }}
                        className="text-[10px] text-ink-secondary hover:text-brand-primary underline cursor-pointer"
                      >
                        Đổi tài khoản
                      </button>
                    </div>
                  </div>

                  {/* Smart Autofill Status Notice */}
                  {hasPreviouslyFilled ? (
                    <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5 shadow-2xs">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 font-sans">
                        <div className="font-semibold text-blue-950 flex items-center gap-1.5">
                          <span>Tự động điền dữ liệu đại biểu</span>
                          <span className="text-[10px] bg-blue-200/80 text-blue-800 font-mono px-1.5 py-0.2 rounded font-semibold">Autofilled</span>
                        </div>
                        <p className="text-[11px] text-blue-800 leading-relaxed">
                          Hệ thống đã tự động điền thông tin từ sự kiện quý vị đã khai báo trước đây. Quý vị có thể điều chỉnh lại nếu có thay đổi qua 4 bước bên dưới.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-parchment border border-hairline rounded-xl p-2.5 text-xs text-neutral-700 flex items-center gap-2">
                      <Info className="w-4 h-4 text-ink-secondary shrink-0" />
                      <span className="text-[11px] font-sans">
                        Quý vị chưa có dữ liệu sự kiện trước đó. Vui lòng hoàn thành 4 bước bên dưới để Ban Thư ký thẩm định.
                      </span>
                    </div>
                  )}

                  {/* Pass Type Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-800 block">
                      Lựa chọn loại vé tham dự:
                    </label>

                    {/* Member Pass */}
                    <div 
                      onClick={() => setSelectedPassType('member')}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPassType === 'member'
                          ? 'border-brand-primary bg-red-50/50 ring-1 ring-brand-primary'
                          : 'border-hairline hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="passType" 
                            checked={selectedPassType === 'member'} 
                            onChange={() => setSelectedPassType('member')} 
                            className="text-brand-primary focus:ring-brand-primary"
                          />
                          <span className="font-semibold text-xs text-ink">Vé VIP Hội Viên VCF</span>
                        </div>
                        <span className="text-xs font-semibold text-brand-primary">MIỄN PHÍ</span>
                      </div>
                      <div className="text-[11px] text-ink-secondary pl-6 mt-1 font-sans">
                        Hàng ghế VIP, tài liệu trọn bộ, Tiệc trưa Networking C-Level
                      </div>
                    </div>

                    {/* Standard Delegate Pass */}
                    <div 
                      onClick={() => setSelectedPassType('standard')}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPassType === 'standard'
                          ? 'border-brand-primary bg-red-50/50 ring-1 ring-brand-primary'
                          : 'border-hairline hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="passType" 
                            checked={selectedPassType === 'standard'} 
                            onChange={() => setSelectedPassType('standard')} 
                            className="text-brand-primary focus:ring-brand-primary"
                          />
                          <span className="font-semibold text-xs text-ink">Vé Đại Biểu Tiêu Chuẩn</span>
                        </div>
                        <span className="text-xs font-semibold text-ink">12.500.000 đ</span>
                      </div>
                      <div className="text-[11px] text-ink-secondary pl-6 mt-1 font-sans">
                        Dành cho đại biểu chưa là hội viên chính thức
                      </div>
                    </div>
                  </div>

                  {/* Stepper Progress Header */}
                  <div className="bg-parchment border border-hairline rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-semibold flex items-center justify-center">
                          {sidebarStep}
                        </span>
                        <span>
                          {sidebarStep === 1 && 'Bước 1/4: Thông tin đại biểu & Liên hệ'}
                          {sidebarStep === 2 && 'Bước 2/4: Thông tin doanh nghiệp'}
                          {sidebarStep === 3 && 'Bước 3/4: Quan tâm & Kết nối'}
                          {sidebarStep === 4 && 'Bước 4/4: Đối thoại chuyên gia & Vấn đề DN'}
                        </span>
                      </span>
                      <span className="text-[10px] text-ink-secondary font-semibold font-mono">
                        {sidebarStep * 25}%
                      </span>
                    </div>

                    {/* Stepper 4 Steps Navigation Buttons */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { step: 1, label: 'Đại biểu' },
                        { step: 2, label: 'Doanh nghiệp' },
                        { step: 3, label: 'Quan tâm' },
                        { step: 4, label: 'Chuyên gia' }
                      ].map((item) => {
                        const isCurrent = sidebarStep === item.step;
                        const isDone = sidebarStep > item.step;
                        return (
                          <button
                            type="button"
                            key={item.step}
                            onClick={() => {
                              if (item.step < sidebarStep) {
                                setSidebarStep(item.step as any);
                              } else if (item.step === 2 && validateSidebarStep1()) {
                                setSidebarStep(2);
                              } else if (item.step === 3 && validateSidebarStep1() && validateSidebarStep2()) {
                                setSidebarStep(3);
                              } else if (item.step === 4 && validateSidebarStep1() && validateSidebarStep2() && validateSidebarStep3()) {
                                setSidebarStep(4);
                              }
                            }}
                            className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                              isCurrent
                                ? 'bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs'
                                : isDone
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold hover:bg-emerald-100'
                                : 'bg-white text-ink-secondary border-hairline hover:border-neutral-300'
                            }`}
                          >
                            <div className="text-[10px] flex items-center justify-center gap-1">
                              {isDone ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <span>{item.step}.</span>
                              )}
                              <span className="truncate">{item.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Error Summary Banner */}
                  {Object.keys(formErrors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-brand-primary" />
                        Vui lòng kiểm tra lại thông tin:
                      </div>
                      <ul className="list-disc pl-5 text-[11px] space-y-0.5 font-sans">
                        {Object.values(formErrors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* =========================================================
                      BƯỚC 1: Thông tin đại biểu & Liên hệ
                      ========================================================= */}
                  {sidebarStep === 1 && (
                    <div className="border border-hairline bg-parchment/50 rounded-lg p-3.5 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold flex items-center justify-center">1</span>
                        <h4 className="text-xs font-semibold uppercase text-neutral-900 tracking-wider">
                          Thông tin đại biểu & Liên hệ
                        </h4>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Họ và tên đại biểu *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn An"
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        />
                        {formErrors.name && <p className="text-[10px] text-red-600 mt-1">{formErrors.name}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                            Email nhận vé & thư mời *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="ceo@company.com"
                            className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                              formErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                            }`}
                          />
                          {formErrors.email && <p className="text-[10px] text-red-600 mt-1">{formErrors.email}</p>}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                            Số điện thoại liên hệ *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="0912xxxxxx"
                            className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                              formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                            }`}
                          />
                          {formErrors.phone && <p className="text-[10px] text-red-600 mt-1">{formErrors.phone}</p>}
                        </div>
                      </div>

                      {/* Field 1: Chức danh */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Chức danh điều hành *
                        </label>
                        <select
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.jobTitle ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
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
                        {formErrors.jobTitle && <p className="text-[10px] text-red-600 mt-1">{formErrors.jobTitle}</p>}
                      </div>

                      {/* Action Next Step */}
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleNextSidebarStep(1)}
                          className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Tiếp tục: Bước 2 (Doanh nghiệp)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        {hasPreviouslyFilled && isAllSidebarStepsValid && (
                          <button
                            type="button"
                            onClick={handleRegisterSubmit}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hoàn tất đăng ký sự kiện ngay (Dữ liệu đã điền)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      BƯỚC 2: Thông tin doanh nghiệp
                      ========================================================= */}
                  {sidebarStep === 2 && (
                    <div className="border border-hairline bg-parchment/50 rounded-lg p-3.5 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold flex items-center justify-center">2</span>
                        <h4 className="text-xs font-semibold uppercase text-neutral-900 tracking-wider">
                          Thông tin doanh nghiệp
                        </h4>
                      </div>

                      {/* Field 2: Doanh nghiệp / Tổ chức */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Doanh nghiệp / Tổ chức *
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="VD: Công ty Cổ phần Thép VinaSteel"
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.companyName ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        />
                        {formErrors.companyName && <p className="text-[10px] text-red-600 mt-1">{formErrors.companyName}</p>}
                      </div>

                      {/* Field 3: Lĩnh vực hoạt động */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Lĩnh vực hoạt động *
                        </label>
                        <select
                          value={formData.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.industry ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        >
                          <option value="Sản xuất & Công nghiệp chế tạo">Sản xuất & Công nghiệp chế tạo</option>
                          <option value="Tài chính, Ngân hàng & Bảo hiểm">Tài chính, Ngân hàng & Bảo hiểm</option>
                          <option value="Bán lẻ, Thương mại & FMCG">Bán lẻ, Thương mại & FMCG</option>
                          <option value="Công nghệ thông tin & Viễn thông">Công nghệ thông tin & Viễn thông</option>
                          <option value="Bất động sản & Xây dựng hạ tầng">Bất động sản & Xây dựng hạ tầng</option>
                          <option value="Nông nghiệp công nghệ cao & Chế biến thực phẩm">Nông nghiệp công nghệ cao & Chế biến thực phẩm</option>
                          <option value="Y tế, Dược phẩm & Chăm sóc sức khỏe">Y tế, Dược phẩm & Chăm sóc sức khỏe</option>
                          <option value="Logistics, Kho vận & Chuỗi cung ứng">Logistics, Kho vận & Chuỗi cung ứng</option>
                          <option value="Năng lượng, Tài nguyên & Môi trường">Năng lượng, Tài nguyên & Môi trường</option>
                          <option value="Dịch vụ chuyên nghiệp & Tư vấn quản lý">Dịch vụ chuyên nghiệp & Tư vấn quản lý</option>
                          <option value="Khác">Khác...</option>
                        </select>
                        {formErrors.industry && <p className="text-[10px] text-red-600 mt-1">{formErrors.industry}</p>}
                      </div>

                      {/* Field 4: Quy mô doanh nghiệp (Free text) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-neutral-700 block">
                            Quy mô doanh nghiệp *
                          </label>
                          <span className="text-[10px] text-ink-secondary font-normal">Free text</span>
                        </div>
                        <input
                          type="text"
                          value={formData.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                          placeholder="VD: Khoảng 250 nhân sự, doanh thu 180 tỷ VNĐ/năm"
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.companySize ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        />
                        {formErrors.companySize && <p className="text-[10px] text-red-600 mt-1">{formErrors.companySize}</p>}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSidebarStep(1)}
                            className="w-1/3 py-2.5 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Quay lại</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNextSidebarStep(2)}
                            className="w-2/3 py-2.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>Tiếp tục: Bước 3 (Quan tâm)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {hasPreviouslyFilled && isAllSidebarStepsValid && (
                          <button
                            type="button"
                            onClick={handleRegisterSubmit}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hoàn tất đăng ký sự kiện ngay (Dữ liệu đã điền)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      BƯỚC 3: Quan tâm & Kết nối
                      ========================================================= */}
                  {sidebarStep === 3 && (
                    <div className="border border-hairline bg-parchment/50 rounded-lg p-3.5 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold flex items-center justify-center">3</span>
                        <h4 className="text-xs font-semibold uppercase text-neutral-900 tracking-wider">
                          Quan tâm & Kết nối
                        </h4>
                      </div>

                      {/* Field 5: Hoạt động VCF quan tâm (Multi-select pills) */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                          Hoạt động VCF quan tâm * <span className="font-normal text-ink-secondary">(chọn ít nhất 1)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {MOCK_ACTIVITIES.map((act) => {
                            const isSelected = formData.interestedActivities.includes(act.id);
                            return (
                              <button
                                type="button"
                                key={act.id}
                                onClick={() => toggleInterestedActivity(act.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {act.title}
                              </button>
                            );
                          })}
                        </div>
                        {formErrors.interestedActivities && (
                          <p className="text-[10px] text-red-600 mt-1">{formErrors.interestedActivities}</p>
                        )}
                      </div>

                      {/* Field 6: Nguồn biết đến VCF */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Nguồn biết đến VCF *
                        </label>
                        <select
                          value={formData.leadSource}
                          onChange={(e) => handleInputChange('leadSource', e.target.value)}
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.leadSource ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        >
                          <option value="Giới thiệu từ Hội viên VCF">Giới thiệu từ Hội viên VCF</option>
                          <option value="Báo chí truyền thông (VnExpress, Cafef, Forbes...)">Báo chí truyền thông (VnExpress, Cafef, Forbes...)</option>
                          <option value="Đã từng tham gia sự kiện trước đó của VCF">Đã từng tham gia sự kiện trước đó của VCF</option>
                          <option value="Mạng xã hội (LinkedIn, Facebook, YouTube)">Mạng xã hội (LinkedIn, Facebook, YouTube)</option>
                          <option value="Lời mời từ Ban Thư ký / Hiệp hội Doanh nghiệp">Lời mời từ Ban Thư ký / Hiệp hội Doanh nghiệp</option>
                          <option value="Khác">Khác...</option>
                        </select>
                        {formErrors.leadSource && <p className="text-[10px] text-red-600 mt-1">{formErrors.leadSource}</p>}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSidebarStep(2)}
                            className="w-1/3 py-2.5 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Quay lại</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNextSidebarStep(3)}
                            className="w-2/3 py-2.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>Tiếp tục: Bước 4 (Chuyên gia)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {hasPreviouslyFilled && isAllSidebarStepsValid && (
                          <button
                            type="button"
                            onClick={handleRegisterSubmit}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hoàn tất đăng ký sự kiện ngay (Dữ liệu đã điền)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      BƯỚC 4: Đối thoại chuyên gia & Vấn đề doanh nghiệp
                      ========================================================= */}
                  {sidebarStep === 4 && (
                    <div className="border border-hairline bg-parchment/50 rounded-lg p-3.5 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold flex items-center justify-center">4</span>
                        <h4 className="text-xs font-semibold uppercase text-neutral-900 tracking-wider">
                          Đối thoại chuyên gia & Vấn đề doanh nghiệp
                        </h4>
                      </div>

                      {/* Field 7: Mô tả vấn đề doanh nghiệp */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Mô tả vấn đề doanh nghiệp đang đối mặt *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.businessPainPoints}
                          onChange={(e) => handleInputChange('businessPainPoints', e.target.value)}
                          placeholder="VD: Doanh nghiệp đang gặp khó khăn trong tối ưu dòng tiền ngắn hạn, áp lực tái cơ cấu nợ..."
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.businessPainPoints ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        />
                        {formErrors.businessPainPoints && (
                          <p className="text-[10px] text-red-600 mt-1">{formErrors.businessPainPoints}</p>
                        )}
                      </div>

                      {/* Field 8: Câu hỏi cho mentor */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                          Câu hỏi cho Diễn giả / Mentor cố vấn *
                        </label>
                        <textarea
                          rows={2}
                          value={formData.questionForMentor}
                          onChange={(e) => handleInputChange('questionForMentor', e.target.value)}
                          placeholder="VD: Làm thế nào để giải quyết xung đột mục tiêu giữa HĐQT và Ban Điều hành khi mở rộng?"
                          className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none ${
                            formErrors.questionForMentor ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300 focus:border-brand-primary'
                          }`}
                        />
                        {formErrors.questionForMentor && (
                          <p className="text-[10px] text-red-600 mt-1">{formErrors.questionForMentor}</p>
                        )}
                      </div>

                      {/* Terms agreement */}
                      <div className="bg-neutral-100/80 rounded-lg p-2.5 text-[11px] text-ink-secondary font-sans">
                        ✓ Tôi xác nhận các thông tin trên là chính xác và đồng ý tuân thủ Quy chế tham dự & bảo mật thông tin bàn tròn của VCF.
                      </div>

                      {/* Action Buttons: Back + Submit */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSidebarStep(3)}
                          className="w-1/3 py-3 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Quay lại</span>
                        </button>
                        <CustomButton
                          variant="primary"
                          size="lg"
                          type="submit"
                          className="w-2/3 font-semibold py-3 shadow-md text-xs sm:text-sm flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isEditingExistingRegistration ? 'Cập nhật yêu cầu tham dự' : 'Hoàn tất đăng ký sự kiện'}</span>
                        </CustomButton>
                      </div>
                      <p className="text-[10px] text-ink-secondary text-center font-sans mt-1">
                        {isEditingExistingRegistration 
                          ? 'Thông tin cập nhật sẽ được lưu vào hồ sơ đại biểu và chuyển tới Ban Thư ký thẩm định.'
                          : 'Hồ sơ sẽ chuyển trạng thái Chờ duyệt để Ban Thư ký thẩm định trong 24h.'}
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Delegate Support Box */}
            <div className="bg-white border border-hairline rounded-xl p-5 shadow-xs space-y-3 text-xs">
              <div className="font-semibold text-sm text-ink flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-primary" />
                Hỗ Trợ Đại Biểu & Ban Thư Ký
              </div>
              <p className="text-ink-secondary font-sans leading-relaxed">
                Ban Thư ký sự kiện Diễn Đàn CEO Việt Nam sẵn sàng hỗ trợ sắp xếp chỗ ngồi VIP, đón tiếp đại biểu hoặc xuất hoá đơn GTGT.
              </p>
              <div className="space-y-1.5 pt-1 text-neutral-700 font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Hotline: <strong>024.3756.8888</strong> (Nhánh 102)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Email: <strong>events@vcf.vn</strong></span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Step-by-Step Membership & Event Registration Modal */}
      <StepByStepMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          // Yêu cầu 2: Sau khi tắt popup thông báo đăng ký thành công
          // Tự động cuộn mượt đến mục xem tình trạng hồ sơ và thông báo cho người dùng
          if (justRegistered || isAlreadyRegistered || isPendingApproval) {
            setTimeout(() => {
              scrollToSection('tickets');
            }, 120);
            showNotification('Hồ sơ đăng ký sự kiện đã được ghi nhận và đang chờ Ban Thư ký duyệt. Vui lòng kiểm tra email của bạn.');
          }
        }}
        eventTitle={event.title}
        eventId={event.id}
        eventDatetime={event.datetime}
        eventLocation={event.location}
        eventActivityName={event.activityName}
        isWaitlist={isWaitlistModal}
        onSuccess={(user, details) => {
          setJustRegistered(true);
          if (details) {
            setFormData(prev => ({
              ...prev,
              name: details.name || details.fullName || prev.name,
              phone: details.phone || prev.phone,
              jobTitle: details.jobTitle || prev.jobTitle,
              companyName: details.companyName || prev.companyName,
              industry: details.industry || prev.industry,
              companySize: details.companySize || prev.companySize,
              businessPainPoints: details.businessPainPoints || prev.businessPainPoints,
              questionForMentor: details.questionForMentor || prev.questionForMentor,
              email: details.email || prev.email,
            }));
          }
        }}
        onSwitchToLogin={() => {
          setReopenMemberModalAfterLogin(true);
          setIsMemberModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Quick In-Page Login Modal */}
      <QuickLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setReopenMemberModalAfterLogin(false);
        }}
        eventTitle={event.title}
        onLoginSuccess={() => {
          if (reopenMemberModalAfterLogin) {
            setReopenMemberModalAfterLogin(false);
            setIsMemberModalOpen(true);
          }
        }}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsMemberModalOpen(true);
        }}
      />
    </div>
  );
};
