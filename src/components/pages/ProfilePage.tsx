import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
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
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <div className="font-bold text-lg text-slate-900">Vui lòng đăng nhập để xem Hồ sơ cá nhân</div>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb items={[{ label: 'Hồ sơ hội viên & Lịch sử' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C12: Hồ sơ cá nhân + Lịch sử đăng ký [Trang phụ]" type="page" />
            <SpecBadge label="PRD 4.3 / Module Quản lý vé QR cá nhân" type="source" />
          </div>
          <span className="text-neutral-500">
            States: [S-LOGGED-IN], [S-CANCEL-MODAL], [S-QR-VIEW]
          </span>
        </div>
      )}

      {/* Member Header Card */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 rounded-lg shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#eb1000] text-white flex items-center justify-center font-black text-xl font-mono shadow-xs">
            {currentUser.fullName.split(' ').map(n => n[0]).slice(-2).join('')}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-black">
                {currentUser.fullName}
              </h1>
              <span className="bg-red-50 text-[#eb1000] border border-red-200 text-[10px] px-3 py-0.5 font-bold uppercase rounded-full">
                {currentUser.membershipType}
              </span>
            </div>
            <div className="text-xs text-neutral-600 font-sans">
              {currentUser.jobTitle} • <strong className="text-black">{currentUser.companyName}</strong>
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              Mã hội viên: <span className="font-mono text-[#eb1000] font-bold">{currentUser.memberCode}</span> | Ngày gia nhập: {currentUser.joinDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <CustomButton
            variant="secondary"
            size="sm"
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
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#eb1000] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-black">
                Hồ sơ hội viên đang ở mức cơ bản (Lite Member)
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Bổ sung thông tin chức danh, doanh nghiệp và thách thức quản trị để nhận quyền lợi kết nối Mentor 1-1 và được xếp chỗ ưu tiên tại các sự kiện.
              </p>
            </div>
          </div>
          <CustomButton
            variant="primary"
            size="sm"
            onClick={() => openProgressiveProfile()}
            className="shrink-0 whitespace-nowrap"
          >
            Hoàn thiện hồ sơ ngay →
          </CustomButton>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border border-neutral-200 p-1 bg-neutral-100 rounded-full gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2 font-bold rounded-full transition-all duration-150 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#eb1000] text-white shadow-xs'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Thông Tin Hội Viên</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2 font-bold rounded-full transition-all duration-150 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-[#eb1000] text-white shadow-xs'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch Sử Đăng Ký Sự Kiện ({registeredEvents.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="border border-neutral-200 bg-white p-6 md:p-8 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <h3 className="font-black text-base text-black uppercase">
              Chi Tiết Hồ Sơ Quản Trị
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-[#eb1000] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Họ và tên</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-[#eb1000]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Chức danh điều hành</label>
                <input
                  type="text"
                  value={editForm.jobTitle}
                  onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-[#eb1000]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Tên Doanh nghiệp</label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-[#eb1000]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Số điện thoại</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-sans focus:outline-none focus:border-[#eb1000]"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2.5">
                <div className="font-bold text-black border-b border-neutral-200 pb-2">
                  Thông tin cá nhân
                </div>
                <div>• Họ tên: <strong className="text-black">{currentUser.fullName}</strong></div>
                <div>• Email: <strong className="text-black">{currentUser.email}</strong></div>
                <div>• SĐT: <strong className="text-black">{currentUser.phone}</strong></div>
                <div>• Chức vụ: <strong className="text-black">{currentUser.jobTitle}</strong></div>
              </div>

              <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2.5">
                <div className="font-bold text-black border-b border-neutral-200 pb-2">
                  Thông tin doanh nghiệp
                </div>
                <div>• Doanh nghiệp: <strong className="text-black">{currentUser.companyName}</strong></div>
                <div>• Lĩnh vực: <strong className="text-black">{currentUser.industry}</strong></div>
                <div>• Quy mô: <strong className="text-black">{currentUser.companySize}</strong></div>
                <div>• Trạng thái hồ sơ: <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">ĐÃ XÁC THỰC</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: EVENT REGISTRATION HISTORY */}
      {activeTab === 'history' && (
        <div className="border border-neutral-200 bg-white p-6 md:p-8 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 className="font-black text-base text-black uppercase">
                Danh Sách Vé Mời & Sự Kiện Đã Đăng Ký
              </h3>
              <p className="text-xs text-neutral-500 font-sans">
                Xuất trình mã QR tại bàn lễ tân khi tham dự sự kiện
              </p>
            </div>

            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('events')}
            >
              + Đăng ký thêm sự kiện
            </CustomButton>
          </div>

          {registeredEvents.length === 0 ? (
            <div className="border border-neutral-200 p-8 text-center bg-neutral-50 rounded-lg space-y-2 text-xs">
              <div className="font-black text-black">[S-EMPTY] Bạn chưa đăng ký tham dự sự kiện nào</div>
              <CustomButton variant="primary" size="sm" onClick={() => navigateTo('events')}>
                Xem lịch sự kiện VCF
              </CustomButton>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredEvents.map((item) => (
                <div
                  key={item.id}
                  className={`border p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-sans transition-all duration-150 ${
                    item.status === 'cancelled' ? 'bg-neutral-50 border-neutral-200 opacity-60' : 'bg-white border-neutral-200 hover:border-[#eb1000] shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#eb1000] bg-red-50 border border-red-200 px-3 py-0.5 text-[10px] rounded-full uppercase">
                        {item.activityName}
                      </span>
                      <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full ${
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
                      className="font-black text-base text-black font-sans hover:text-[#eb1000] cursor-pointer transition-colors inline-flex items-center gap-1.5 group"
                      title="Nhấp để xem chi tiết sự kiện"
                    >
                      <span className="group-hover:underline">{item.eventTitle}</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#eb1000] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </h4>

                    <div className="text-neutral-500 text-[11px] space-y-0.5">
                      <div>Thời gian: {item.datetime}</div>
                      <div>Địa điểm: {item.location}</div>
                      {item.status === 'confirmed' ? (
                        <div>Mã vé QR: <strong className="font-mono text-[#eb1000]">{item.qrCodePlaceholder || item.qrCode || `VCF-TICKET-${item.eventId.toUpperCase()}`}</strong> (Đăng ký lúc: {item.registeredDate || item.registeredAt || '10/08/2026'})</div>
                      ) : item.status === 'pending_approval' ? (
                        <div className="text-amber-800 font-medium">Mã QR Check-in: [Sẽ được cấp sau khi Ban Thư ký phê duyệt] (Đăng ký lúc: {item.registeredDate || item.registeredAt || '10/08/2026'})</div>
                      ) : item.status === 'waitlisted' ? (
                        <div>Hàng chờ: #07 (Đăng ký lúc: {item.registeredDate || item.registeredAt || '15/08/2026'})</div>
                      ) : (
                        <div>{item.status === 'attended' ? 'Trạng thái: Đã hoàn thành tham dự sự kiện' : 'Trạng thái: Đã hủy đăng ký'} (Đăng ký lúc: {item.registeredDate || item.registeredAt || '10/08/2025'})</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {item.status === 'pending_approval' && (
                      <>
                        <button
                          type="button"
                          onClick={() => approveEventRegistration(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eb1000] text-white hover:bg-[#c90d00] transition-colors shadow-2xs cursor-pointer"
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
                          className="px-2.5 py-1 text-xs text-neutral-500 hover:text-red-600 underline cursor-pointer"
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
                            qrCode: item.qrCodePlaceholder || item.qrCode || `VCF-TICKET-${item.eventId.toUpperCase()}`,
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
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-2xs cursor-pointer"
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
                          className="px-2.5 py-1 text-xs text-neutral-500 hover:text-red-600 underline cursor-pointer"
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
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-black text-white transition-colors cursor-pointer"
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

      {/* QR TICKET MODAL */}
      {selectedQrTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-sm w-full p-6 text-center space-y-4 shadow-xl rounded-lg animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-black text-black uppercase tracking-wide">THẺ ĐẠI BIỂU ĐIỆN TỬ</span>
              <button onClick={() => setSelectedQrTicket(null)} className="p-1 rounded-full text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-sm text-black font-sans">
                {selectedQrTicket.eventName}
              </h4>
              <div className="text-[11px] text-neutral-500">
                {selectedQrTicket.datetime}
              </div>
            </div>

            {/* Simulated QR Code Visual */}
            <div className="w-48 h-48 mx-auto bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 shadow-inner">
              <QrCode className="w-28 h-28 text-black" />
              <span className="font-mono font-bold text-xs tracking-wider text-[#eb1000]">
                {selectedQrTicket.qrCode}
              </span>
            </div>

            <div className="text-[11px] text-neutral-600">
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
