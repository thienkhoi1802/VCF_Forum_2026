import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../common/CustomButton';
import { EventCard } from '../common/EventCard';
import { ArticleCard } from '../common/ArticleCard';
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
      case 'ceo-summit': return <Building2 className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-forum': return <Users className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-mentoring': return <Target className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-peer-group': return <Users className="w-5 h-5 text-[#eb1000]" />;
      case 'lgm-school': return <GraduationCap className="w-5 h-5 text-[#eb1000]" />;
      case 'knowledge-publication': return <BookOpen className="w-5 h-5 text-[#eb1000]" />;
      case 'website-app': return <Globe className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-talk': return <Video className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-club': return <Award className="w-5 h-5 text-[#eb1000]" />;
      default: return <Sparkles className="w-5 h-5 text-[#eb1000]" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 font-sans">
      {/* =========================================================================
          BLOCK 2: HERO BANNER (DẠNG SLIDE WAN-IFRA THEO YÊU CẦU NGƯỜI DÙNG)
          Tham chiếu: https://wan-ifra.org/
          Dạng slide + hiện thông tin + CTA (Tối đa 5 slide)
          ========================================================================= */}
      <section className="w-full -mt-0">
        {showSpecAnnotations && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-2">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              {showSpecAnnotations && (
                <div className="flex items-center gap-2 mb-1">
                  <SpecBadge label="Block 3: Bài viết tri thức nổi bật" type="prd" />
                  <SpecBadge label="Chỉ hiện Thumb + Title + Subfolder" type="source" />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Bài Viết Tri Thức Nổi Bật
              </h2>
              <p className="text-sm text-neutral-500 font-normal mt-1">
                Tri thức lãnh đạo, quản trị thực chiến và góc nhìn vĩ mô từ Hội đồng Cố vấn & chuyên gia
              </p>
            </div>

            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('knowledge')}
            >
              Khám phá Hệ tri thức LGM →
            </CustomButton>
          </div>

          {/* State Handling for Knowledge Articles (3 tin dàn hàng ngang) */}
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_ARTICLES.slice(0, 3).map((art) => (
                <ArticleCard key={art.id} article={art} variant="minimal" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          BLOCK 4: SỰ KIỆN SẮP DIỄN RA
          Tham chiếu: 01-trang-chu.md (Mục 4)
          Data: Động — module Sự kiện, lọc sắp diễn ra, sort ngày gần nhất
          State: S-EMPTY -> hiện message "Chưa có sự kiện nào sắp diễn ra, quay lại sau" · S-LOADING
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-neutral-200 pt-10">
          <div className="mb-8">
            {showSpecAnnotations && (
              <div className="flex items-center gap-2 mb-1">
                <SpecBadge label="Block 4: Sự kiện sắp diễn ra" type="prd" />
                <SpecBadge label="Data: Module Sự kiện (lọc sắp diễn ra, sort ngày gần nhất)" type="source" />
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Sự Kiện Sắp Diễn Ra
            </h2>
            <p className="text-sm text-neutral-500 font-normal mt-1">
              Các phiên hội nghị thượng đỉnh, tọa đàm bàn tròn chuyên đề và sinh hoạt hội viên đang mở đăng ký
            </p>
          </div>

          {/* State Handling for Events */}
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : isEmpty ? (
            <div className="border border-neutral-200 bg-white rounded-lg p-12 text-center space-y-3 shadow-xs">
              <div className="font-black text-base text-black">[S-EMPTY] Chưa có sự kiện nào sắp diễn ra, quay lại sau</div>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
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
                  className="w-full sm:w-auto px-8 py-3 rounded-full border-neutral-300 hover:border-black text-sm font-bold shadow-xs"
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
      <section id="activities-hub" className="bg-neutral-50 py-14 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              {showSpecAnnotations && (
                <div className="flex items-center gap-2 mb-1">
                  <SpecBadge label="Block 5: Hoạt động của Diễn đàn CEO Việt Nam" type="prd" />
                  <SpecBadge label="Grid đủ 9 Activity Card • Dữ liệu tĩnh cố định" type="source" />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
                Hoạt Động Của Diễn Đàn CEO Việt Nam
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 font-normal mt-1.5">
                9 trụ cột hoạt động đồng bộ từ hội nghị thượng đỉnh, cố vấn 1-1 tới đào tạo và sinh hoạt định kỳ
              </p>
            </div>

            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('activities')}
            >
              Xem trang tổng quan 9 hoạt động →
            </CustomButton>
          </div>

          {/* Grid đầy đủ 9 Activity Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                onClick={() => navigateTo('activity-detail', { activityId: act.id })}
                className="bg-white border border-neutral-200 hover:border-[#eb1000] p-5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-[#eb1000] transition-colors">
                      <span className="group-hover:text-white transition-colors">
                        {getActivityIcon(act.id)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-md">
                      {act.frequency.split('(')[0].trim()}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-black group-hover:text-[#eb1000] transition-colors flex items-center gap-2">
                    <span>{act.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#eb1000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                    {act.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                  <span>Chi tiết hoạt động</span>
                  <span className="text-[#eb1000] font-semibold group-hover:underline">Khám phá →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BLOCK 6: CHƯƠNG TRÌNH ĐÀO TẠO
          Tham chiếu: 01-trang-chu.md (Mục 6)
          H2 + 2-3 Program Card + CTA "Xem chương trình đào tạo"
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {showSpecAnnotations && (
              <div className="flex items-center gap-2 mb-1">
                <SpecBadge label="Block 6: Chương trình đào tạo" type="prd" />
                <SpecBadge label="2-3 Program Card • CTA dẫn tới /dao-tao" type="source" />
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Chương Trình Đào Tạo CEO
            </h2>
            <p className="text-sm text-neutral-500 font-normal mt-1">
              Các khóa bồi dưỡng chuyên sâu do Hội đồng Chuyên gia VLGM và Học viện PTIT đồng thiết kế
            </p>
          </div>

          <CustomButton
            variant="secondary"
            size="sm"
            onClick={() => navigateTo('programs')}
          >
            Xem chương trình đào tạo →
          </CustomButton>
        </div>

        {/* State Handling for Programs */}
        {isLoading ? (
          <SkeletonLoader variant="card" count={2} />
        ) : isEmpty ? (
          <div className="border border-neutral-200 bg-white rounded-lg p-12 text-center space-y-3 shadow-xs">
            <div className="font-black text-base text-black">[S-EMPTY] Hiện chưa có khóa đào tạo mở tuyển sinh</div>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
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
      </section>

      {/* =========================================================================
          BLOCK 7: CTA CUỐI TRANG
          Tham chiếu: 01-trang-chu.md (Mục 7)
          Nhắc lại "Đăng ký thành viên" trước footer, cùng hành vi CTA như Hero
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white p-8 md:p-12 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8 rounded-lg shadow-sm">
          <div className="space-y-3 max-w-2xl">
            {showSpecAnnotations && (
              <div className="flex items-center gap-2 mb-1">
                <SpecBadge label="Block 7: CTA Cuối Trang" type="prd" />
                <SpecBadge label="Nhắc lại Đăng ký thành viên (PRD ≥ 2 lần) • Đồng bộ trạng thái" type="source" />
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gia Nhập Cộng Đồng Diễn Đàn CEO Việt Nam
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Trở thành hội viên chính thức để tiếp cận trọn vẹn 9 hoạt động đặc quyền, tham gia mạng lưới cố vấn 1-1 và thụ hưởng kho tri thức quản trị chuyên sâu.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <CustomButton
              variant="primary"
              size="lg"
              onClick={() => navigateTo(isUserLoggedIn ? 'profile' : 'register-member')}
              className="bg-[#eb1000] text-white hover:bg-[#c90d00]"
            >
              {isUserLoggedIn ? 'Xem hồ sơ của bạn →' : 'Đăng ký thành viên ngay'}
            </CustomButton>
          </div>
        </div>
      </section>
    </div>
  );
};
