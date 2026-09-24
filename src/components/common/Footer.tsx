import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { VcfLogo } from './VcfLogo';

export const Footer: React.FC = () => {
  const { navigateTo, currentRoute } = useApp();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (section: string) => setOpenSection((value) => (value === section ? null : section));

  const sectionButton = (id: string, title: string) => (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-expanded={openSection === id}
      className="flex py-3.5 w-full items-center justify-between border-t border-black/10 text-left text-sm font-semibold md:hidden cursor-pointer hover:text-brand-primary"
    >
      {title}
      <ChevronDown className={`size-4 transition-transform ${openSection === id ? 'rotate-180' : ''}`} />
    </button>
  );

  const isEventDetail = currentRoute === 'event-detail';

  return (
    <footer className={`border-t border-black/8 bg-parchment text-ink ${isEventDetail ? 'pb-20 lg:pb-0' : ''}`}>
      <div className="vcf-container py-10 sm:py-16">
        <div className="grid gap-0 md:gap-10 border-b border-black/10 pb-8 md:pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="pb-6 md:pb-0 lg:col-span-4 xl:col-span-3">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center text-left cursor-pointer transition-opacity hover:opacity-90"
              aria-label="Về trang chủ Vietnam CEO Forum"
            >
              <VcfLogo height={52} />
            </button>
            <p className="mt-5 w-full max-w-[2000px] text-sm leading-6 text-ink-secondary">
              Nền tảng kết nối, chuyển giao tri thức và phát triển năng lực lãnh đạo cho cộng đồng người đứng đầu doanh nghiệp Việt Nam, hợp tác bởi VLGM và PTIT.
            </p>
            <address className="mt-6 space-y-3 text-sm not-italic text-ink-secondary">
              <p className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-primary" />122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</p>
              <p className="flex items-center gap-2.5"><Phone className="size-4 shrink-0 text-brand-primary" />(024) 3756 2186 · 0988 123 456</p>
              <p className="flex items-center gap-2.5"><Mail className="size-4 shrink-0 text-brand-primary" />vcf@ptit.edu.vn</p>
            </address>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0 md:gap-8 lg:gap-4 xl:gap-6 lg:col-span-8 xl:col-span-9">
            {/* A. Hệ tri thức */}
            <div>
              {sectionButton('knowledge', 'Hệ tri thức')}
              <div className={`${openSection === 'knowledge' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Hệ tri thức</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Tác giả BT. Nguyễn Mạnh Hùng</button></li>
                  <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Góc nhìn chuyên gia</button></li>
                  <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Tri thức phái sinh</button></li>
                  <li><button type="button" onClick={() => navigateTo('knowledge', { category: 'all' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Kho bài viết & Nghiên cứu</button></li>
                </ul>
              </div>
            </div>

            {/* B. Sự kiện */}
            <div>
              {sectionButton('events', 'Sự kiện')}
              <div className={`${openSection === 'events' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Sự kiện</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  <li><button type="button" onClick={() => navigateTo('events', { timingFilter: 'upcoming' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Sắp diễn ra</button></li>
                  <li><button type="button" onClick={() => navigateTo('events', { timingFilter: 'ongoing' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Đang diễn ra</button></li>
                  <li><button type="button" onClick={() => navigateTo('events', { timingFilter: 'past' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Đã kết thúc</button></li>
                </ul>
              </div>
            </div>

            {/* C. Hoạt động VCF (9 hoạt động) */}
            <div>
              {sectionButton('activities', 'Hoạt động VCF (9 hoạt động)')}
              <div className={`${openSection === 'activities' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Hoạt động VCF</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  {MOCK_ACTIVITIES.slice(0, 4).map((activity) => (
                    <li key={activity.id}><button type="button" onClick={() => navigateTo('activity-detail', { activityId: activity.id })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">{activity.title}</button></li>
                  ))}
                  <li><button type="button" onClick={() => navigateTo('activities')} className="min-h-9 font-medium text-brand-primary hover:text-brand-primary-hover cursor-pointer">Xem tổng quan 9 hoạt động →</button></li>
                </ul>
              </div>
            </div>

            {/* D. Đào tạo CEO: Không cần droplist */}
            <div>
              <button 
                type="button" 
                onClick={() => navigateTo('programs')} 
                className="flex py-3.5 w-full items-center justify-between border-t border-black/10 text-left text-sm font-semibold md:hidden cursor-pointer hover:text-brand-primary"
              >
                Đào tạo CEO
                <ChevronRight className="size-4 text-ink-secondary" />
              </button>
              <div className="hidden md:block">
                <button 
                  type="button" 
                  onClick={() => navigateTo('programs')} 
                  className="mb-4 text-sm font-semibold text-left hover:text-brand-primary cursor-pointer inline-flex items-center gap-1.5"
                >
                  Đào tạo CEO
                  <ChevronRight className="size-3.5 text-ink-secondary" />
                </button>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Chương trình đào tạo tinh hoa LGM Mastery và Strategic CFO dành cho lãnh đạo cấp cao.
                </p>
              </div>
            </div>

            {/* E. Giới thiệu: Không cần droplist */}
            <div className="border-b border-black/10 md:border-b-0">
              <button 
                type="button" 
                onClick={() => navigateTo('about')} 
                className="flex py-3.5 w-full items-center justify-between border-t border-black/10 text-left text-sm font-semibold md:hidden cursor-pointer hover:text-brand-primary"
              >
                Giới thiệu
                <ChevronRight className="size-4 text-ink-secondary" />
              </button>
              <div className="hidden md:block">
                <button 
                  type="button" 
                  onClick={() => navigateTo('about')} 
                  className="mb-4 text-sm font-semibold text-left hover:text-brand-primary cursor-pointer inline-flex items-center gap-1.5"
                >
                  Giới thiệu
                  <ChevronRight className="size-3.5 text-ink-secondary" />
                </button>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Nền tảng kết nối, chuyển giao tri thức và phát triển năng lực lãnh đạo doanh nghiệp Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs leading-5 text-ink-secondary md:flex-row md:items-center md:justify-between">
          <p>© 2026 Diễn đàn CEO Việt Nam · VLGM & PTIT.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-brand-primary" />Bảo vệ dữ liệu cá nhân</span>
            <button type="button" className="hover:text-ink">Điều khoản sử dụng</button>
            <button type="button" className="hover:text-ink">Quyền riêng tư</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
