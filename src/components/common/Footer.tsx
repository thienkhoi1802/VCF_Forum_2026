import React, { useState } from 'react';
import { ChevronDown, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_ACTIVITIES } from '../../data/mockData';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();
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

  return (
    <footer className="border-t border-black/8 bg-parchment text-ink">
      <div className="vcf-container py-10 sm:py-16">
        <div className="grid gap-0 md:gap-10 border-b border-black/10 pb-8 md:pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2 pb-6 md:pb-0">
            <button type="button" onClick={() => navigateTo('home')} className="flex items-center gap-3 text-left">
              <span className="flex size-10 items-center justify-center rounded-sm bg-brand-primary font-semibold text-white">VCF</span>
              <span>
                <span className="block text-sm font-semibold tracking-[-0.02em]">Diễn đàn CEO Việt Nam</span>
                <span className="block text-xs text-ink-secondary">Vietnam CEO Forum</span>
              </span>
            </button>
            <p className="mt-5 max-w-md text-sm leading-6 text-ink-secondary">
              Nền tảng kết nối, chuyển giao tri thức và phát triển năng lực lãnh đạo cho cộng đồng người đứng đầu doanh nghiệp Việt Nam, hợp tác bởi VLGM và PTIT.
            </p>
            <address className="mt-6 space-y-3 text-sm not-italic text-ink-secondary">
              <p className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-primary" />122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</p>
              <p className="flex items-center gap-2.5"><Phone className="size-4 shrink-0 text-brand-primary" />(024) 3756 2186 · 0988 123 456</p>
              <p className="flex items-center gap-2.5"><Mail className="size-4 shrink-0 text-brand-primary" />vcf@ptit.edu.vn</p>
            </address>
          </div>

          <div>
            {sectionButton('activities', 'Hoạt động VCF')}
            <div className={`${openSection === 'activities' ? 'block' : 'hidden'} md:block`}>
              <h2 className="mb-4 hidden text-sm font-semibold md:block">Hoạt động VCF</h2>
              <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                {MOCK_ACTIVITIES.slice(0, 5).map((activity) => (
                  <li key={activity.id}><button type="button" onClick={() => navigateTo('activity-detail', { activityId: activity.id })} className="min-h-9 text-left hover:text-brand-primary">{activity.title}</button></li>
                ))}
                <li><button type="button" onClick={() => navigateTo('activities')} className="min-h-9 font-medium text-brand-primary hover:text-brand-primary-hover">Tất cả hoạt động →</button></li>
              </ul>
            </div>
          </div>

          <div>
            {sectionButton('knowledge', 'Hệ tri thức')}
            <div className={`${openSection === 'knowledge' ? 'block' : 'hidden'} md:block`}>
              <h2 className="mb-4 hidden text-sm font-semibold md:block">Hệ tri thức</h2>
              <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })} className="min-h-9 text-left hover:text-brand-primary">BT Nguyễn Mạnh Hùng</button></li>
                <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })} className="min-h-9 text-left hover:text-brand-primary">Góc nhìn chuyên gia</button></li>
                <li><button type="button" onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })} className="min-h-9 text-left hover:text-brand-primary">Tri thức phái sinh</button></li>
                <li><button type="button" onClick={() => navigateTo('events')} className="min-h-9 text-left hover:text-brand-primary">Lịch sự kiện</button></li>
              </ul>
            </div>
          </div>

          <div className="border-b border-black/10 md:border-b-0">
            {sectionButton('membership', 'Đào tạo và hội viên')}
            <div className={`${openSection === 'membership' ? 'block' : 'hidden'} md:block`}>
              <h2 className="mb-4 hidden text-sm font-semibold md:block">Đào tạo và hội viên</h2>
              <ul className="space-y-1.5 pb-3 text-sm text-ink-secondary md:pb-0">
                <li><button type="button" onClick={() => navigateTo('programs')} className="min-h-9 text-left hover:text-brand-primary">Đào tạo CEO</button></li>
                <li><button type="button" onClick={() => navigateTo('about')} className="min-h-9 text-left hover:text-brand-primary">Về VCF</button></li>
                <li><button type="button" onClick={() => navigateTo('register-member')} className="min-h-9 text-left font-medium text-brand-primary hover:text-brand-primary-hover">Trở thành hội viên</button></li>
                <li><button type="button" onClick={() => navigateTo('login')} className="min-h-9 text-left hover:text-brand-primary">Đăng nhập</button></li>
              </ul>
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
