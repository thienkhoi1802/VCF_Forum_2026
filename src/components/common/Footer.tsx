import React, { useState } from 'react';
import { ChevronDown, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_ACTIVITIES } from '../../data/mockData';

export const Footer: React.FC = () => {
  const { navigateTo, currentRoute } = useApp();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (section: string) => setOpenSection((value) => (value === section ? null : section));

  const sectionButton = (id: string, title: string) => (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-expanded={openSection === id}
      className="flex py-3.5 w-full items-center justify-between border-t border-black/10 text-left text-sm font-semibold md:hidden cursor-pointer"
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
            <button type="button" onClick={() => navigateTo('home')} className="flex items-center gap-3 text-left cursor-pointer">
              <span className="flex size-10 items-center justify-center rounded-sm bg-brand-primary font-semibold text-white">VCF</span>
              <span>
                <span className="block text-sm font-semibold tracking-[-0.02em]">Diễn đàn CEO Việt Nam</span>
                <span className="block text-xs text-ink-secondary">Vietnam CEO Forum</span>
              </span>
            </button>
            <p className="mt-5 max-w-sm text-sm leading-6 text-ink-secondary">
              Nền tảng kết nối, chuyển giao tri thức và phát triển năng lực lãnh đạo cho cộng đồng người đứng đầu doanh nghiệp Việt Nam, hợp tác bởi VLGM và PTIT.
            </p>
            <address className="mt-6 space-y-3 text-sm not-italic text-ink-secondary">
              <p className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-primary" />122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</p>
              <p className="flex items-center gap-2.5"><Phone className="size-4 shrink-0 text-brand-primary" />(024) 3756 2186 · 0988 123 456</p>
              <p className="flex items-center gap-2.5"><Mail className="size-4 shrink-0 text-brand-primary" />vcf@ptit.edu.vn</p>
            </address>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0 md:gap-8 lg:gap-4 xl:gap-6 lg:col-span-8 xl:col-span-9">
            {/* 1. Giới thiệu */}
            <div>
              {sectionButton('about', 'Giới thiệu')}
              <div className={`${openSection === 'about' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Giới thiệu</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  <li><button type="button" onClick={() => navigateTo('about')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Về VCF</button></li>
                  <li><button type="button" onClick={() => navigateTo('about')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Tầm nhìn & Sứ mệnh</button></li>
                  <li><button type="button" onClick={() => navigateTo('about')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Hội đồng & Diễn giả</button></li>
                  <li><button type="button" onClick={() => navigateTo('about')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Hợp tác VLGM & PTIT</button></li>
                  <li><button type="button" onClick={() => navigateTo('about')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Liên hệ Ban tổ chức</button></li>
                </ul>
              </div>
            </div>

            {/* 2. Sự kiện */}
            <div>
              {sectionButton('events', 'Sự kiện')}
              <div className={`${openSection === 'events' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Sự kiện</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  <li><button type="button" onClick={() => navigateTo('events')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Lịch sự kiện 2026</button></li>
                  <li><button type="button" onClick={() => navigateTo('event-detail', { eventId: 'vcf-2026' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Diễn đàn CEO 2026</button></li>
                  <li><button type="button" onClick={() => navigateTo('events')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Tọa đàm chuyên đề</button></li>
                  <li><button type="button" onClick={() => navigateTo('events')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Kỷ yếu & Tài liệu</button></li>
                  <li><button type="button" onClick={() => navigateTo('events')} className="min-h-9 text-left font-medium text-brand-primary hover:text-brand-primary-hover cursor-pointer">Đăng ký tham dự</button></li>
                </ul>
              </div>
            </div>

            {/* 3. Hoạt động VCF */}
            <div>
              {sectionButton('activities', 'Hoạt động VCF')}
              <div className={`${openSection === 'activities' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Hoạt động VCF</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  {MOCK_ACTIVITIES.slice(0, 4).map((activity) => (
                    <li key={activity.id}><button type="button" onClick={() => navigateTo('activity-detail', { activityId: activity.id })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">{activity.title}</button></li>
                  ))}
                  <li><button type="button" onClick={() => navigateTo('activities')} className="min-h-9 font-medium text-brand-primary hover:text-brand-primary-hover cursor-pointer">Tất cả hoạt động →</button></li>
                </ul>
              </div>
            </div>

            {/* 4. Hệ tri thức */}
            <div>
              {sectionButton('knowledge', 'Hệ tri thức')}
              <div className={`${openSection === 'knowledge' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Hệ tri thức</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">BT Nguyễn Mạnh Hùng</button></li>
                  <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Góc nhìn chuyên gia</button></li>
                  <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Tri thức phái sinh</button></li>
                  <li><button type="button" onClick={() => navigateTo('knowledge', { category: 'all' })} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Kho bài viết & Nghiên cứu</button></li>
                </ul>
              </div>
            </div>

            {/* 5. Đào tạo và hội viên */}
            <div className="border-b border-black/10 md:border-b-0">
              {sectionButton('membership', 'Đào tạo và hội viên')}
              <div className={`${openSection === 'membership' ? 'block' : 'hidden'} md:block`}>
                <h2 className="mb-4 hidden text-sm font-semibold md:block">Đào tạo và hội viên</h2>
                <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                  <li><button type="button" onClick={() => navigateTo('programs')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Đào tạo CEO</button></li>
                  <li><button type="button" onClick={() => navigateTo('register-member')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Quyền lợi hội viên</button></li>
                  <li><button type="button" onClick={() => navigateTo('register-member')} className="min-h-9 text-left font-medium text-brand-primary hover:text-brand-primary-hover cursor-pointer">Trở thành hội viên</button></li>
                  <li><button type="button" onClick={() => navigateTo('login')} className="min-h-9 text-left hover:text-brand-primary cursor-pointer">Đăng nhập</button></li>
                </ul>
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
