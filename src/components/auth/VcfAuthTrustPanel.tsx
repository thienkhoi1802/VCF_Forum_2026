import React from 'react';
import { VcfLogo } from '../common/VcfLogo';

export const VcfAuthTrustPanel: React.FC = () => {
  return (
    <div className="flex flex-col justify-start max-w-xl">
      {/* Official VCF Logo */}
      <div className="mb-6">
        <VcfLogo height={48} />
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-neutral-900 tracking-tight leading-tight">
        Cổng Hội viên VCF
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mt-4 mb-10 sm:mb-12">
        Kết nối những nhà lãnh đạo Việt Nam, kiến tạo giá trị bền vững cho cộng đồng doanh nghiệp.
      </p>

      {/* 3 Benefits */}
      <div className="space-y-8 sm:space-y-9">
        {/* Benefit 1: Mở rộng quan hệ */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 shrink-0 text-neutral-900 mt-0.5" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
              Mở rộng quan hệ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              Kết nối với cộng đồng CEO, chuyên gia và đối tác uy tín.
            </p>
          </div>
        </div>

        {/* Benefit 2: Tiếp cận sự kiện */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 shrink-0 text-neutral-900 mt-0.5" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <rect width="18" height="18" x="3" y="4" rx="1" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
              Tiếp cận sự kiện
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              Tham dự các diễn đàn, hội thảo và chương trình dành riêng cho hội viên.
            </p>
          </div>
        </div>

        {/* Benefit 3: Đặc quyền hội viên */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 shrink-0 text-neutral-900 mt-0.5" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M6 3h12l4 6-10 12L2 9z" />
              <path d="M11 3 8 9l4 12 4-12-3-6" />
              <path d="M2 9h20" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
              Đặc quyền hội viên
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              Nhận thông tin sớm, nội dung chuyên sâu và cơ hội hợp tác chiến lược.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
