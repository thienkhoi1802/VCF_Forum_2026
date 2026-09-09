import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  PageRoute, 
  ActivityId, 
  KnowledgeCategoryType, 
  KnowledgeTabType,
  UserProfile, 
  RegistrationHistoryItem, 
  SimulatedState,
  SearchFilterState,
  PendingAction
} from '../types';
import { MOCK_LOGGED_USER, MOCK_REGISTRATIONS } from '../data/mockData';

import { checkEmailExists } from '../utils/eventWorkflow';

interface AppContextType {
  // Navigation
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute, params?: {
    activityId?: ActivityId;
    articleId?: string;
    programId?: string;
    category?: KnowledgeTabType;
    searchQuery?: string;
    eventId?: string;
  }) => void;
  selectedActivityId: ActivityId;
  selectedArticleId: string;
  selectedProgramId: string;
  selectedKnowledgeCategory: KnowledgeTabType;
  setSelectedKnowledgeCategory: (cat: KnowledgeTabType) => void;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  searchFilter: SearchFilterState;
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  searchQuery: string;
  
  // Auth & User
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  login: () => void;
  loginWithAccount: (email: string, fullName?: string, companyName?: string) => void;
  logout: () => void;
  registerMember: (data: Partial<UserProfile>) => UserProfile;
  signupLite: (method: 'google' | 'facebook' | 'email', data?: { fullName?: string; email?: string; phone?: string }) => void;
  verifyEmailAndActivate: (tempData?: Partial<UserProfile>) => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;

  // Pending Actions across auth / profile gate
  pendingAction: PendingAction;
  setPendingAction: (action: PendingAction) => void;
  clearPendingAction: () => void;

  // Progressive Profile Modal Flow (04-progressive-profile.md)
  progressiveProfileOpen: boolean;
  openProgressiveProfile: (callbackOnSuccess?: () => void) => void;
  closeProgressiveProfile: () => void;
  handleSkipProgressiveProfile: () => void;
  handleCompleteProgressiveProfile: (data: Partial<UserProfile>) => void;

  // Event Registrations & Waitlist (05-lich-su-kien & 12-luong-dang-ky-su-kien)
  registeredEvents: RegistrationHistoryItem[];
  registerForEvent: (eventId: string, eventTitle: string, activityName: string, datetime: string, location: string) => boolean;
  registerForEventWithDetails: (params: {
    eventId: string;
    eventTitle: string;
    activityName: string;
    datetime: string;
    location: string;
    isWaitlist?: boolean;
    passType?: 'member' | 'standard';
    details?: RegistrationHistoryItem['details'];
    updateUserProfile?: boolean;
  }) => boolean;
  approveEventRegistration: (registrationId: string) => void;
  resetEventRegistration: (eventId: string) => void;
  cancelRegistration: (registrationId: string) => void;
  cancelEventRegistration: (registrationId: string) => void;
  leaveWaitlist: (registrationId: string) => void;
  confirmWaitlistPromotion: (registrationId: string) => void;
  reRegisterEvent: (eventId: string) => void;
  checkEmailExistsInSystem: (email: string) => boolean;

  // CMS Flags (07-dao-tao-ceo tuition fee flag)
  tuitionFeeCmsToggle: 'on-with-data' | 'on-without-data' | 'off';
  setTuitionFeeCmsToggle: (toggle: 'on-with-data' | 'on-without-data' | 'off') => void;

  // Wireframe State Simulator & Spec Inspector
  wireframeImageMode: 'wireframe' | 'photo';
  setWireframeImageMode: (mode: 'wireframe' | 'photo') => void;
  simulatedState: SimulatedState;
  setSimulatedState: (state: SimulatedState) => void;
  showSpecAnnotations: boolean;
  setShowSpecAnnotations: (show: boolean) => void;
  viewportMode: 'desktop' | 'mobile';
  setViewportMode: (mode: 'desktop' | 'mobile') => void;

  // Event Registration Success Modal
  eventSuccessModal: {
    isOpen: boolean;
    eventTitle?: string;
    email?: string;
    isWaitlist?: boolean;
  };
  showEventSuccessModal: (params: { eventTitle?: string; email?: string; isWaitlist?: boolean }) => void;
  closeEventSuccessModal: () => void;

  // Flash / Toast Notifications
  notification: string | null;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedActivityId, setSelectedActivityId] = useState<ActivityId>('ceo-summit');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('article-hung-bt-01');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('program-ceo-lgm-mastery');
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<KnowledgeTabType>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('event-summit-2026');
  const [searchFilter, setSearchFilter] = useState<SearchFilterState>({ query: '', category: 'all' });
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<RegistrationHistoryItem[]>(MOCK_REGISTRATIONS);
  
  // Pending action when user is gated
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Progressive profile modal state
  const [progressiveProfileOpen, setProgressiveProfileOpen] = useState(false);
  const [progressiveProfileSuccessCb, setProgressiveProfileSuccessCb] = useState<(() => void) | null>(null);

  // CMS Toggle for Training Tuition Fee (07-dao-tao-ceo.md)
  const [tuitionFeeCmsToggle, setTuitionFeeCmsToggle] = useState<'on-with-data' | 'on-without-data' | 'off'>('on-with-data');

  // Wireframe Image Mode: 'wireframe' (high-fidelity wireframe placeholders) by default
  const [wireframeImageMode, setWireframeImageMode] = useState<'wireframe' | 'photo'>('wireframe');

  const [simulatedState, setSimulatedStateState] = useState<SimulatedState>('S-DEFAULT');
  const [showSpecAnnotations, setShowSpecAnnotations] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [notification, setNotification] = useState<string | null>(null);

  // Popup modal trạng thái hồ sơ sau khi đăng ký sự kiện thành công
  const [eventSuccessModal, setEventSuccessModal] = useState<{
    isOpen: boolean;
    eventTitle?: string;
    email?: string;
    isWaitlist?: boolean;
  }>({
    isOpen: false
  });

  const showEventSuccessModal = (params: { eventTitle?: string; email?: string; isWaitlist?: boolean }) => {
    setEventSuccessModal({
      isOpen: true,
      eventTitle: params.eventTitle,
      email: params.email,
      isWaitlist: params.isWaitlist
    });
  };

  const closeEventSuccessModal = () => {
    setEventSuccessModal(prev => ({ ...prev, isOpen: false }));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const setSimulatedState = (state: SimulatedState) => {
    setSimulatedStateState(state);
    if (state === 'S-LOGGED-IN') {
      setCurrentUser(MOCK_LOGGED_USER);
      showNotification('Chuyển sang trạng thái: [S-LOGGED-IN] Đã đăng nhập');
    } else {
      showNotification(`Chuyển sang trạng thái mô phỏng: [${state}]`);
    }
  };

  const navigateTo = (
    route: PageRoute, 
    params?: {
      activityId?: ActivityId;
      articleId?: string;
      programId?: string;
      category?: KnowledgeTabType;
      searchQuery?: string;
      eventId?: string;
    }
  ) => {
    if (params?.activityId) setSelectedActivityId(params.activityId);
    if (params?.articleId) setSelectedArticleId(params.articleId);
    if (params?.programId) setSelectedProgramId(params.programId);
    if (params?.category) {
      setSelectedKnowledgeCategory(params.category);
    } else if (route === 'knowledge') {
      setSelectedKnowledgeCategory('all');
    }
    if (params?.eventId) setSelectedEventId(params.eventId);
    if (params?.searchQuery !== undefined) {
      setSearchFilter(prev => ({ ...prev, query: params.searchQuery || '' }));
    }
    
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = () => {
    setCurrentUser(MOCK_LOGGED_USER);
    setRegisteredEvents(MOCK_REGISTRATIONS.filter(r => r.eventId !== 'event-summit-2026'));
    showNotification('Đăng nhập thành công! Chào mừng ông Phạm Minh Đức (VinaSteel).');
  };

  const loginWithAccount = (email: string, fullName?: string, companyName?: string) => {
    // Nếu là tài khoản mẫu Phạm Minh Đức (VinaSteel)
    if (email.toLowerCase().includes('vinasteel') || email.toLowerCase().includes('duc.pham')) {
      setCurrentUser(MOCK_LOGGED_USER);
      setRegisteredEvents(MOCK_REGISTRATIONS.filter(r => r.eventId !== 'event-summit-2026'));
      showNotification('Đăng nhập thành công! Chào mừng ông Phạm Minh Đức (VinaSteel).');
      return;
    }

    // Tài khoản đại biểu người dùng (nếu chưa từng đăng ký sự kiện thì để các trường chuyên sâu trống để họ tự điền)
    const displayName = fullName || (email.toLowerCase().includes('vnexpress') ? 'Nguyen Van A' : email.split('@')[0]);
    const user: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: displayName,
      email: email,
      phone: email.toLowerCase().includes('vnexpress') ? '0912 345 678' : '',
      jobTitle: '',
      companyName: companyName || '',
      industry: 'Sản xuất & Công nghiệp chế tạo',
      companySize: '',
      membershipStatus: 'approved',
      memberId: `VCF-ACT-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      interestedActivities: ['ceo-summit', 'ceo-forum'],
      isProfileComplete: false,
      leadSource: 'Giới thiệu từ Hội viên VCF',
      businessPainPoints: '',
      questionForMentor: ''
    };
    setCurrentUser(user);
    setRegisteredEvents([]);
    showNotification(`Đăng nhập thành công! Chào mừng ${user.fullName}.`);
  };

  const logout = () => {
    setCurrentUser(null);
    setRegisteredEvents([]);
    if (simulatedState === 'S-LOGGED-IN') {
      setSimulatedStateState('S-DEFAULT');
    }
    showNotification('Đã đăng xuất khỏi hệ thống.');
  };

  const registerMember = (data: Partial<UserProfile>): UserProfile => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: data.fullName || 'Đại biểu Hội viên VCF',
      email: data.email || 'ceo@member.vcf.org.vn',
      phone: data.phone || '',
      jobTitle: data.jobTitle || 'Tổng Giám Đốc (CEO)',
      companyName: data.companyName || 'Doanh nghiệp VCF',
      industry: data.industry || 'Sản xuất & Công nghiệp',
      companySize: data.companySize || 'Từ 100 - 300 nhân sự',
      membershipStatus: 'approved',
      memberId: `VCF-MBR-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      interestedActivities: (data.interestedActivities as ActivityId[]) || ['ceo-summit', 'ceo-forum'],
      isProfileComplete: true,
      leadSource: data.leadSource || 'Đăng ký Hội viên trực tiếp sự kiện',
      businessPainPoints: data.businessPainPoints || '',
      questionForMentor: data.questionForMentor || ''
    };
    setCurrentUser(newUser);
    showNotification(`Đăng ký thành viên thành công! Chào mừng ${newUser.fullName} (${newUser.companyName}) gia nhập VCF.`);
    return newUser;
  };

  // Lite Signup handler
  const signupLite = (method: 'google' | 'facebook' | 'email', data?: { fullName?: string; email?: string; phone?: string }) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: data?.fullName || (method === 'google' ? 'Đại biểu Google User' : 'Đại biểu Facebook User'),
      email: data?.email || (method === 'google' ? 'user.google@example.com' : 'user.fb@example.com'),
      phone: data?.phone || '',
      jobTitle: '',
      companyName: '',
      industry: '',
      companySize: '',
      membershipStatus: 'pending',
      memberId: `VCF-MBR-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      interestedActivities: ['ceo-summit', 'ceo-forum'],
      isProfileComplete: false // S-PARTIAL-PROFILE
    };

    if (method === 'google' || method === 'facebook') {
      setCurrentUser(newUser);
      showNotification(`Tạo tài khoản thành công qua ${method === 'google' ? 'Google' : 'Facebook'}! Chào mừng bạn gia nhập VCF.`);
      // Check pending action
      if (pendingAction) {
        resumePendingAction(newUser);
      } else {
        navigateTo('home');
      }
    } else {
      // Email verify flow
      // Store in state or activate upon verification link click
      setCurrentUser(newUser);
    }
  };

  const verifyEmailAndActivate = (tempData?: Partial<UserProfile>) => {
    const activeUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: tempData?.fullName || 'Đại biểu Hội viên Mới',
      email: tempData?.email || 'member@vcf.org.vn',
      phone: tempData?.phone || '',
      jobTitle: '',
      companyName: '',
      industry: '',
      companySize: '',
      membershipStatus: 'approved',
      memberId: `VCF-ACT-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      interestedActivities: ['ceo-summit'],
      isProfileComplete: false
    };
    setCurrentUser(activeUser);
    showNotification('Tài khoản đã kích hoạt thành công qua liên kết xác thực Email!');
    
    if (pendingAction) {
      resumePendingAction(activeUser);
    } else {
      navigateTo('home');
    }
  };

  const resumePendingAction = (user: UserProfile) => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);

    if (action.type === 'register-event') {
      setSelectedEventId(action.eventId);
      navigateTo('event-detail', { eventId: action.eventId });
      showNotification(`Tiếp tục đăng ký sự kiện đã chọn...`);
    } else if (action.type === 'consult-program') {
      setSelectedProgramId(action.programId);
      navigateTo('program-detail', { programId: action.programId });
      showNotification(`Tiếp tục gửi yêu cầu tư vấn khoá học...`);
    }
  };

  const clearPendingAction = () => {
    setPendingAction(null);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
      showNotification('Cập nhật thông tin hồ sơ thành công.');
    }
  };

  // Progressive Profile Modal Handlers
  const openProgressiveProfile = (callbackOnSuccess?: () => void) => {
    if (callbackOnSuccess) {
      setProgressiveProfileSuccessCb(() => callbackOnSuccess);
    } else {
      setProgressiveProfileSuccessCb(null);
    }
    setProgressiveProfileOpen(true);
  };

  const closeProgressiveProfile = () => {
    setProgressiveProfileOpen(false);
  };

  const handleSkipProgressiveProfile = () => {
    // S-PROFILE-SKIPPED: close modal and proceed with existing info
    setProgressiveProfileOpen(false);
    showNotification('Đã ghi nhận, bạn có thể bổ sung hồ sơ bất cứ lúc nào trong mục Tài khoản.');
    if (progressiveProfileSuccessCb) {
      progressiveProfileSuccessCb();
      setProgressiveProfileSuccessCb(null);
    }
  };

  const handleCompleteProgressiveProfile = (data: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        ...data,
        isProfileComplete: true
      });
    }
    setProgressiveProfileOpen(false);
    showNotification('Hồ sơ thành viên đã được hoàn thiện!');
    if (progressiveProfileSuccessCb) {
      progressiveProfileSuccessCb();
      setProgressiveProfileSuccessCb(null);
    }
  };

  const registerForEvent = (
    eventId: string, 
    eventTitle: string, 
    activityName: string, 
    datetime: string, 
    location: string
  ): boolean => {
    return registerForEventWithDetails({
      eventId,
      eventTitle,
      activityName,
      datetime,
      location,
      isWaitlist: false,
      passType: 'member'
    });
  };

  const registerForEventWithDetails = ({
    eventId,
    eventTitle,
    activityName,
    datetime,
    location,
    isWaitlist = false,
    passType = 'member',
    details,
    updateUserProfile = false
  }: {
    eventId: string;
    eventTitle: string;
    activityName: string;
    datetime: string;
    location: string;
    isWaitlist?: boolean;
    passType?: 'member' | 'standard';
    details?: RegistrationHistoryItem['details'];
    updateUserProfile?: boolean;
  }): boolean => {
    const existingIndex = registeredEvents.findIndex(r => r.eventId === eventId && r.status !== 'cancelled');
    const initialStatus = isWaitlist ? 'waitlisted' : 'pending_approval';

    if (existingIndex >= 0) {
      // Cập nhật thông tin đăng ký cho sự kiện đã đăng ký trước đó (Đăng ký lại)
      setRegisteredEvents(prev => {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          details,
          formData: details ? { ...details } : undefined,
          status: initialStatus,
          passType,
          registeredDate: new Date().toLocaleDateString('vi-VN')
        };
        return updated;
      });

      if (updateUserProfile && details && currentUser) {
        setCurrentUser(prev => prev ? {
          ...prev,
          fullName: details.name || details.fullName || prev.fullName,
          email: details.email || prev.email,
          phone: details.phone || prev.phone,
          jobTitle: details.jobTitle || prev.jobTitle,
          companyName: details.companyName || prev.companyName,
          industry: details.industry || prev.industry,
          companySize: details.companySize || prev.companySize,
          interestedActivities: (details.interestedActivities as any) || prev.interestedActivities,
          leadSource: details.leadSource || prev.leadSource,
          businessPainPoints: details.businessPainPoints || prev.businessPainPoints,
          questionForMentor: details.questionForMentor || prev.questionForMentor,
          isProfileComplete: true
        } : null);
      }

      const userEmail = details?.email || details?.fullName || currentUser?.email || 'duc.pham@vinasteel.com.vn';
      setEventSuccessModal({
        isOpen: true,
        eventTitle,
        email: userEmail,
        isWaitlist
      });

      showNotification(isWaitlist ? 'Đã thêm vào danh sách chờ, BTC sẽ liên hệ khi có chỗ trống' : 'Đã đăng ký thành công, hồ sơ đang chờ Ban Thư ký duyệt');
      return true;
    }

    const newItem: RegistrationHistoryItem = {
      id: `reg-${Date.now()}`,
      userId: currentUser?.id,
      eventId,
      eventTitle,
      activityName,
      datetime,
      location,
      registeredDate: new Date().toLocaleDateString('vi-VN'),
      createdAt: new Date().toISOString(),
      status: initialStatus,
      qrCodePlaceholder: isWaitlist 
        ? `[Mã danh sách chờ: VCF-WAITLIST-${eventId.toUpperCase()}-${Date.now().toString().slice(-4)}]`
        : `[QR Code: VCF-TICKET-${eventId.toUpperCase()}-${Date.now().toString().slice(-4)}]`,
      waitlistPosition: isWaitlist ? 7 : undefined,
      passType,
      formData: details ? { ...details } : undefined,
      details
    };

    setRegisteredEvents([newItem, ...registeredEvents]);
    
    // Mục 5.4: Mặc định chỉ snapshot vào registration.form_data, KHÔNG tự động ghi đè User.profile trừ khi user chọn
    if (updateUserProfile && details && currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        fullName: details.name || details.fullName || prev.fullName,
        email: details.email || prev.email,
        phone: details.phone || prev.phone,
        jobTitle: details.jobTitle || prev.jobTitle,
        companyName: details.companyName || prev.companyName,
        industry: details.industry || prev.industry,
        companySize: details.companySize || prev.companySize,
        interestedActivities: (details.interestedActivities as any) || prev.interestedActivities,
        leadSource: details.leadSource || prev.leadSource,
        businessPainPoints: details.businessPainPoints || prev.businessPainPoints,
        questionForMentor: details.questionForMentor || prev.questionForMentor,
        isProfileComplete: true
      } : null);
    }

    const userEmail = details?.email || details?.fullName || currentUser?.email || 'duc.pham@vinasteel.com.vn';
    setEventSuccessModal({
      isOpen: true,
      eventTitle,
      email: userEmail,
      isWaitlist
    });

    if (isWaitlist) {
      showNotification('Đã thêm vào danh sách chờ, BTC sẽ liên hệ khi có chỗ trống');
    } else {
      showNotification('Đã đăng ký thành công, hồ sơ đang chờ Ban Thư ký duyệt');
    }
    return true;
  };

  const approveEventRegistration = (registrationId: string) => {
    setRegisteredEvents(prev =>
      prev.map(item => item.id === registrationId ? { ...item, status: 'confirmed' } : item)
    );
    showNotification('Ban Thư ký VCF đã phê duyệt yêu cầu tham dự! Mã QR Check-in đã được cấp.');
  };

  const resetEventRegistration = (eventId: string) => {
    setRegisteredEvents(prev => prev.filter(item => item.eventId !== eventId));
    showNotification('Đã làm mới trạng thái sự kiện để bạn có thể thử nghiệm lại luồng đăng ký.');
  };

  const cancelRegistration = (registrationId: string) => {
    setRegisteredEvents(prev => 
      prev.map(item => item.id === registrationId ? { ...item, status: 'cancelled' } : item)
    );
    showNotification('Đã hủy đăng ký sự kiện.');
  };

  const leaveWaitlist = (registrationId: string) => {
    setRegisteredEvents(prev => 
      prev.map(item => item.id === registrationId ? { ...item, status: 'cancelled' } : item)
    );
    showNotification('Quý vị đã rời khỏi danh sách chờ của sự kiện.');
  };

  const confirmWaitlistPromotion = (registrationId: string) => {
    setRegisteredEvents(prev => 
      prev.map(item => item.id === registrationId ? { ...item, status: 'pending_approval' } : item)
    );
    showNotification('Đã xác nhận giữ chỗ từ Danh sách chờ! Hồ sơ chuyển sang Đang chờ Ban Thư ký duyệt.');
  };

  const reRegisterEvent = (eventId: string) => {
    // Cho phép đăng ký lại sau khi đã huỷ: xoá bản ghi huỷ cũ để mở lại form
    setRegisteredEvents(prev => prev.filter(item => !(item.eventId === eventId && item.status === 'cancelled')));
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        selectedActivityId,
        selectedArticleId,
        selectedProgramId,
        selectedKnowledgeCategory,
        setSelectedKnowledgeCategory,
        selectedEventId,
        setSelectedEventId,
        searchFilter,
        setSearchFilter,
        searchQuery: searchFilter.query,
        currentUser,
        isLoggedIn: Boolean(currentUser) || simulatedState === 'S-LOGGED-IN',
        login,
        loginWithAccount,
        logout,
        registerMember,
        signupLite,
        verifyEmailAndActivate,
        updateUserProfile,
        pendingAction,
        setPendingAction,
        clearPendingAction,
        progressiveProfileOpen,
        openProgressiveProfile,
        closeProgressiveProfile,
        handleSkipProgressiveProfile,
        handleCompleteProgressiveProfile,
        registeredEvents,
        registerForEvent,
        registerForEventWithDetails,
        approveEventRegistration,
        resetEventRegistration,
        cancelRegistration,
        cancelEventRegistration: cancelRegistration,
        leaveWaitlist,
        confirmWaitlistPromotion,
        reRegisterEvent,
        checkEmailExistsInSystem: checkEmailExists,
        tuitionFeeCmsToggle,
        setTuitionFeeCmsToggle,
        wireframeImageMode,
        setWireframeImageMode,
        simulatedState,
        setSimulatedState,
        showSpecAnnotations,
        setShowSpecAnnotations,
        viewportMode,
        setViewportMode,
        eventSuccessModal,
        showEventSuccessModal,
        closeEventSuccessModal,
        notification,
        notificationMessage: notification,
        showNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

