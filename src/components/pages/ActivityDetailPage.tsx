import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { CustomButton } from '../common/CustomButton';
import { EventCard } from '../common/EventCard';
import { AuthorMentorCard } from '../common/AuthorMentorCard';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { 
  MOCK_ACTIVITIES, 
  MOCK_EVENTS, 
  MOCK_MENTORS 
} from '../../data/mockData';
import { 
  Calendar, 
  Target, 
  Share2, 
  Play, 
  Volume2, 
  CheckCircle2
} from 'lucide-react';

export const ActivityDetailPage: React.FC = () => {
  const { 
    selectedActivityId, 
    navigateTo, 
    showSpecAnnotations, 
    isLoggedIn
  } = useApp();

  const activity = MOCK_ACTIVITIES.find(a => a.id === selectedActivityId) || MOCK_ACTIVITIES[0];
  const relatedEvents = MOCK_EVENTS.filter(e => e.activityId === activity.id);
  const targetEvent = relatedEvents.find(e => e.status === 'upcoming') || relatedEvents[0];

  // Media Player State for CEO Talk
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Hoạt động VCF', route: 'activities' },
          { label: activity.title }
        ]}
      />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C3: Template chi tiết 1 hoạt động [Trang phụ]" type="page" />
            <span className="text-neutral-600">Biến thể: <strong>{activity.title}</strong> (1 trong 9 biến thể)</span>
          </div>
          <div className="flex gap-1">
            <select
              value={activity.id}
              onChange={(e) => navigateTo('activity-detail', { activityId: e.target.value as any })}
              className="bg-white border border-neutral-300 rounded-full px-3 py-1 text-xs font-sans focus:outline-none focus:border-[#eb1000]"
            >
              {MOCK_ACTIVITIES.map(a => (
                <option key={a.id} value={a.id}>Đổi sang: {a.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Layout: Desktop 2-column (8 cols content + 4 cols sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 8 Cols Main Content */}
        <div className="lg:col-span-8 space-y-10">
          {/* Section 1: Hero & Objectives */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full inline-block">
                Hoạt động Trọng tâm VCF
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                {activity.title}
              </h1>
            </div>

            {/* Large Cover Placeholder */}
            <WireframeImage
              label={activity.coverImagePlaceholder}
              aspectRatio="16:9"
              className="w-full rounded-lg border border-neutral-200 shadow-xs"
            />

            <div className="space-y-4 text-neutral-800 leading-relaxed font-sans">
              <p className="text-base font-medium">{activity.fullDesc}</p>

              <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-3 shadow-xs">
                <h3 className="font-bold text-sm text-black uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#eb1000]" />
                  Mục Tiêu & Giá Trị Cốt Lõi
                </h3>
                <ul className="space-y-2 text-xs text-neutral-600">
                  {activity.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#eb1000] mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Frequency & Schedule */}
          <div className="border-t border-neutral-200 pt-6 space-y-3">
            <h3 className="font-bold text-base text-black tracking-tight">
              Lịch & Tần Suất Tổ Chức
            </h3>
            <div className="p-4 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#eb1000] shrink-0" />
              <div>
                <div className="font-bold text-sm text-black">{activity.frequency}</div>
                <div className="text-xs text-neutral-500 font-sans">Thông tin lịch trình được cập nhật định kỳ qua Ban Thư ký VCF</div>
              </div>
            </div>
          </div>

          {/* VARIANT-SPECIFIC BLOCKS (9 DISTINCT ACTIVITIES) */}
          
          {/* VARIANT 3: CEO Mentoring */}
          {activity.id === 'ceo-mentoring' && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              {showSpecAnnotations && (
                <SpecBadge label="Biến thể CEO Mentoring: Danh sách Mentor + CTA Đăng ký" type="prd" />
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-black">
                  Đội Ngũ Mentor & Chuyên Gia Cố Vấn Tiêu Biểu
                </h3>
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigateTo('event-detail', { eventId: 'event-mentoring-kickoff' })}
                >
                  Đăng ký tham gia phiên cố vấn
                </CustomButton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_MENTORS.map((m) => (
                  <AuthorMentorCard 
                    key={m.id} 
                    mentor={m} 
                    onSelect={() => navigateTo('event-detail', { eventId: 'event-mentoring-kickoff' })} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* VARIANT 4: CEO Peer Group */}
          {activity.id === 'ceo-peer-group' && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              {showSpecAnnotations && (
                <SpecBadge label="Biến thể CEO Peer Group: Danh sách nhóm & Lịch sinh hoạt" type="prd" />
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-black">
                  Các Nhóm Đồng Cấp Đang Hoạt Động
                </h3>
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigateTo('event-detail', { eventId: 'event-peer-hanoi' })}
                >
                  Đăng ký tham gia Nhóm
                </CustomButton>
              </div>

              <div className="space-y-4">
                {[
                  {
                    code: 'PG-01',
                    name: 'Peer Group Doanh nghiệp Sản xuất & Công nghiệp nặng',
                    members: '8 CEO thành viên',
                    leader: 'Chủ tịch HĐQT Tập đoàn Cơ khí & Đúc chế tạo',
                    schedule: 'Thứ Năm tuần thứ 2 hàng tháng (18:00 - 21:00)'
                  },
                  {
                    code: 'PG-02',
                    name: 'Peer Group Bán lẻ Đa kênh, E-commerce & Tiêu dùng nhanh',
                    members: '10 CEO thành viên',
                    leader: 'Tổng Giám đốc Hệ thống Phân phối Tiêu dùng Toàn quốc',
                    schedule: 'Thứ Sáu tuần thứ 3 hàng tháng (17:30 - 20:30)'
                  },
                  {
                    code: 'PG-03',
                    name: 'Peer Group Công nghệ Số, SaaS & Trí tuệ Nhân tạo',
                    members: '9 CEO / Founder thành viên',
                    leader: 'CTO / Viện trưởng Viện AI PTIT',
                    schedule: 'Thứ Bảy tuần thứ 1 hàng tháng (08:30 - 11:30)'
                  }
                ].map((pg, i) => (
                  <div key={i} className="border border-neutral-200 p-5 bg-white rounded-lg shadow-xs flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded-sm">
                          {pg.code}
                        </span>
                        <span className="text-xs text-[#eb1000] font-bold">{pg.members}</span>
                      </div>
                      <h4 className="font-bold text-base text-black">{pg.name}</h4>
                      <p className="text-xs text-neutral-600">Điều phối trưởng: <strong className="text-black">{pg.leader}</strong></p>
                      <p className="text-xs text-neutral-500">Lịch định kỳ: {pg.schedule}</p>
                    </div>
                    <div className="shrink-0 flex sm:flex-col justify-end">
                      <CustomButton
                        variant="secondary"
                        size="sm"
                        onClick={() => navigateTo('event-detail', { eventId: 'event-peer-hanoi' })}
                      >
                        Ứng tuyển vào nhóm
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VARIANT 5: Trường phái LGM */}
          {activity.id === 'lgm-school' && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              {showSpecAnnotations && (
                <SpecBadge label="Biến thể Trường phái LGM: Link trực tiếp sang Hệ tri thức LGM (C6)" type="prd" />
              )}
              <div className="bg-black text-white rounded-lg p-6 md:p-8 space-y-4 shadow-xs">
                <h3 className="text-xl font-black">Khám Phá Học Thuyết Quản Trị LGM Việt Nam</h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                  Toàn bộ các công trình nghiên cứu, bài viết chuyên luận của Bộ trưởng Nguyễn Mạnh Hùng và các chuyên gia Hội đồng Khoa học được lưu trữ tại Hệ Tri Thức LGM.
                </p>
                <CustomButton
                  variant="primary"
                  size="md"
                  onClick={() => navigateTo('knowledge')}
                >
                  Truy cập Hệ Tri Thức LGM →
                </CustomButton>
              </div>
            </div>
          )}

          {/* VARIANT 6: Xây dựng hệ tri thức & Xuất bản */}
          {activity.id === 'knowledge-publication' && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              {showSpecAnnotations && (
                <SpecBadge label="Biến thể Xuất bản: Danh mục ấn phẩm / Báo cáo" type="prd" />
              )}
              <h3 className="text-xl font-black text-black">
                Danh Mục Ấn Phẩm & Báo Cáo Chuyên Khảo
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Báo cáo Thường niên: Năng lực Lãnh đạo Doanh nghiệp Việt Nam 2026',
                    author: 'Ban Nghiên cứu Học thuật VLGM & PTIT',
                    pages: '148 trang',
                    release: 'Quý III/2026',
                    type: 'Báo cáo PDF'
                  },
                  {
                    title: 'Cẩm nang Quản trị Khủng hoảng & Kiểm soát Rủi ro Dòng tiền',
                    author: 'Hội đồng Cố vấn Tài chính VCF',
                    pages: '96 trang',
                    release: 'Tháng 06/2026',
                    type: 'Ebook / Tài liệu lưu hành nội bộ'
                  }
                ].map((pub, i) => (
                  <div key={i} className="border border-neutral-200 p-5 bg-white rounded-lg shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-red-50 text-[#eb1000] border border-red-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        {pub.type}
                      </span>
                      <h4 className="font-bold text-sm text-black">{pub.title}</h4>
                      <div className="text-xs text-neutral-500">
                        {pub.author} • {pub.pages} • Phát hành: {pub.release}
                      </div>
                    </div>
                    <CustomButton
                      variant="secondary"
                      size="sm"
                      onClick={() => navigateTo('knowledge')}
                    >
                      Tra cứu tại Hệ tri thức
                    </CustomButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VARIANT 8: CEO Talk (Media Player Embed & Episode List) */}
          {activity.id === 'ceo-talk' && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              {showSpecAnnotations && (
                <SpecBadge label="Biến thể CEO Talk: Video/Podcast Player + Số phát sóng" type="prd" />
              )}
              <h3 className="text-xl font-black text-black">
                Chương Trình Đối Thoại CEO Talk Mới Nhất
              </h3>

              {/* Embedded Player Simulator */}
              <div className="border border-neutral-800 bg-neutral-900 text-white rounded-lg p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 text-red-400 font-bold">
                    <Volume2 className="w-4 h-4" />
                    SỐ ĐẶC BIỆT #14 (AUDIO & VIDEO STREAM)
                  </span>
                  <span>Thời lượng: 58:20</span>
                </div>

                <h4 className="text-lg font-bold text-white">
                  CEO Talk #14: Quyết định Khó khăn Nhất — Bài học từ Khủng hoảng Vận hành
                </h4>
                <p className="text-xs text-neutral-300">
                  Khách mời: <strong>Trương Gia Bình</strong> (Chủ tịch HĐQT Tập đoàn FPT) • Host: TS. Nguyễn Thanh Tùng
                </p>

                {/* Player Controller */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-12 h-12 bg-[#eb1000] text-white rounded-full flex items-center justify-center font-bold hover:bg-[#c80e00] transition-colors shadow-xs"
                  >
                    {isPlayingAudio ? <span className="font-mono text-xs">PAUSE</span> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div className={`bg-[#eb1000] h-full ${isPlayingAudio ? 'w-2/5 animate-pulse' : 'w-0'}`} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                      <span>{isPlayingAudio ? '23:14' : '00:00'}</span>
                      <span>58:20</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border border-neutral-700 text-neutral-300 hover:text-white rounded-full" title="Chia sẻ">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VARIANT 9: CEO Club */}
          {activity.id === 'ceo-club' && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              {showSpecAnnotations && (
                <SpecBadge label="Biến thể CEO Club: Lịch sinh hoạt định kỳ + CTA Đăng ký tham gia" type="prd" />
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-black">
                  Lịch Giao Lưu & Thực Địa CLB Quý IV
                </h3>
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigateTo('event-detail', { eventId: 'event-club-fieldtrip' })}
                >
                  Đăng ký tham gia CLB
                </CustomButton>
              </div>

              <div className="space-y-3 text-xs">
                <div 
                  onClick={() => navigateTo('event-detail', { eventId: 'event-club-fieldtrip' })}
                  className="p-4 border border-neutral-200 hover:border-[#eb1000] bg-white rounded-lg shadow-xs flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div>
                    <strong className="text-black group-hover:text-[#eb1000] block font-sans text-sm transition-colors">Giải Giao Hữu Golf CEO Cup Mùa Thu</strong>
                    <span className="text-neutral-500">Sân Golf Long Biên, Hà Nội • 24/10/2026</span>
                  </div>
                  <span className="bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full font-bold group-hover:bg-[#eb1000] group-hover:text-white transition-colors">
                    Đăng ký tham dự →
                  </span>
                </div>
                <div 
                  onClick={() => navigateTo('event-detail', { eventId: 'event-club-fieldtrip' })}
                  className="p-4 border border-neutral-200 hover:border-[#eb1000] bg-white rounded-lg shadow-xs flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div>
                    <strong className="text-black group-hover:text-[#eb1000] block font-sans text-sm transition-colors">Chuyến Thăm Thực Địa Nhà Máy Công Nghệ Cao</strong>
                    <span className="text-neutral-500">KCN Quế Võ, Bắc Ninh • 14/11/2026</span>
                  </div>
                  <span className="bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full font-bold group-hover:bg-[#eb1000] group-hover:text-white transition-colors">
                    Đăng ký tham dự →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Block: Sự kiện đã và sắp diễn ra (nếu có sự kiện liên quan) */}
          {activity.hasEvents && relatedEvents.length > 0 && (
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-black">
                  Sự Kiện Thuộc Hoạt Động Này
                </h3>
                <CustomButton
                  variant="secondary"
                  size="sm"
                  onClick={() => navigateTo('events')}
                >
                  Xem toàn bộ lịch sự kiện
                </CustomButton>
              </div>

              <div className="space-y-4">
                {relatedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} layout="list" />
                ))}
              </div>
            </div>
          )}

          {/* Block: Tư liệu liên quan (Gallery placeholder) */}
          <div className="border-t border-neutral-200 pt-8 space-y-4">
            <h3 className="text-xl font-black text-black">
              Tư Liệu & Thư Viện Hình Ảnh
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <WireframeImage label="[Ảnh tư liệu 1: Khai mạc]" aspectRatio="4:3" className="rounded-lg" />
              <WireframeImage label="[Ảnh tư liệu 2: Thảo luận]" aspectRatio="4:3" className="rounded-lg" />
              <WireframeImage label="[Ảnh tư liệu 3: Ký kết]" aspectRatio="4:3" className="rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column: 4 Cols Sticky Sidebar (Quick Info & Main Action) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="border border-neutral-200 bg-white rounded-lg p-6 space-y-6 shadow-xs">
            <div className="space-y-2 pb-4 border-b border-neutral-100">
              <span className="text-[11px] uppercase font-bold text-[#eb1000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 inline-block">
                Thông Tin Tóm Tắt
              </span>
              <h3 className="text-lg font-black text-black">{activity.title}</h3>
              <p className="text-xs text-neutral-600">{activity.shortDesc}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Đơn vị chủ trì:</span>
                <strong className="text-black font-sans">Viện VLGM & Học viện PTIT</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Tần suất:</span>
                <strong className="text-black">{activity.frequency}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Hình thức tham gia:</span>
                <strong className="text-black">Dành riêng cho Hội viên VCF</strong>
              </div>
            </div>

            {isLoggedIn ? (
              targetEvent && (
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                    Sự kiện thuộc hoạt động:
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5">
                    <div className="font-bold text-xs text-black line-clamp-2 leading-snug">
                      {targetEvent.title}
                    </div>
                    <div className="text-[11px] text-neutral-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#eb1000] shrink-0" />
                      <span className="truncate">{targetEvent.datetime}</span>
                    </div>
                    <CustomButton
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => navigateTo('event-detail', { eventId: targetEvent.id })}
                    >
                      Đăng ký tham dự sự kiện →
                    </CustomButton>
                  </div>
                </div>
              )
            ) : (
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <CustomButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigateTo('register-member')}
                >
                  Đăng Ký Thành Viên VCF
                </CustomButton>

                <CustomButton
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigateTo('activities')}
                >
                  ← Quay lại danh sách 9 hoạt động
                </CustomButton>
              </div>
            )}
          </div>

          {/* Quick Contact Box */}
          <div className="border border-neutral-200 bg-neutral-50 rounded-lg p-4 text-xs text-neutral-600 space-y-2">
            <div className="font-bold text-black">Ban Thư Ký VCF:</div>
            <div>Hotline: (024) 3756 2186</div>
            <div>Email: vcf-secretariat@ptit.edu.vn</div>
          </div>
        </div>
      </div>
    </div>
  );
};
