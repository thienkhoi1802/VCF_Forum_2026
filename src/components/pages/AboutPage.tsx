import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { Target, Compass, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo, showSpecAnnotations, isLoggedIn } = useApp();

  return (
    <div className="vcf-container py-6 pb-0 space-y-16 font-sans">
      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-hairline p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpecBadge label="C10: Giới thiệu VCF / VLGM [Trang chính]" type="page" />
            <span className="text-ink-secondary">Tầm nhìn — Sứ mệnh — Định vị | Nội dung tĩnh [S-DEFAULT]</span>
          </div>
          <span className="text-ink-secondary">2 Cột Text + Ảnh xen kẽ</span>
        </div>
      )}

      {/* Page Hero */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight leading-tight">
          Hội Tụ Tinh Hoa Lãnh Đạo.<br />
          <span className="text-brand-primary">Phụng Sự Doanh Nghiệp Quốc Gia.</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans">
          Diễn đàn CEO Việt Nam (VCF) là sáng kiến hợp tác chiến lược giữa Viện Lãnh đạo & Quản trị Tinh hoa (VLGM) và Học viện Công nghệ Bưu chính Viễn thông (PTIT), nhằm kiến tạo không gian đối thoại, kết nối và chuyển giao tri thức quản trị tầm vóc quốc tế cho cộng đồng doanh nhân Việt Nam.
        </p>
      </div>

      {/* SECTION 1: TẦM NHÌN & SỨ MỆNH (2 Cột Xen Kẽ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-hairline pt-12">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-primary">
              <Target className="w-4 h-4 text-brand-primary" />
              <span>Tầm Nhìn 2030</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink">
              Diễn đàn lãnh đạo doanh nghiệp uy tín hàng đầu khu vực
            </h2>
          </div>

          <p className="text-base text-ink-secondary leading-relaxed">
            Trở thành biểu tượng của trí tuệ quản trị và năng lực lãnh đạo Việt Nam, nơi quy tụ và đồng hành cùng hơn 5.000 CEO, Chủ tịch tập đoàn hàng đầu dẫn dắt công cuộc chuyển đổi số, đổi mới sáng tạo và hội nhập kinh tế toàn cầu.
          </p>

          <div className="p-5 bg-red-50/60 border-l-4 border-brand-primary rounded-r-lg text-base text-neutral-800 italic leading-relaxed">
            "Không có quốc gia hùng cường nếu thiếu vắng những tập đoàn kinh tế mạnh. Không có tập đoàn lớn mạnh nếu thiếu những người thuyền trưởng có tầm nhìn và triết lý phụng sự."
          </div>
        </div>

        <div className="lg:col-span-6">
          <WireframeImage
            label="[Ảnh: Hội đồng Cố vấn Cấp cao và Ban Điều hành VCF]"
            imageUrl="/images/about/leadership-forum.jpg"
            alt="Các lãnh đạo doanh nghiệp tại Diễn đàn CEO Việt Nam"
            aspectRatio="4:3"
            className="w-full border border-hairline rounded-lg overflow-hidden shadow-xs"
          />
        </div>
      </div>

      {/* SECTION 2: SỨ MỆNH & ĐỊNH VỊ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-hairline pt-12">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <WireframeImage
            label="[Ảnh: Không gian Học thuật & Nghiên cứu Trường phái LGM]"
            aspectRatio="4:3"
            className="w-full border border-hairline rounded-lg overflow-hidden shadow-xs"
          />
        </div>

        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-primary">
              <Compass className="w-4 h-4 text-brand-primary" />
              <span>Sứ Mệnh Cốt Lõi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink">
              Hệ thống hóa & lan tỏa trường phái quản trị LGM
            </h2>
          </div>

          <ul className="space-y-3 text-base text-neutral-700 font-sans">
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
              <span><strong className="text-ink">Đúc kết tri thức thực chiến:</strong> Nghiên cứu và số hóa các bài học thành bại của doanh nhân Việt Nam qua các thời kỳ.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
              <span><strong className="text-ink">Chuyển giao thế hệ:</strong> Kết nối cố vấn 1-1 giữa các chuyên gia kỳ cựu và thế hệ lãnh đạo F2 kế nghiệp.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
              <span><strong className="text-ink">Đối thoại cấp cao:</strong> Cầu nối tin cậy giữa cộng đồng doanh nghiệp và các cơ quan hoạch định chính sách quốc gia.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SECTION 3: ĐƠN VỊ ĐỒNG SÁNG LẬP & ĐỐI TÁC */}
      <div className="border-t border-hairline pt-12 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-ink">
            Đơn vị chủ trì & đối tác phát triển
          </h2>
          <p className="text-xs text-ink-secondary font-medium">
            Sự kết hợp giữa học thuật hàn lâm công nghệ viễn thông và triết lý quản trị tinh hoa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-hairline p-6 bg-white rounded-lg shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-brand-primary text-white flex items-center justify-center font-semibold font-mono shadow-xs">
              PTIT
            </div>
            <h3 className="font-semibold text-lg text-ink">Học viện Bưu Chính Viễn Thông</h3>
            <p className="text-sm text-ink-secondary leading-relaxed font-sans">
              Trường đại học trọng điểm quốc gia về Công nghệ thông tin và Truyền thông, đơn vị bảo trợ học thuật và nền tảng hạ tầng công nghệ số cho VCF.
            </p>
          </div>

          <div className="border border-hairline p-6 bg-white rounded-lg shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-ink text-white flex items-center justify-center font-semibold font-mono shadow-xs">
              VLGM
            </div>
            <h3 className="font-semibold text-lg text-ink">Viện lãnh đạo & Quản trị LGM</h3>
            <p className="text-sm text-ink-secondary leading-relaxed font-sans">
              Viện nghiên cứu và tư vấn chiến lược chuyên sâu về phương pháp luận quản trị doanh nghiệp và bồi dưỡng lãnh đạo tinh hoa.
            </p>
          </div>

          <div className="border border-hairline p-6 bg-white rounded-lg shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-brand-primary text-white flex items-center justify-center font-semibold font-mono shadow-xs">
              VNE
            </div>
            <h3 className="font-semibold text-lg text-ink">Báo điện tử VnExpress</h3>
            <p className="text-sm text-ink-secondary leading-relaxed font-sans">
              Đối tác chiến lược thiết kế trải nghiệm người dùng, truyền thông và lan tỏa các giá trị học thuật tới cộng đồng độc giả doanh nhân.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="w-full bg-black px-6 py-6 md:px-10 md:py-8 text-center space-y-4">
        <h3 className="text-[28px] font-semibold text-white">
          Đồng hành cùng diễn đàn CEO Việt Nam
        </h3>
        <p className="text-base text-neutral-300 max-w-lg mx-auto leading-relaxed">
          Đăng ký để trở thành hội viên chính thức hoặc tham gia ban cố vấn chuyên môn của Diễn đàn.
        </p>
        <CustomButton
          variant="primary"
          size="md"
          className="shadow-xs"
          onClick={() => navigateTo(isLoggedIn ? 'profile' : 'register-member')}
        >
          {isLoggedIn ? 'Xem Hồ Sơ Hội Viên' : 'Đăng Ký Thành Viên VCF'}
        </CustomButton>
      </div>
    </div>
  );
};
