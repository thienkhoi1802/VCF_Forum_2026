import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface HeroSlideItem {
  id: string;
  tagline?: string;
  title: string;
  subtitle?: string;
  bgImageUrl: string;
  altText: string;
  primaryCta: { label: string; action: () => void };
  secondaryCta?: { label: string; action: () => void };
}

export const HeroSlider: React.FC = () => {
  const { navigateTo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const slides: HeroSlideItem[] = [
    {
      id: 'slide-summit-2026',
      tagline: 'CEO Summit 2026 · Đại hội thường niên',
      title: 'Định hình vị thế doanh nghiệp Việt trong kỷ nguyên AI và chuyển đổi xanh',
      subtitle: '500+ lãnh đạo C-Level · Hội nghị và triển lãm giải pháp',
      bgImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=88',
      altText: 'Không gian hội nghị CEO Summit 2026',
      primaryCta: {
        label: 'Đăng ký tham dự',
        action: () => navigateTo('event-detail', { eventId: 'event-summit-2026' }),
      },
      secondaryCta: {
        label: 'Xem chương trình',
        action: () => navigateTo('event-detail', { eventId: 'event-summit-2026' }),
      },
    },
    {
      id: 'slide-forum-2026',
      tagline: 'CEO Forum · Quý III/2026',
      title: 'Tái cấu trúc dòng tiền và quản trị rủi ro tín dụng doanh nghiệp',
      subtitle: 'Diễn đàn bàn tròn chuyên sâu dành cho 80 CEO',
      bgImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2200&q=88',
      altText: 'Diễn đàn bàn tròn dành cho lãnh đạo doanh nghiệp',
      primaryCta: {
        label: 'Xem chi tiết diễn đàn',
        action: () => navigateTo('event-detail', { eventId: 'event-forum-fintech' }),
      },
      secondaryCta: { label: 'Tất cả sự kiện', action: () => navigateTo('events') },
    },
    {
      id: 'slide-lgm-school',
      tagline: 'LGM School · Đào tạo lãnh đạo',
      title: 'Phát triển bản lĩnh và năng lực quản trị điều hành tinh hoa',
      subtitle: 'Chương trình dành riêng cho C-Level và thế hệ kế thừa',
      bgImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2200&q=88',
      altText: 'Lớp học dành cho lãnh đạo doanh nghiệp',
      primaryCta: { label: 'Ứng tuyển chương trình', action: () => navigateTo('programs') },
      secondaryCta: {
        label: 'Tìm hiểu LGM School',
        action: () => navigateTo('activity-detail', { activityId: 'lgm-school' }),
      },
    },
    {
      id: 'slide-mentoring',
      tagline: 'CEO Mentoring · Đồng hành chiến lược',
      title: 'Kết nối cố vấn 1:1 cùng các chuyên gia quản trị kỳ cựu',
      subtitle: 'Tháo gỡ nút thắt vận hành · Chuyển giao tri thức thực chiến',
      bgImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=88',
      altText: 'Cố vấn chiến lược dành cho CEO',
      primaryCta: {
        label: 'Đăng ký mùa mới',
        action: () => navigateTo('activity-detail', { activityId: 'ceo-mentoring' }),
      },
      secondaryCta: { label: 'Khám phá hệ sinh thái', action: () => navigateTo('activities') },
    },
    {
      id: 'slide-knowledge-hub',
      tagline: 'Hệ tri thức quản trị · Đặc san',
      title: 'Cẩm nang chiến lược cho chuyển đổi xanh và trí tuệ nhân tạo',
      subtitle: 'Đúc kết thực tiễn từ hơn 50 doanh nghiệp tiên phong',
      bgImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2200&q=88',
      altText: 'Không gian làm việc và nghiên cứu quản trị',
      primaryCta: { label: 'Khám phá hệ tri thức', action: () => navigateTo('knowledge') },
      secondaryCta: { label: 'Trở thành hội viên', action: () => navigateTo('register-member') },
    },
  ];

  const activeSlide = slides[currentSlide];
  const nextSlide = useCallback(() => setCurrentSlide((value) => (value + 1) % slides.length), [slides.length]);
  const previousSlide = useCallback(() => setCurrentSlide((value) => (value - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) setIsPaused(true);
  }, []);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(nextSlide, 7000);
    return () => window.clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 50) nextSlide();
      if (distance < -50) previousSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Nội dung nổi bật của VCF"
      className="relative min-h-[590px] overflow-hidden bg-surface-dark text-white sm:min-h-[650px] lg:min-h-[690px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
      onTouchMove={(event) => { touchEndX.current = event.touches[0].clientX; }}
      onTouchEnd={handleTouchEnd}
    >
      <img
        key={activeSlide.id}
        src={activeSlide.bgImageUrl}
        alt={activeSlide.altText}
        className="absolute inset-0 h-full w-full object-cover animate-fadeIn"
        loading={currentSlide === 0 ? 'eager' : 'lazy'}
        fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="vcf-container relative z-10 flex min-h-[590px] items-end pb-20 pt-24 sm:min-h-[650px] sm:pb-24 lg:min-h-[690px] lg:items-center lg:py-28">
        <div key={`${activeSlide.id}-copy`} className="max-w-4xl animate-fadeIn">
          {activeSlide.tagline ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
              {activeSlide.tagline}
            </p>
          ) : null}
          <h1 className="max-w-4xl text-[clamp(2.35rem,6vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-white">
            {activeSlide.title}
          </h1>
          {activeSlide.subtitle ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {activeSlide.subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={activeSlide.primaryCta.action}
              className="min-h-12 rounded-full bg-brand-primary px-7 py-3 text-[15px] font-medium text-white transition hover:bg-brand-primary-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {activeSlide.primaryCta.label}
            </button>
            {activeSlide.secondaryCta ? (
              <button
                type="button"
                onClick={activeSlide.secondaryCta.action}
                className="min-h-12 rounded-full border border-white/65 bg-transparent px-7 py-3 text-[15px] font-medium text-white transition hover:bg-white hover:text-ink active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {activeSlide.secondaryCta.label}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 sm:bottom-7 sm:gap-2 sm:rounded-full sm:bg-black/35 sm:px-3 sm:py-2 sm:backdrop-blur-md">
        <button 
          type="button" 
          onClick={previousSlide} 
          aria-label="Nội dung trước" 
          className="hidden size-11 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white sm:flex"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" aria-label={`Trang ${currentSlide + 1} trên ${slides.length}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Xem nội dung ${index + 1}: ${slide.title}`}
              aria-current={index === currentSlide ? 'true' : undefined}
              className="p-1 sm:p-0 flex items-center justify-center focus-visible:outline-none"
            >
              <span
                className={`block transition-all ${
                  index === currentSlide
                    ? 'h-1.5 w-3.5 bg-white sm:h-2.5 sm:w-7 shadow-sm'
                    : 'size-1.5 bg-white/45 hover:bg-white/80 sm:size-2.5'
                }`}
              />
            </button>
          ))}
        </div>

        <button 
          type="button" 
          onClick={nextSlide} 
          aria-label="Nội dung tiếp theo" 
          className="hidden size-11 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white sm:flex"
        >
          <ChevronRight className="size-5" />
        </button>

        <button 
          type="button" 
          onClick={() => setIsPaused((value) => !value)} 
          aria-label={isPaused ? 'Tiếp tục tự chuyển' : 'Tạm dừng tự chuyển'} 
          aria-pressed={isPaused} 
          className="hidden size-11 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white sm:flex"
        >
          {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>
    </section>
  );
};
