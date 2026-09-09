import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlideItem {
  id: string;
  categoryBadge?: string;
  title: string;
  infoLine1: string;
  infoLine2?: string;
  bgImageUrl: string;
  altText: string;
  tintOverlay?: string;
  primaryCta: {
    label: string;
    action: () => void;
  };
  secondaryCta?: {
    label: string;
    action: () => void;
  };
}

export const HeroSlider: React.FC = () => {
  const { navigateTo, wireframeImageMode } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Exactly 5 flagship slides representing VCF, CEO Summit, CEO Forum, LGM School & Knowledge Hub
  const slides: HeroSlideItem[] = [
    {
      id: 'slide-summit-2026',
      categoryBadge: 'CEO SUMMIT 2026 • ĐẠI HỘI THƯỜNG NIÊN',
      title: 'Định hình Vị thế Doanh nghiệp Việt trong Kỷ nguyên AI & Chuyển đổi Xanh',
      infoLine1: '15 Tháng 10, 2026 | Trung tâm Hội nghị Quốc gia, Hà Nội',
      infoLine2: '500+ Lãnh đạo C-Level • Trực tiếp Hội nghị & Triển lãm Giải pháp',
      bgImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=85',
      altText: 'CEO Summit 2026 tại Trung tâm Hội nghị Quốc gia',
      tintOverlay: 'from-[#05232d]/90 via-[#0a313d]/70 to-[#02131a]/90',
      primaryCta: {
        label: 'ĐĂNG KÝ THAM DỰ HỘI NGHỊ',
        action: () => navigateTo('event-detail', { eventId: 'event-summit-2026' }),
      },
      secondaryCta: {
        label: 'XEM CHI TIẾT CHƯƠNG TRÌNH',
        action: () => navigateTo('event-detail', { eventId: 'event-summit-2026' }),
      },
    },
    {
      id: 'slide-forum-2026',
      categoryBadge: 'CEO FORUM QUÝ III',
      title: 'Tái cấu trúc Dòng tiền & Quản trị Rủi ro Tín dụng Doanh nghiệp',
      infoLine1: '18 Tháng 09, 2026 | Khách sạn Melia Hanoi, 44 Lý Thường Kiệt',
      infoLine2: 'Diễn đàn Bàn tròn Chuyên sâu 80 CEO • Cố vấn Tài chính Tiền tệ',
      bgImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=85',
      altText: 'CEO Forum Quý III',
      tintOverlay: 'from-[#0a2033]/90 via-[#102d45]/70 to-[#051320]/90',
      primaryCta: {
        label: 'XEM CHI TIẾT DIỄN ĐÀN',
        action: () => navigateTo('event-detail', { eventId: 'event-forum-fintech' }),
      },
      secondaryCta: {
        label: 'XEM TẤT CẢ SỰ KIỆN',
        action: () => navigateTo('events'),
      },
    },
    {
      id: 'slide-lgm-school',
      categoryBadge: 'TRƯỜNG PHÁI LGM • ĐÀO TẠO LÃNH ĐẠO',
      title: 'Phát triển Bản lĩnh & Năng lực Quản trị Điều hành Tinh hoa',
      infoLine1: 'Khai giảng Khóa Mùa Thu 2026 | Viện Lãnh đạo & Quản trị LGM & PTIT',
      infoLine2: 'Chương trình Độc quyền Dành riêng cho C-Level & Thế hệ Kế thừa',
      bgImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=85',
      altText: 'Trường phái Lãnh đạo LGM School',
      tintOverlay: 'from-[#1a173b]/90 via-[#231e4a]/70 to-[#0c0a1f]/90',
      primaryCta: {
        label: 'ỨNG TUYỂN CHƯƠNG TRÌNH',
        action: () => navigateTo('programs'),
      },
      secondaryCta: {
        label: 'TÌM HIỂU TRƯỜNG PHÁI LGM',
        action: () => navigateTo('activity-detail', { activityId: 'lgm-school' }),
      },
    },
    {
      id: 'slide-mentoring',
      categoryBadge: 'CEO MENTORING • ĐỒNG HÀNH CHIẾN LƯỢC',
      title: 'Kết nối Cố vấn 1:1 Cùng Các Chuyên Gia Quản Trị Kỳ Cựu',
      infoLine1: 'Mùa Cố vấn 2026-2027 | Hội đồng Cố vấn Cấp cao VLGM',
      infoLine2: 'Tháo gỡ Nút thắt Vận hành • Chuyển giao Tri thức Thực chiến',
      bgImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
      altText: 'CEO Mentoring Program',
      tintOverlay: 'from-[#1b2a26]/90 via-[#233833]/70 to-[#0e1715]/90',
      primaryCta: {
        label: 'ĐĂNG KÝ MENTEE MÙA MỚI',
        action: () => navigateTo('activity-detail', { activityId: 'ceo-mentoring' }),
      },
      secondaryCta: {
        label: 'KHÁM PHÁ HỆ SINH THÁI',
        action: () => navigateTo('activities'),
      },
    },
    {
      id: 'slide-knowledge-hub',
      categoryBadge: 'HỆ TRI THỨC QUẢN TRỊ • BÁO CÁO ĐẶC SAN',
      title: 'Đặc san Quản trị Chiến lược: Cẩm nang Chuyển đổi Xanh & AI',
      infoLine1: 'Xuất bản Quý IV/2026 | Viện Lãnh đạo & Quản trị LGM & PTIT',
      infoLine2: 'Đúc kết Thực tiễn từ 50+ Tập đoàn & Doanh nghiệp Tiên phong',
      bgImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85',
      altText: 'Kho Tri thức & Báo cáo Nghiên cứu LGM',
      tintOverlay: 'from-[#1c242b]/90 via-[#23303a]/70 to-[#0e1317]/90',
      primaryCta: {
        label: 'KHÁM PHÁ HỆ TRI THỨC',
        action: () => navigateTo('knowledge'),
      },
      secondaryCta: {
        label: 'ĐĂNG KÝ THÀNH VIÊN VCF',
        action: () => navigateTo('register-member'),
      },
    },
  ];

  const totalSlides = slides.length; // Maximum 5 slides

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play every 6.5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diffX = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;
      if (diffX > minSwipeDistance) {
        nextSlide();
      } else if (diffX < -minSwipeDistance) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      id="wan-ifra-hero-slider"
      className="relative w-full overflow-hidden select-none bg-neutral-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full min-h-[540px] sm:min-h-[580px] lg:h-[620px] xl:h-[660px] flex items-center justify-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background: Wireframe Canvas vs Photo Mode */}
              {wireframeImageMode === 'wireframe' ? (
                <div className="absolute inset-0 bg-neutral-950 overflow-hidden select-none">
                  {/* Blueprint Grid Texture */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Architectural Diagonal Cross Guide Lines */}
                  <svg className="absolute inset-0 w-full h-full text-neutral-800/60 pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 6" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 6" />
                  </svg>

                  {/* Corner Anchors */}
                  <div className="absolute top-4 left-4 font-mono text-[10px] text-neutral-600 select-none">+ [HERO_TOP_LEFT]</div>
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-neutral-600 select-none">+ [HERO_BOTTOM_LEFT]</div>
                  <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neutral-600 select-none">+ [HERO_BOTTOM_RIGHT]</div>

                  {/* Top Right High-Wireframe Spec Badge */}
                  <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-neutral-400 bg-neutral-900/95 border border-neutral-700/80 px-3 py-1 rounded-full shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>WIREFRAME HERO BANNER: 1920 × 640px • SLIDE {index + 1}/5</span>
                  </div>

                  {/* Center Keynote Visual Blueprint Box */}
                  <div className="absolute inset-x-8 sm:inset-x-16 md:inset-x-24 inset-y-12 border border-dashed border-neutral-800/60 rounded-2xl pointer-events-none" />

                  {/* Vignette Gradients for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/80" />
                </div>
              ) : (
                <>
                  {/* Photo Mode */}
                  <img
                    src={slide.bgImageUrl}
                    alt={slide.altText}
                    className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      slide.tintOverlay || 'from-black/85 via-black/55 to-black/75'
                    }`}
                  />
                </>
              )}

              {/* Slide Content Box: Center Aligned (Tham khảo phong cách WAN-IFRA) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 text-center z-10 pt-4 pb-16 sm:pb-20">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                  {/* Category Pill / Tag */}
                  {slide.categoryBadge && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#eb1000]" />
                      <span>{slide.categoryBadge}</span>
                    </div>
                  )}

                  {/* Main Title: Large, bold display headline in crisp white */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.18] tracking-tight drop-shadow-md max-w-3xl">
                    {slide.title}
                  </h1>

                  {/* Information Lines (Date, Location, Format) */}
                  <div className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-2xl space-y-1 drop-shadow-xs">
                    <div>{slide.infoLine1}</div>
                    {slide.infoLine2 && (
                      <div className="text-white/80">{slide.infoLine2}</div>
                    )}
                  </div>

                  {/* CTAs: WAN-IFRA Signature Pill Buttons */}
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
                    {/* Primary CTA */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        slide.primaryCta.action();
                      }}
                      className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-white text-[#005bb5] hover:bg-neutral-100 active:scale-98 font-black uppercase tracking-wider text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      {slide.primaryCta.label}
                    </button>

                    {/* Secondary CTA */}
                    {slide.secondaryCta && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          slide.secondaryCta?.action();
                        }}
                        className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-white text-[#005bb5] hover:bg-neutral-100 active:scale-98 font-black uppercase tracking-wider text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        {slide.secondaryCta.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Left (WAN-IFRA circular white button with blue chevron) */}
      <button
        type="button"
        id="hero-slider-prev"
        onClick={prevSlide}
        aria-label="Slide trước"
        className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#005bb5] rounded-full shadow-xl flex items-center justify-center hover:bg-neutral-100 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#005bb5] -translate-x-0.5" />
      </button>

      {/* Navigation Arrow Right (WAN-IFRA circular white button with blue chevron) */}
      <button
        type="button"
        id="hero-slider-next"
        onClick={nextSlide}
        aria-label="Slide tiếp theo"
        className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#005bb5] rounded-full shadow-xl flex items-center justify-center hover:bg-neutral-100 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#005bb5] translate-x-0.5" />
      </button>

      {/* Pagination Dots (WAN-IFRA bottom center dots, maximum 5 dots) */}
      <div
        id="hero-slider-dots"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-3.5"
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={`dot-${slide.id}`}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Chuyển tới slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                isActive
                  ? 'w-3.5 h-3.5 bg-transparent border-2 border-white ring-2 ring-white/50 scale-125'
                  : 'w-3 h-3 bg-white/70 hover:bg-white'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
