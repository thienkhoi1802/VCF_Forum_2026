import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
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
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  job_title: string | null;
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  membership_status: UserProfile['membershipStatus'];
  member_id: string;
  interested_activities: string[];
  is_profile_complete: boolean;
  lead_source: string | null;
  business_pain_points: string | null;
  question_for_mentor: string | null;
  created_at: string;
};

const userProfileFromAuth = (user: SupabaseUser, profile?: ProfileRow | null): UserProfile => {
  const metadata = user.user_metadata || {};
  const fallbackName = user.email?.split('@')[0] || 'Hội viên VCF';

  return {
    id: user.id,
    fullName: profile?.full_name || metadata.full_name || fallbackName,
    email: profile?.email || user.email || '',
    phone: profile?.phone || metadata.phone || '',
    jobTitle: profile?.job_title || '',
    companyName: profile?.company_name || '',
    industry: profile?.industry || '',
    companySize: profile?.company_size || '',
    membershipStatus: profile?.membership_status || 'pending',
    memberId: profile?.member_id || `VCF-MBR-${user.id.slice(0, 8).toUpperCase()}`,
    joinedDate: profile?.created_at || new Date().toISOString(),
    interestedActivities: (profile?.interested_activities || []) as ActivityId[],
    isProfileComplete: profile?.is_profile_complete || false,
    leadSource: profile?.lead_source || '',
    businessPainPoints: profile?.business_pain_points || '',
    questionForMentor: profile?.question_for_mentor || '',
    isAdmin: user.app_metadata?.role === 'admin'
  };
};

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
  loginWithPassword: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  registerMember: (data: Partial<UserProfile>) => UserProfile;
  registerWithEmail: (params: { email: string; password: string; fullName: string }) => Promise<{
    ok: boolean;
    requiresEmailConfirmation: boolean;
    error?: string;
  }>;
  refreshAuthSession: () => Promise<boolean>;
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
  const [wireframeImageMode, setWireframeImageMode] = useState<'wireframe' | 'photo'>('photo');

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

  const hydrateAuthUser = async (authUser: SupabaseUser | null): Promise<UserProfile | null> => {
    if (!authUser) {
      setCurrentUser(null);
      return null;
    }

    let profile: ProfileRow | null = null;
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.warn('Không thể tải hồ sơ Supabase:', error.message);
      } else {
        profile = data as ProfileRow | null;
      }
    }

    const user = userProfileFromAuth(authUser, profile);
    setCurrentUser(user);
    return user;
  };

  useEffect(() => {
    if (!supabase) return;

    let isActive = true;
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isActive) {
        await hydrateAuthUser(data.session?.user || null);
      }
    };

    void loadSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isActive) {
        void hydrateAuthUser(session?.user || null);
      }
    });

    return () => {
      isActive = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

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

  const loginWithPassword = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return { ok: false, error: 'Supabase chưa được cấu hình cho ứng dụng.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error || !data.user) {
      return { ok: false, error: error?.message || 'Không thể đăng nhập tài khoản.' };
    }

    await hydrateAuthUser(data.user);
    setRegisteredEvents([]);
    return { ok: true };
  };

  const logout = () => {
    if (supabase) {
      void supabase.auth.signOut();
    }
    setCurrentUser(null);
    setRegisteredEvents([]);
    if (simulatedState === 'S-LOGGED-IN') {
      setSimulatedStateState('S-DEFAULT');
    }
    showNotification('Đã đăng xuất khỏi hệ thống.');
  };

  const registerWithEmail = async ({ email, password, fullName }: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    if (!supabase || !isSupabaseConfigured) {
      return {
        ok: false,
        requiresEmailConfirmation: false,
        error: 'Supabase chưa được cấu hình cho ứng dụng.'
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: window.location.origin
      }
    });

    if (error || !data.user) {
      return {
        ok: false,
        requiresEmailConfirmation: false,
        error: error?.message || 'Không thể tạo tài khoản.'
      };
    }

    if (data.session) {
      await hydrateAuthUser(data.user);
      setRegisteredEvents([]);
    }

    return {
      ok: true,
      requiresEmailConfirmation: !data.session
    };
  };

  const refreshAuthSession = async () => {
    if (!supabase) return false;
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return false;
    await hydrateAuthUser(data.session.user);
    return true;
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
      const nextUser = { ...currentUser, ...updated };
      setCurrentUser(nextUser);

      if (supabase) {
        void supabase.from('profiles').update({
          email: nextUser.email,
          full_name: nextUser.fullName,
          phone: nextUser.phone,
          job_title: nextUser.jobTitle,
          company_name: nextUser.companyName,
          industry: nextUser.industry,
          company_size: nextUser.companySize,
          interested_activities: nextUser.interestedActivities,
          is_profile_complete: nextUser.isProfileComplete,
          lead_source: nextUser.leadSource || null,
          business_pain_points: nextUser.businessPainPoints || null,
          question_for_mentor: nextUser.questionForMentor || null
        }).eq('id', currentUser.id);
      }
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
        loginWithPassword,
        logout,
        registerMember,
        registerWithEmail,
        refreshAuthSession,
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
