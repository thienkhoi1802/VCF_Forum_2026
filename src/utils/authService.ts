/**
 * VCF Auth Service
 * Quản lý trạng thái xác thực, danh sách tài khoản hợp lệ, mã OTP, và liên kết mạng xã hội
 */

import { KNOWN_SYSTEM_EMAILS } from './eventWorkflow';

const REGISTERED_ACCOUNTS_KEY = 'vcf_registered_accounts';
const OTP_STORAGE_KEY = 'vcf_active_otp';

export interface VcfAccount {
  email: string;
  fullName: string;
  companyName: string;
  jobTitle?: string;
  phone?: string;
  registeredAt: string;
}

// Initial recognized accounts in VCF
const DEFAULT_ACCOUNTS: VcfAccount[] = [
  {
    email: 'duc.pham@vinasteel.com.vn',
    fullName: 'Phạm Minh Đức',
    companyName: 'Tổng Công ty Thép Việt Nam (VinaSteel)',
    jobTitle: 'Tổng Giám Đốc',
    phone: '0903 123 456',
    registeredAt: '2024-01-15'
  },
  {
    email: 'ceo@vinasteel.com.vn',
    fullName: 'Phạm Minh Đức',
    companyName: 'Tổng Công ty Thép Việt Nam (VinaSteel)',
    jobTitle: 'Tổng Giám Đốc',
    phone: '0903 123 456',
    registeredAt: '2024-01-15'
  },
  {
    email: 'hung.bt@lgm.edu.vn',
    fullName: 'BT. Nguyễn Mạnh Hùng',
    companyName: 'Viện Lãnh đạo & Quản trị LGM',
    jobTitle: 'Viện trưởng',
    phone: '0912 888 999',
    registeredAt: '2023-11-20'
  },
  {
    email: 'member@vcf.org.vn',
    fullName: 'Hội viên Tiêu biểu VCF',
    companyName: 'Tập đoàn Doanh nghiệp VCF',
    jobTitle: 'Chủ tịch HĐQT',
    phone: '0918 000 111',
    registeredAt: '2024-02-10'
  },
  {
    email: 'ceo@vietnamceo.org.vn',
    fullName: 'Ban Điều hành VCF',
    companyName: 'Diễn đàn CEO Việt Nam',
    jobTitle: 'Trưởng ban Thư ký',
    phone: '028 3910 1234',
    registeredAt: '2023-10-01'
  },
  {
    email: 'vnexpress.ai3@gmail.com',
    fullName: 'Đại biểu Hội viên VnExpress',
    companyName: 'VnExpress AI Forum',
    jobTitle: 'Giám đốc Công nghệ',
    phone: '0912 345 678',
    registeredAt: '2026-09-23'
  }
];

export function getRegisteredAccounts(): VcfAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed: VcfAccount[] = JSON.parse(raw);
    // Ensure default accounts exist
    const map = new Map<string, VcfAccount>();
    DEFAULT_ACCOUNTS.forEach(acc => map.set(acc.email.toLowerCase(), acc));
    parsed.forEach(acc => map.set(acc.email.toLowerCase(), acc));
    return Array.from(map.values());
  } catch (e) {
    return DEFAULT_ACCOUNTS;
  }
}

export function isEmailRegisteredInSystem(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const normalized = email.trim().toLowerCase();
  
  // Check known system emails list
  if (KNOWN_SYSTEM_EMAILS.some(e => e.toLowerCase() === normalized)) {
    return true;
  }
  
  // Check local storage registered accounts
  const accounts = getRegisteredAccounts();
  return accounts.some(acc => acc.email.toLowerCase() === normalized);
}

export function getAccountByEmail(email: string): VcfAccount | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  return accounts.find(acc => acc.email.toLowerCase() === normalized) || null;
}

export function saveRegisteredAccount(account: VcfAccount): void {
  try {
    const accounts = getRegisteredAccounts();
    const normalized = account.email.trim().toLowerCase();
    const existingIndex = accounts.findIndex(a => a.email.toLowerCase() === normalized);
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save account to localStorage', e);
  }
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@doanhnghiep.vn';
  const [user, domain] = email.trim().split('@');
  if (user.length <= 2) {
    return `${user.charAt(0)}***@${domain}`;
  }
  return `${user.charAt(0)}***@${domain}`;
}

export interface StoredOtp {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

export function generateAndStoreOtp(email: string): { code: string; expiresAt: number } {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity
  
  const otpData: StoredOtp = {
    email: email.trim().toLowerCase(),
    code,
    createdAt: now,
    expiresAt,
    attempts: 0
  };
  
  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
  } catch (e) {
    // fallback
  }

  // Also log in development for convenience
  console.info(`[VCF Auth Hub] Mã OTP xác thực cho ${email}: ${code} (Hiệu lực 5 phút)`);

  return { code, expiresAt };
}

export function getStoredOtp(email: string): StoredOtp | null {
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) return null;
    const data: StoredOtp = JSON.parse(raw);
    if (data.email.toLowerCase() !== email.trim().toLowerCase()) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export function recordOtpAttempt(email: string): number {
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) return 1;
    const data: StoredOtp = JSON.parse(raw);
    data.attempts = (data.attempts || 0) + 1;
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(data));
    return data.attempts;
  } catch (e) {
    return 1;
  }
}

export function clearStoredOtp(): void {
  try {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
}
