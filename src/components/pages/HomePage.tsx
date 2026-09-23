import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../common/CustomButton';
import { EventCard } from '../common/EventCard';
import { ArticleCard } from '../common/ArticleCard';
import { KnowledgeFeaturedGrid } from '../common/KnowledgeFeaturedGrid';
import { ProgramCard } from '../common/ProgramCard';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { SkeletonLoader } from '../wireframe/SkeletonLoader';
import { HeroSlider } from '../common/HeroSlider';
import { 
  MOCK_EVENTS, 
  MOCK_ARTICLES, 
  MOCK_PROGRAMS, 
  MOCK_ACTIVITIES 
} from '../../data/mockData';
import { 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  Users, 
  BookOpen, 
  Calendar, 
  Sparkles,
  ArrowUpRight,
  Target,
  GraduationCap,
  Globe,
  Award,
  Video,
  MessagesSquare
} from 'lucide-react';
import { ActivityId } from '../../types';

export const HomePage: React.FC = () => {
  const { 
    navigateTo, 
    showSpecAnnotations, 
    simulatedState,
    isLoggedIn,
    currentUser
  } = useApp();

  const isUserLoggedIn = isLoggedIn || simulatedState === 'S-LOGGED-IN';
  const isLoading = simulatedState === 'S-LOADING';
  const isEmpty = simulatedState === 'S-EMPTY';

  const getActivityIcon = (id: ActivityId) => {
    switch (id) {
      case 'ceo-summit': return <Building2 className="w-5 h-5 text-brand-primary" />;
      case 'ceo-forum': return <Users className="w-5 h-5 text-brand-primary" />;
      case 'ceo-mentoring': return <Target className="w-5 h-5 text-brand-primary" />;
      case 'ceo-peer-group': return <Users className="w-5 h-5 text-brand-primary" />;
      case 'lgm-school': return <GraduationCap className="w-5 h-5 text-brand-primary" />;
      case 'knowledge-publication': return <BookOpen className="w-5 h-5 text-brand-primary" />;
      case 'website-app': return <Globe className="w-5 h-5 text-brand-primary" />;
      case 'ceo-talk': return <Video className="w-5 h-5 text-brand-primary" />;
      case 'ceo-club': return <Award className="w-5 h-5 text-brand-primary" />;
      default: return <Sparkles className="w-5 h-5 text-brand-primary" />;
    }
  };

  return (
    <div className="pb-0 font-sans">
      {/* =========================================================================
          BLOCK 2: HERO BANNER (DẠNG SLIDE WAN-IFRA THEO YÊU CẦU NGƯỜI DÙNG)
          Tham chiếu: https://wan-ifra.org/
          Dạng slide + hiện thông tin + CTA (Tối đa 5 slide)
          ========================================================================= */}
      <section className="w-full -mt-0">
        {showSpecAnnotations && (
          <div className="vcf-container pb-3 flex items-center gap-2">
            <SpecBadge label="Hero Banner: Dạng Slide WAN-IFRA (Tối đa 5 slide)" type="prd" />
            <SpecBadge label="State: S-LOGGED-IN / S-GUEST" type="state" />
          </div>
        )}
        <HeroSlider />
      </section>

      {/* =========================================================================
          BLOCK 3: BÀI VIẾT TRI THỨC NỔI BẬT (Chỉ hiện Thumb + Title + Subfolder)
          ========================================================================= */}
      {!isEmpty && (
        <section className="vcf-section">
          <div className="vcf-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              {showSpecAnnotations && (
                <div className="flex items-center gap-2 mb-1">
                  <SpecBadge label="Block 3: Bài viết tri thức nổi bật" type="prd" />
                  <SpecBadge label="Chỉ hiện Thumb + Title + Subfolder" type="source" />
                </div>
              )}
              <h2 className="vcf-section-title">
                Bài Viết Tri Thức Nổi Bật
              </h2>
              <p className="vcf-lead mt-2">
                Tri thức lãnh đạo, quản trị thực chiến và góc nhìn vĩ mô từ Hội đồng Cố vấn & chuyên gia
              </p>
            </div>

            {/* Desktop CTA: Nằm bên phải tiêu đề trên màn hình sm trở lên */}
            <div className="hidden sm:block shrink-0">
              <CustomButton
                variant="secondary"
                size="sm"
                onClick={() => navigateTo('knowledge')}
              >
                Khám phá Hệ tri thức LGM →
              </CustomButton>
            </div>
          </div>

          {/* State Handling for Knowledge Articles (Giữ chỉ 3 tin nổi bật) */}
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : (
            <>
              <KnowledgeFeaturedGrid articles={MOCK_ARTICLES.slice(0, 3)} />

              {/* Mobile CTA: Hiển thị xuống dưới 3 tin tức trên mobile */}
              <div className="pt-6 sm:hidden">
                <CustomButton
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => navigateTo('knowledge')}
                  className="border-neutral-300 hover:border-black text-sm font-semibold shadow-xs py-3"
                >
                  Khám phá Hệ tri thức LGM →
                </CustomButton>
              </div>
            </>
          )}
          </div>
        </section>
      )}

      {/* =========================================================================
          BLOCK 4: SỰ KIỆN SẮP DIỄN RA
          Tham chiếu: 01-trang-chu.md (Mục 4)
          Data: Động — module Sự kiện, lọc sắp diễn ra, sort ngày gần nhất
          State: S-EMPTY -> hiện message "Chưa có sự kiện nào sắp diễn ra, quay lại sau" · S-LOADING
          ========================================================================= */}
      <section className="vcf-section bg-parchment">
        <div className="vcf-container">
          <div className="mb-8">
            {showSpecAnnotations && (
              <div className="flex items-center gap-2 mb-1">
                <SpecBadge label="Block 4: Sự kiện sắp diễn ra" type="prd" />
                <SpecBadge label="Data: Module Sự kiện (lọc sắp diễn ra, sort ngày gần nhất)" type="source" />
              </div>
            )}
            <h2 className="vcf-section-title">
              Sự Kiện Sắp Diễn Ra
            </h2>
            <p className="vcf-lead mt-2">
              Các phiên hội nghị thượng đỉnh, tọa đàm bàn tròn chuyên đề và sinh hoạt hội viên đang mở đăng ký
            </p>
          </div>

          {/* State Handling for Events */}
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : isEmpty ? (
            <div className="vcf-surface p-12 text-center space-y-3">
              <div className="font-semibold text-base text-ink">[S-EMPTY] Chưa có sự kiện nào sắp diễn ra, quay lại sau</div>
              <p className="text-xs text-ink-secondary max-w-md mx-auto">
                Hiện tại Ban tổ chức đang hoàn thiện nội dung cho các chương trình quý tiếp theo. Vui lòng quay lại sau hoặc đăng ký thành viên để nhận thông báo sớm.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_EVENTS.slice(0, 3).map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>

              {/* Button "Xem tất cả lịch sự kiện" ở dưới 3 sự kiện chính */}
              <div className="text-center pt-2">
                <CustomButton
                  variant="secondary"
                  size="lg"
                  onClick={() => navigateTo('events')}
                  className="w-full sm:w-auto px-8 py-3 rounded-full border-neutral-300 hover:border-black text-sm font-semibold shadow-xs"
                >
                  Xem tất cả lịch sự kiện →
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 5: HOẠT ĐỘNG VCF
          Tham chiếu: 01-trang-chu.md (Mục 5)
          Nội dung: H2 "Hoạt động của Diễn đàn CEO Việt Nam" + grid ĐỦ 9 Activity Card
          Data: Tĩnh — cố định 9 mục, mỗi card dẫn tới trang chi tiết hoạt động (02-hoat-dong-vcf.md)
          ========================================================================= */}
      <section id="activities-hub" className="vcf-section bg-white">
        <div className="vcf-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              {showSpecAnnotations && (
                <div className="flex items-center gap-2 mb-1">
                  <SpecBadge label="Block 5: Hoạt động của Diễn đàn CEO Việt Nam" type="prd" />
                  <SpecBadge label="Grid đủ 9 Activity Card • Dữ liệu tĩnh cố định" type="source" />
                </div>
              )}
              <h2 className="vcf-section-title">
                Hoạt Động Của Diễn Đàn CEO Việt Nam
              </h2>
              <p className="vcf-lead mt-2">
                9 trụ cột hoạt động đồng bộ từ hội nghị thượng đỉnh, cố vấn 1-1 tới đào tạo và sinh hoạt định kỳ
              </p>
            </div>

            {/* Desktop CTA: Nằm bên phải tiêu đề trên màn hình sm trở lên */}
            <div className="hidden sm:block shrink-0">
              <CustomButton
                variant="secondary"
                size="sm"
                onClick={() => navigateTo('activities')}
              >
                Xem trang tổng quan 9 hoạt động →
              </CustomButton>
            </div>
          </div>

          {/* Grid đầy đủ 9 Activity Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                onClick={() => navigateTo('activity-detail', { activityId: act.id })}
                className="vcf-card p-5 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-colors">
                      <span className="group-hover:text-white transition-colors">
                        {getActivityIcon(act.id)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-ink-secondary bg-neutral-100 px-2.5 py-0.5 rounded-md">
                      {act.frequency.split('(')[0].trim()}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-ink group-hover:text-brand-primary transition-colors flex items-center gap-2">
                    <span>{act.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </h3>

                  <p className="text-sm text-ink-secondary line-clamp-2 mt-2 leading-relaxed">
                    {act.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                  <span>Chi tiết hoạt động</span>
                  <span className="text-brand-primary font-semibold group-hover:underline">Khám phá →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA: Hiển thị ở vị trí cuối cùng của box, cụ thể dưới CEO Club */}
          <div className="mt-6 sm:hidden">
            <CustomButton
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => navigateTo('activities')}
              className="border-neutral-300 hover:border-black text-sm font-semibold shadow-xs py-3"
            >
              Xem trang tổng quan 9 hoạt động →
            </CustomButton>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BLOCK 6: CHƯƠNG TRÌNH ĐÀO TẠO
          Tham chiếu: 01-trang-chu.md (Mục 6)
          H2 + 2-3 Program Card
          ========================================================================= */}
      <section className="vcf-section bg-parchment">
        <div className="vcf-container">
        <div className="mb-8">
          <div>
            {showSpecAnnotations && (
              <div className="flex items-center gap-2 mb-1">
                <SpecBadge label="Block 6: Chương trình đào tạo" type="prd" />
                <SpecBadge label="2-3 Program Card" type="source" />
              </div>
            )}
            <h2 className="vcf-section-title">
              Chương Trình Đào Tạo CEO
            </h2>
            <p className="vcf-lead mt-2">
              Các khóa bồi dưỡng chuyên sâu do Hội đồng Chuyên gia VLGM và Học viện PTIT đồng thiết kế
            </p>
          </div>
        </div>

        {/* State Handling for Programs */}
        {isLoading ? (
          <SkeletonLoader variant="card" count={2} />
        ) : isEmpty ? (
          <div className="vcf-surface p-12 text-center space-y-3">
            <div className="font-semibold text-base text-ink">[S-EMPTY] Hiện chưa có khóa đào tạo mở tuyển sinh</div>
            <p className="text-xs text-ink-secondary max-w-md mx-auto">
              Ban tổ chức VLGM - PTIT đang chuẩn bị khung chương trình khóa mới. Quý CEO quan tâm có thể để lại thông tin để nhận thông báo sớm.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_PROGRAMS.slice(0, 2).map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>
        )}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 7: CTA CUỐI TRANG
          Tham chiếu: 01-trang-chu.md (Mục 7)
          Nhắc lại "Đăng ký thành viên" trước footer, cùng hành vi CTA như Hero
          ========================================================================= */}
      <section className="vcf-section bg-surface-dark text-white">
        <div className="vcf-container flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-3 max-w-2xl">
            {showSpecAnnotations && (
              <div className="flex items-center gap-2 mb-1">
                <SpecBadge label="Block 7: CTA Cuối Trang" type="prd" />
                <SpecBadge label="Nhắc lại Đăng ký thành viên (PRD ≥ 2 lần) • Đồng bộ trạng thái" type="source" />
              </div>
            )}
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              Gia Nhập Cộng Đồng Diễn Đàn CEO Việt Nam
            </h3>
            <p className="text-base text-white/68 leading-relaxed">
              Trở thành hội viên chính thức để tiếp cận trọn vẹn 9 hoạt động đặc quyền, tham gia mạng lưới cố vấn 1-1 và thụ hưởng kho tri thức quản trị chuyên sâu.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <CustomButton
              variant="primary"
              size="lg"
              onClick={() => navigateTo(isUserLoggedIn ? 'profile' : 'register-member')}
              className="bg-brand-primary text-white hover:bg-brand-primary-hover"
            >
              {isUserLoggedIn ? 'Xem hồ sơ của bạn →' : 'Đăng ký thành viên ngay'}
            </CustomButton>
          </div>
        </div>
      </section>
    </div>
  );
};
