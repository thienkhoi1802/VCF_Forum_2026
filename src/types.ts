export type PageRoute = 
  | 'home' // C1
  | 'activities' // C2
  | 'activity-detail' // C3
  | 'register-member' // C4
  | 'events' // C5
  | 'event-detail' // C5.1
  | 'knowledge' // C6
  | 'knowledge-category' // C7
  | 'article-detail' // C8
  | 'programs' // C9
  | 'program-detail' // C9.1
  | 'about' // C10
  | 'login' // C11
  | 'profile' // C12
  | 'search'; // C13

export type KnowledgeCategoryType = 'hung-bt' | 'other-authors' | 'derived-knowledge';
export type KnowledgeTabType = 'all' | KnowledgeCategoryType;

export type ActivityId = 
  | 'ceo-summit'
  | 'ceo-forum'
  | 'ceo-mentoring'
  | 'ceo-peer-group'
  | 'lgm-school'
  | 'knowledge-publication'
  | 'website-app'
  | 'ceo-talk'
  | 'ceo-club';

export interface Activity {
  id: ActivityId;
  title: string;
  shortDesc: string;
  fullDesc: string;
  objectives: string[];
  frequency: string;
  hasEvents: boolean;
  coverImagePlaceholder: string;
  imageUrl?: string;
  type: 'event-based' | 'mentoring' | 'peer-group' | 'academic' | 'publication' | 'platform' | 'media' | 'club';
}

export interface EventItem {
  id: string;
  title: string;
  activityId: ActivityId;
  activityName: string;
  datetime: string;
  dateStr: string; // YYYY-MM-DD for calendar
  timeStr: string;
  location: string;
  type: 'Trực tiếp' | 'Trực tuyến' | 'Hybrid';
  availableSeats: number;
  totalSeats: number;
  isFull: boolean;
  status: 'upcoming' | 'ongoing' | 'past';
  speakers: {
    name: string;
    role: string;
    avatarPlaceholder: string;
    avatarUrl?: string;
  }[];
  description: string;
  agenda: { time: string; topic: string; presenter?: string }[];
  imagePlaceholder: string;
  imageUrl?: string;
  subtitle?: string;
  highlights?: string[];
  targetAudience?: string[];
  venueDetails?: {
    hall: string;
    address: string;
    notes?: string;
  };
  ticketPricing?: {
    memberPrice: string;
    standardPrice: string;
    notes?: string;
  };
}

export interface ArticleItem {
  id: string;
  title: string;
  sapo: string;
  content: string[];
  author: {
    name: string;
    role: string;
    bio: string;
    avatarPlaceholder: string;
    avatarUrl?: string;
  };
  category: KnowledgeCategoryType;
  categoryName: string;
  subCategory?: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  imagePlaceholder: string;
  imageUrl?: string;
  isSpotlight?: boolean;
  sourceReference?: {
    originalSource: string;
    author: string;
    year: string;
    notes: string;
  };
}

export interface TrainingProgram {
  id: string;
  title: string;
  code: string;
  targetAudience: string;
  shortDesc: string;
  duration: string;
  format: string; // 'Tập trung' | 'Cuối tuần' | 'Hybrid'
  nextCohort: string;
  tuitionFee: string;
  scholarshipInfo?: string;
  imagePlaceholder: string;
  imageUrl?: string;
  externalUrl?: string;
  objectives: string[];
  modules: {
    title: string;
    duration: string;
    topics: string[];
  }[];
  faculty: {
    name: string;
    role: string;
    bio: string;
    avatarPlaceholder: string;
    avatarUrl?: string;
  }[];
  upcomingSchedules: {
    cohort: string;
    startDate: string;
    location: string;
    status: 'Đang nhận hồ sơ' | 'Sắp khai giảng' | 'Đã đủ số lượng';
  }[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  specialties: string[];
  bio: string;
  avatarPlaceholder: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyName: string;
  industry: string;
  companySize: string; // Free text as per 04-progressive-profile spec
  membershipStatus: 'approved' | 'pending' | 'expired';
  memberId: string;
  joinedDate: string;
  interestedActivities: ActivityId[];
  isProfileComplete: boolean; // S-PROFILE-COMPLETE vs S-PARTIAL-PROFILE
  taxId?: string;
  leadSource?: string;
  businessPainPoints?: string;
  questionForMentor?: string;
}

export type RegistrationStatus = 'pending_approval' | 'confirmed' | 'waitlisted' | 'attended' | 'cancelled';
export type ComputedEventStatus = 'OPEN' | 'FULL' | 'ENDED';

export interface RegistrationHistoryItem {
  id: string;
  userId?: string;
  eventId: string;
  eventTitle: string;
  activityName: string;
  datetime: string;
  location: string;
  registeredDate: string;
  createdAt?: string;
  status: RegistrationStatus;
  qrCodePlaceholder: string;
  qrUsed?: boolean;
  waitlistPosition?: number;
  passType?: 'member' | 'standard';
  formData?: Record<string, any>;
  details?: {
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    companyName?: string;
    taxId?: string;
    industry?: string;
    companySize?: string;
    interestedActivities?: string[];
    leadSource?: string;
    businessPainPoints?: string;
    questionForMentor?: string;
    submittedAt?: string;
  };
}

export type PendingAction = 
  | { type: 'register-event'; eventId: string; eventTitle?: string }
  | { type: 'consult-program'; programId: string; programTitle?: string }
  | null;

export interface SearchFilterState {
  query: string;
  category: 'all' | 'activities' | 'articles' | 'events' | 'programs';
}

export type SimulatedState = 
  | 'S-DEFAULT'
  | 'S-LOADING'
  | 'S-EMPTY'
  | 'S-FULL'
  | 'S-LOGGED-IN';
