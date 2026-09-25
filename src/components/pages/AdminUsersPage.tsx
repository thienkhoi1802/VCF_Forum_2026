import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Clock3, RefreshCw, Search, ShieldAlert, UserRound, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../types';

type ReviewStatus = UserProfile['membershipStatus'];

type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  job_title: string | null;
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  membership_status: ReviewStatus;
  member_id: string;
  interested_activities: string[];
  is_profile_complete: boolean;
  lead_source: string | null;
  business_pain_points: string | null;
  question_for_mentor: string | null;
  created_at: string;
  updated_at: string;
  review_note: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

const statusLabel: Record<ReviewStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  expired: 'Hết hạn'
};

const statusClass: Record<ReviewStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-neutral-100 text-neutral-600 border-neutral-200'
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
};

const getErrorMessage = (error: { message?: string } | null) => error?.message || 'Không thể tải dữ liệu hồ sơ.';

export const AdminUsersPage: React.FC = () => {
  const { currentUser, navigateTo, showNotification } = useApp();
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = async () => {
    if (!supabase || !currentUser?.isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError('');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError(getErrorMessage(error));
      setUsers([]);
    } else {
      setUsers((data || []) as AdminProfile[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadUsers();
  }, [currentUser?.isAdmin]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return users.filter(user => {
      const matchesStatus = statusFilter === 'all' || user.membership_status === statusFilter;
      const searchable = [user.full_name, user.email, user.phone, user.company_name, user.member_id]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!normalizedSearch || searchable.includes(normalizedSearch));
    });
  }, [search, statusFilter, users]);

  const selectedUser = users.find(user => user.id === selectedUserId) || null;

  const updateStatus = async (user: AdminProfile, status: ReviewStatus) => {
    if (!supabase || !currentUser?.isAdmin) return;
    setUpdatingId(user.id);

    const { data, error } = await supabase
      .from('profiles')
      .update({
        membership_status: status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: currentUser.id
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) {
      showNotification(`Không thể cập nhật hồ sơ: ${error.message}`);
    } else {
      const updated = data as AdminProfile;
      setUsers(prev => prev.map(item => item.id === updated.id ? updated : item));
      showNotification(`Đã chuyển hồ sơ ${updated.full_name} sang trạng thái ${statusLabel[status]}.`);
    }
    setUpdatingId(null);
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="vcf-container py-20 pb-28 font-sans">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto mb-4 size-12 text-brand-primary" />
          <h1 className="text-xl font-semibold text-ink">Không có quyền truy cập</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Chỉ tài khoản có role quản trị trong Supabase App Metadata mới được xem danh sách hội viên.
          </p>
          <button type="button" onClick={() => navigateTo('profile')} className="mt-6 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white">
            Quay lại hồ sơ
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = users.filter(user => user.membership_status === 'pending').length;
  const approvedCount = users.filter(user => user.membership_status === 'approved').length;

  return (
    <div className="vcf-container space-y-6 py-6 pb-28 font-sans">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">VCF Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Quản lý hội viên</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">Xem hồ sơ đăng ký, kiểm tra thông tin và duyệt trạng thái hội viên.</p>
        </div>
        <button type="button" onClick={() => void loadUsers()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-hairline px-4 text-sm font-semibold text-ink hover:bg-parchment">
          <RefreshCw className="size-4" /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-hairline bg-white p-4 shadow-xs"><p className="text-xs text-ink-secondary">Tổng hồ sơ</p><p className="mt-1 text-2xl font-semibold text-ink">{users.length}</p></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-xs"><p className="text-xs text-amber-800">Chờ duyệt</p><p className="mt-1 text-2xl font-semibold text-amber-900">{pendingCount}</p></div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-xs"><p className="text-xs text-emerald-700">Đã duyệt</p><p className="mt-1 text-2xl font-semibold text-emerald-900">{approvedCount}</p></div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-white p-4 shadow-xs md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Tìm kiếm hội viên</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm theo tên, email, công ty, mã hội viên..." className="w-full rounded-lg border border-neutral-300 py-2.5 pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none" />
        </label>
        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'all' | ReviewStatus)} className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none">
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      {loadError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>}

      {isLoading ? (
        <div className="rounded-xl border border-hairline bg-white p-10 text-center text-sm text-ink-secondary">Đang tải danh sách hội viên...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-hairline bg-white p-10 text-center shadow-xs">
          <UserRound className="mx-auto size-10 text-neutral-300" />
          <p className="mt-3 font-semibold text-ink">Chưa có hồ sơ phù hợp</p>
          <p className="mt-1 text-sm text-ink-secondary">Hồ sơ mới đăng ký sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <button key={user.id} type="button" onClick={() => setSelectedUserId(user.id)} className={`w-full rounded-xl border bg-white p-4 text-left shadow-xs transition hover:border-brand-primary ${selectedUserId === user.id ? 'border-brand-primary ring-2 ring-red-100' : 'border-hairline'}`}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{user.full_name || 'Chưa cập nhật họ tên'}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusClass[user.membership_status]}`}>{statusLabel[user.membership_status]}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-ink-secondary">{user.email || 'Chưa có email'} · {user.company_name || 'Chưa cập nhật công ty'}</p>
                    <p className="mt-1 text-xs text-neutral-400">{user.member_id} · Đăng ký {formatDate(user.created_at)}</p>
                  </div>
                  <ChevronRight className="hidden size-5 shrink-0 text-neutral-400 sm:block" />
                </div>
              </button>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-hairline bg-white p-5 shadow-xs lg:sticky lg:top-6">
            {selectedUser ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3 border-b border-hairline pb-4">
                  <div><p className="text-xs uppercase tracking-wider text-ink-secondary">Chi tiết hồ sơ</p><h2 className="mt-1 text-lg font-semibold text-ink">{selectedUser.full_name || 'Chưa cập nhật'}</h2></div>
                  <button type="button" onClick={() => setSelectedUserId(null)} aria-label="Đóng chi tiết" className="rounded-full p-1.5 text-neutral-400 hover:bg-parchment hover:text-ink"><X className="size-4" /></button>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div><span className="text-ink-secondary">Email:</span> <strong className="break-all text-ink">{selectedUser.email || '—'}</strong></div>
                  <div><span className="text-ink-secondary">Số điện thoại:</span> <strong className="text-ink">{selectedUser.phone || '—'}</strong></div>
                  <div><span className="text-ink-secondary">Công ty:</span> <strong className="text-ink">{selectedUser.company_name || '—'}</strong></div>
                  <div><span className="text-ink-secondary">Chức danh:</span> <strong className="text-ink">{selectedUser.job_title || '—'}</strong></div>
                  <div><span className="text-ink-secondary">Lĩnh vực:</span> <strong className="text-ink">{selectedUser.industry || '—'}</strong></div>
                  <div><span className="text-ink-secondary">Quy mô:</span> <strong className="text-ink">{selectedUser.company_size || '—'}</strong></div>
                  <div><span className="text-ink-secondary">Mã hội viên:</span> <strong className="font-mono text-brand-primary">{selectedUser.member_id}</strong></div>
                  <div><span className="text-ink-secondary">Nguồn:</span> <strong className="text-ink">{selectedUser.lead_source || '—'}</strong></div>
                </div>
                <div className="rounded-lg bg-parchment p-3 text-xs text-ink-secondary">
                  <div className="flex items-center gap-2 font-semibold text-ink"><Clock3 className="size-3.5" /> Cập nhật duyệt</div>
                  <p className="mt-1">{selectedUser.reviewed_at ? formatDate(selectedUser.reviewed_at) : 'Chưa duyệt'}</p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  <button type="button" disabled={updatingId === selectedUser.id || selectedUser.membership_status === 'approved'} onClick={() => void updateStatus(selectedUser, 'approved')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Check className="size-4" /> Duyệt hồ sơ</button>
                  <button type="button" disabled={updatingId === selectedUser.id || selectedUser.membership_status === 'rejected'} onClick={() => void updateStatus(selectedUser, 'rejected')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"><X className="size-4" /> Từ chối</button>
                  <button type="button" disabled={updatingId === selectedUser.id || selectedUser.membership_status === 'pending'} onClick={() => void updateStatus(selectedUser, 'pending')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-hairline px-3 text-sm font-semibold text-ink hover:bg-parchment disabled:cursor-not-allowed disabled:opacity-50"><Clock3 className="size-4" /> Đưa về chờ duyệt</button>
                </div>
              </div>
            ) : <div className="py-10 text-center text-sm text-ink-secondary">Chọn một hồ sơ để xem chi tiết và duyệt.</div>}
          </aside>
        </div>
      )}
    </div>
  );
};

