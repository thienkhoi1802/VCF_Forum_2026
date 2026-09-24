import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../common/CustomButton';
import { SpecBadge } from '../wireframe/SpecBadge';
import { 
  User, 
  Calendar, 
  QrCode, 
  X, 
  Edit3, 
  LogOut,
  Ban,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    registeredEvents, 
    cancelEventRegistration, 
    approveEventRegistration,
    leaveWaitlist,
    confirmWaitlistPromotion,
    reRegisterEvent,
    logout, 
    navigateTo, 
    setSelectedEventId,
    showSpecAnnotations, 
    showNotification,
    openProgressiveProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'programs'>('profile');
  const [selectedQrTicket, setSelectedQrTicket] = useState<{
    eventName: string;
    qrCode: string;
    datetime: string;
    location: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: currentUser?.fullName || '',
    jobTitle: currentUser?.jobTitle || '',
    companyName: currentUser?.companyName || '',
    phone: currentUser?.phone || ''
  });

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4 font-sans">
        <div className="font-semibold text-lg text-slate-900">Vui lòng đăng nhập để xem Hồ sơ cá nhân</div>
        <CustomButton variant="primary" size="md" onClick={() => navigateTo('login')}>
          Đến trang Đăng nhập
        </CustomButton>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    showNotification('Đã cập nhật thông tin hồ sơ thành công!');
  };

  return (
    <div className="vcf-container py-6 pb-24 space-y-8 font-sans">
      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-hairline p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C12: Hồ sơ cá nhân + Lịch sử đăng ký [Trang phụ]" type="page" />
            <SpecBadge label="PRD 4.3 / Module Quản lý vé QR cá nhân" type="source" />
          </div>
          <span className="text-ink-secondary">
            States: [S-LOGGED-IN], [S-CANCEL-MODAL], [S-QR-VIEW]
          </span>
        </div>
      )}

      {/* Member Header Card */}
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xs flex flex-col md:flex-row items-center text-center md:items-center md:text-left justify-between gap-5 sm:gap-6">
        <div className="flex w-full min-w-0 flex-col items-center gap-3 text-center md:w-auto md:flex-row md:items-center md:gap-4 md:text-left">
          <div className="member-avatar size-16 shrink-0 rounded-full bg-neutral-500 text-white flex items-center justify-center font-semibold text-xl font-mono shadow-xs md:bg-brand-primary">
            {currentUser.fullName.split(' ').map(n => n[0]).slice(-2).join('')}
          </div>
          <div className="w-full min-w-0 space-y-1.5 md:flex-1">
            <h1 className="break-words text-xl sm:text-2xl font-semibold leading-tight text-ink">
              {currentUser.fullName}
            </h1>
            <div className="text-sm text-ink-secondary font-sans">
              {currentUser.jobTitle && <>{currentUser.jobTitle} • </>}
              <strong className="text-ink">{currentUser.companyName || 'Chưa cập nhật'}</strong>
            </div>
            <div className="flex flex-wrap justify-center gap-x-2 text-sm text-neutral-500 font-medium md:justify-start md:text-[11px]">
              <span>Ngày gia nhập: {currentUser.joinedDate}</span>
            </div>
            <CustomButton
              variant="ghost"
              size="sm"
              className="mx-auto mt-2 min-h-11 w-60 !border !border-[#b8b8b8] !bg-white md:hidden"
              onClick={() => {
                logout();
                navigateTo('home');
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </CustomButton>
          </div>
        </div>

        <div className="hidden w-auto items-center gap-3 md:flex">
          <CustomButton
            variant="secondary"
            size="sm"
            className="hidden min-h-11 justify-center md:inline-flex md:w-auto"
            onClick={() => {
              logout();
              navigateTo('home');
            }}
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Đăng xuất
          </CustomButton>
        </div>
      </div>

      {/* Progressive Profile Completion Banner if Lite Profile */}
      {!currentUser.isProfileComplete && (
        <div className="bg-warning-soft border border-amber-200 rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-ink">
                Hồ sơ hội viên cơ bản
              </h4>
              <p className="text-sm text-ink-secondary mt-0.5 leading-relaxed">
                Bổ sung thông tin để tăng cơ hội kết nối Mentor 1–1 và được ưu tiên tại sự kiện.
              </p>
            </div>
          </div>
          <CustomButton
            variant="primary"
            size="sm"
            onClick={() => openProgressiveProfile()}
            className="min-h-11 w-full shrink-0 justify-center whitespace-nowrap md:w-auto"
          >
            Hoàn thiện hồ sơ
          </CustomButton>
        </div>
      )}

      <div className="space-y-0 md:space-y-8">
      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 gap-2 border border-hairline p-1 bg-neutral-100">
        <button
          onClick={() => setActiveTab('profile')}
          aria-label="Thông tin hội viên"
          aria-pressed={activeTab === 'profile'}
          className={`flex min-h-11 w-full items-center justify-center gap-2 px-2 text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#342729] text-white shadow-xs'
              : 'text-ink-secondary hover:text-ink'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Hồ sơ</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          aria-label={`Lịch sử đăng ký sự kiện (${registeredEvents.length})`}
          aria-pressed={activeTab === 'history'}
          className={`flex min-h-11 w-full items-center justify-center gap-2 px-2 text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-[#342729] text-white shadow-xs'
              : 'text-ink-secondary hover:text-ink'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sự kiện ({registeredEvents.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="border border-hairline bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <h3 className="font-semibold text-base text-ink">
              Thông tin hồ sơ
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 border border-hairline px-3 text-sm font-semibold text-brand-primary hover:bg-parchment"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl text-xs">
              <div className="space-y-1.5">
                <label htmlFor="profile-full-name" className="font-semibold text-neutral-700">Họ và tên</label>
                <input
                  id="profile-full-name"
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-job-title" className="font-semibold text-neutral-700">Chức danh điều hành</label>
                <input
                  id="profile-job-title"
                  type="text"
                  value={editForm.jobTitle}
                  onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-company" className="font-semibold text-neutral-700">Tên Doanh nghiệp</label>
                <input
                  id="profile-company"
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-phone" className="font-semibold text-neutral-700">Số điện thoại</label>
                <input
                  id="profile-phone"
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <CustomButton type="submit" variant="primary" size="sm">
                  Lưu Thay Đổi
                </CustomButton>
                <CustomButton type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                  Hủy
                </CustomButton>
              </div>
            </form>
          ) : (
            <>
            <div className="space-y-4 md:hidden">
              <section className="border border-hairline bg-white">
                <h4 className="bg-parchment px-4 py-3 text-base font-semibold text-ink">
                  Thông tin cá nhân
                </h4>
                <dl className="px-4">
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Họ và tên</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{currentUser.fullName || 'Chưa cập nhật'}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Email</dt>
                    <dd className="min-w-0 break-all font-medium text-ink">{currentUser.email || 'Chưa cập nhật'}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Số điện thoại</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{currentUser.phone || 'Chưa cập nhật'}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Chức danh</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{currentUser.jobTitle || 'Chưa cập nhật'}</dd>
                  </div>
                </dl>
              </section>

              <section className="border border-hairline bg-white">
                <h4 className="bg-parchment px-4 py-3 text-base font-semibold text-ink">
                  Thông tin doanh nghiệp
                </h4>
                <dl className="px-4">
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Tên doanh nghiệp</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{currentUser.companyName || 'Chưa cập nhật'}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Lĩnh vực hoạt động</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{currentUser.industry || 'Chưa cập nhật'}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 py-3 text-sm">
                    <dt className="text-ink-secondary">Quy mô</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{currentUser.companySize || 'Chưa cập nhật'}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="hidden grid-cols-1 gap-4 text-sm md:grid md:grid-cols-2 md:gap-6">
              <div className="p-4 sm:p-5 bg-parchment border border-hairline rounded-lg space-y-3">
                <div className="font-semibold text-ink border-b border-hairline pb-2">
                  Thông tin cá nhân
                </div>
                <div>• Họ tên: <strong className="text-ink">{currentUser.fullName}</strong></div>
                <div>• Email: <strong className="text-ink">{currentUser.email}</strong></div>
                <div>• SĐT: <strong className="text-ink">{currentUser.phone || 'Chưa cập nhật'}</strong></div>
                <div>• Chức vụ: <strong className="text-ink">{currentUser.jobTitle || 'Chưa cập nhật'}</strong></div>
              </div>

              <div className="p-4 sm:p-5 bg-parchment border border-hairline rounded-lg space-y-3">
                <div className="font-semibold text-ink border-b border-hairline pb-2">
                  Thông tin doanh nghiệp
                </div>
                <div>• Doanh nghiệp: <strong className="text-ink">{currentUser.companyName}</strong></div>
                <div>• Lĩnh vực: <strong className="text-ink">{currentUser.industry}</strong></div>
                <div>• Quy mô: <strong className="text-ink">{currentUser.companySize}</strong></div>
              </div>
            </div>
            </>
          )}
        </div>
      )}

      {/* TAB CONTENT: EVENT REGISTRATION HISTORY */}
      {activeTab === 'history' && (
        <div className="border border-hairline bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xs space-y-6">
          <div className="flex flex-col gap-3 pb-4 border-b border-neutral-100 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-base text-ink uppercase">
                Danh Sách Vé Mời & Sự Kiện Đã Đăng Ký
              </h3>
              <p className="text-xs text-ink-secondary font-sans">
                Xuất trình mã QR tại bàn lễ tân khi tham dự sự kiện
              </p>
            </div>

            <CustomButton
              variant="secondary"
              size="sm"
              className="w-full justify-center sm:w-auto"
              onClick={() => navigateTo('events')}
            >
              + Đăng ký thêm sự kiện
            </CustomButton>
          </div>

          {registeredEvents.length > 0 && (
            <div className="space-y-4">
              {registeredEvents.map((item) => (
                <div
                  key={item.id}
                  className={`border p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-sans transition-all duration-150 ${
                    item.status === 'cancelled' ? 'bg-parchment border-hairline opacity-60' : 'bg-white border-hairline hover:border-brand-primary shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-primary bg-red-50 border border-red-200 px-3 py-0.5 text-[10px] rounded-full uppercase">
                        {item.activityName}
                      </span>
                      <span className={`text-[10px] font-semibold px-3 py-0.5 rounded-full ${
                        item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'pending_approval' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                        item.status === 'waitlisted' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                        item.status === 'attended' ? 'bg-neutral-100 text-neutral-700' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.status === 'confirmed' ? 'ĐÃ XÁC NHẬN CHỖ' :
                         item.status === 'pending_approval' ? 'ĐANG CHỜ DUYỆT' :
                         item.status === 'waitlisted' ? 'DANH SÁCH CHỜ (WAITLIST)' :
                         item.status === 'attended' ? 'ĐÃ THAM DỰ' : 'ĐÃ HỦY ĐĂNG KÝ'}
                      </span>
                    </div>

                    <h4 
                      onClick={() => {
                        setSelectedEventId(item.eventId);
                        navigateTo('event-detail', { eventId: item.eventId });
                      }}
                      className="font-semibold text-base text-ink font-sans hover:text-brand-primary cursor-pointer transition-colors inline-flex items-center gap-1.5 group"
                      title="Nhấp để xem chi tiết sự kiện"
                    >
                      <span className="group-hover:underline">{item.eventTitle}</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </h4>

                    <div className="text-ink-secondary text-[11px] space-y-0.5">
                      <div>Thời gian: {item.datetime}</div>
                      <div>Địa điểm: {item.location}</div>
                      {item.status === 'confirmed' ? (
                        <div>Mã vé QR: <strong className="font-mono text-brand-primary">{item.qrCodePlaceholder || `VCF-TICKET-${item.eventId.toUpperCase()}`}</strong> (Đăng ký lúc: {item.registeredDate || '10/08/2026'})</div>
                      ) : item.status === 'pending_approval' ? (
                        <div className="text-amber-800 font-medium">Mã QR Check-in: [Sẽ được cấp sau khi Ban Thư ký phê duyệt] (Đăng ký lúc: {item.registeredDate || '10/08/2026'})</div>
                      ) : item.status === 'waitlisted' ? (
                        <div>Hàng chờ: #{String(item.waitlistPosition || 7).padStart(2, '0')} (Đăng ký lúc: {item.registeredDate || '15/08/2026'})</div>
                      ) : (
                        <div>{item.status === 'attended' ? 'Trạng thái: Đã hoàn thành tham dự sự kiện' : 'Trạng thái: Đã hủy đăng ký'} (Đăng ký lúc: {item.registeredDate || '10/08/2025'})</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {item.status === 'pending_approval' && (
                      <>
                        <button
                          type="button"
                          onClick={() => approveEventRegistration(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs cursor-pointer"
                        >
                          ⚡ Duyệt ngay (Mô phỏng)
                        </button>
                        <CustomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedEventId(item.eventId);
                            navigateTo('event-detail', { eventId: item.eventId });
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Chi tiết sự kiện
                        </CustomButton>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Quý vị có chắc muốn hủy yêu cầu đăng ký này?')) {
                              cancelEventRegistration(item.id);
                            }
                          }}
                          className="px-2.5 py-1 text-xs text-ink-secondary hover:text-red-600 underline cursor-pointer"
                        >
                          Hủy yêu cầu
                        </button>
                      </>
                    )}

                    {item.status === 'confirmed' && (
                      <>
                        <CustomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedEventId(item.eventId);
                            navigateTo('event-detail', { eventId: item.eventId });
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Chi tiết sự kiện
                        </CustomButton>

                        <CustomButton
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedQrTicket({
                            eventName: item.eventTitle,
                            qrCode: item.qrCodePlaceholder || `VCF-TICKET-${item.eventId.toUpperCase()}`,
                            datetime: item.datetime,
                            location: item.location
                          })}
                        >
                          <QrCode className="w-3.5 h-3.5 mr-1" />
                          Xem Vé QR
                        </CustomButton>

                        <CustomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Ông/Bà có chắc muốn hủy đăng ký vé sự kiện này?')) {
                              cancelEventRegistration(item.id);
                            }
                          }}
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          Hủy vé
                        </CustomButton>
                      </>
                    )}

                    {item.status === 'waitlisted' && (
                      <>
                        <button
                          type="button"
                          onClick={() => confirmWaitlistPromotion(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-2xs cursor-pointer"
                        >
                          ⚡ Có chỗ trống: Giữ chỗ ngay (Mô phỏng)
                        </button>
                        <CustomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedEventId(item.eventId);
                            navigateTo('event-detail', { eventId: item.eventId });
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Chi tiết sự kiện
                        </CustomButton>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Quý vị có chắc muốn rời khỏi danh sách chờ của sự kiện này?')) {
                              leaveWaitlist(item.id);
                            }
                          }}
                          className="px-2.5 py-1 text-xs text-ink-secondary hover:text-red-600 underline cursor-pointer"
                        >
                          Rời hàng chờ
                        </button>
                      </>
                    )}

                    {item.status === 'attended' && (
                      <CustomButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedEventId(item.eventId);
                          navigateTo('event-detail', { eventId: item.eventId });
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        Chi tiết sự kiện
                      </CustomButton>
                    )}

                    {item.status === 'cancelled' && (
                      <>
                        <CustomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedEventId(item.eventId);
                            navigateTo('event-detail', { eventId: item.eventId });
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Chi tiết sự kiện
                        </CustomButton>
                        <button
                          type="button"
                          onClick={() => {
                            reRegisterEvent(item.eventId);
                            setSelectedEventId(item.eventId);
                            navigateTo('event-detail', { eventId: item.eventId });
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-ink text-white transition-colors cursor-pointer"
                        >
                          Đăng ký lại sự kiện
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>

      {/* QR TICKET MODAL */}
      {selectedQrTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-hairline max-w-sm w-full p-6 text-center space-y-4 shadow-xl rounded-lg animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-semibold text-ink uppercase tracking-wide">THẺ ĐẠI BIỂU ĐIỆN TỬ</span>
              <button onClick={() => setSelectedQrTicket(null)} className="p-1 rounded-full text-neutral-400 hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-ink font-sans">
                {selectedQrTicket.eventName}
              </h4>
              <div className="text-[11px] text-ink-secondary">
                {selectedQrTicket.datetime}
              </div>
            </div>

            {/* Simulated QR Code Visual */}
            <div className="w-48 h-48 mx-auto bg-parchment border border-hairline rounded-lg p-4 flex flex-col items-center justify-center space-y-2 shadow-inner">
              <QrCode className="w-28 h-28 text-ink" />
              <span className="font-mono font-semibold text-xs tracking-wider text-brand-primary">
                {selectedQrTicket.qrCode}
              </span>
            </div>

            <div className="text-[11px] text-ink-secondary">
              Đại biểu: <strong>{currentUser.fullName}</strong> ({currentUser.jobTitle})
            </div>

            <CustomButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setSelectedQrTicket(null)}
            >
              Đóng thẻ vé
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};
