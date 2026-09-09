import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { Target, Compass, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo, showSpecAnnotations, isLoggedIn } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-16 font-sans">
      <Breadcrumb items={[{ label: 'Giới thiệu VCF / VLGM' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpecBadge label="C10: Giới thiệu VCF / VLGM [Trang chính]" type="page" />
            <span className="text-neutral-600">Tầm nhìn — Sứ mệnh — Định vị | Nội dung tĩnh [S-DEFAULT]</span>
          </div>
          <span className="text-neutral-500">2 Cột Text + Ảnh xen kẽ</span>
        </div>
      )}

      {/* Page Hero */}
      <div className="space-y-4 max-w-4xl">
        <span className="text-xs font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full">
          Về Diễn Đàn CEO Việt Nam
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
          Hội Tụ Tinh Hoa Lãnh Đạo.<br />
          <span className="text-[#eb1000]">Phụng Sự Doanh Nghiệp Quốc Gia.</span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-sans">
          Diễn đàn CEO Việt Nam (VCF) là sáng kiến hợp tác chiến lược giữa Viện Lãnh đạo & Quản trị Tinh hoa (VLGM) và Học viện Công nghệ Bưu chính Viễn thông (PTIT), nhằm kiến tạo không gian đối thoại, kết nối và chuyển giao tri thức quản trị tầm vóc quốc tế cho cộng đồng doanh nhân Việt Nam.
        </p>
      </div>

      {/* SECTION 1: TẦM NHÌN & SỨ MỆNH (2 Cột Xen Kẽ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-neutral-200 pt-12">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#eb1000]">
              <Target className="w-4 h-4 text-[#eb1000]" />
              <span>Tầm Nhìn 2030</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              Diễn Đàn Lãnh Đạo Doanh Nghiệp Uy Tín Hàng Đầu Khu Vực
            </h2>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Trở thành biểu tượng của trí tuệ quản trị và năng lực lãnh đạo Việt Nam, nơi quy tụ và đồng hành cùng hơn 5.000 CEO, Chủ tịch tập đoàn hàng đầu dẫn dắt công cuộc chuyển đổi số, đổi mới sáng tạo và hội nhập kinh tế toàn cầu.
          </p>

          <div className="p-5 bg-red-50/60 border-l-4 border-[#eb1000] rounded-r-lg text-xs text-neutral-800 italic leading-relaxed">
            "Không có quốc gia hùng cường nếu thiếu vắng những tập đoàn kinh tế mạnh. Không có tập đoàn lớn mạnh nếu thiếu những người thuyền trưởng có tầm nhìn và triết lý phụng sự."
          </div>
        </div>

        <div className="lg:col-span-6">
          <WireframeImage
            label="[Ảnh: Hội đồng Cố vấn Cấp cao và Ban Điều hành VCF]"
            aspectRatio="4:3"
            className="w-full border border-neutral-200 rounded-lg overflow-hidden shadow-xs"
          />
        </div>
      </div>

      {/* SECTION 2: SỨ MỆNH & ĐỊNH VỊ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-neutral-200 pt-12">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <WireframeImage
            label="[Ảnh: Không gian Học thuật & Nghiên cứu Trường phái LGM]"
            aspectRatio="4:3"
            className="w-full border border-neutral-200 rounded-lg overflow-hidden shadow-xs"
          />
        </div>

        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#eb1000]">
              <Compass className="w-4 h-4 text-[#eb1000]" />
              <span>Sứ Mệnh Cốt Lõi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              Hệ Thống Hóa & Lan Tỏa Trường Phái Quản Trị LGM
            </h2>
          </div>

          <ul className="space-y-3 text-xs text-neutral-700 font-sans">
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#eb1000] mt-0.5 shrink-0" />
              <span><strong className="text-black">Đúc kết tri thức thực chiến:</strong> Nghiên cứu và số hóa các bài học thành bại của doanh nhân Việt Nam qua các thời kỳ.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#eb1000] mt-0.5 shrink-0" />
              <span><strong className="text-black">Chuyển giao thế hệ:</strong> Kết nối cố vấn 1-1 giữa các chuyên gia kỳ cựu và thế hệ lãnh đạo F2 kế nghiệp.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#eb1000] mt-0.5 shrink-0" />
              <span><strong className="text-black">Đối thoại cấp cao:</strong> Cầu nối tin cậy giữa cộng đồng doanh nghiệp và các cơ quan hoạch định chính sách quốc gia.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SECTION 3: ĐƠN VỊ ĐỒNG SÁNG LẬP & ĐỐI TÁC */}
      <div className="border-t border-neutral-200 pt-12 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-black">
            Đơn Vị Chủ Trì & Đối Tác Phát Triển
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Sự kết hợp giữa học thuật hàn lâm công nghệ viễn thông và triết lý quản trị tinh hoa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6 bg-white rounded-lg shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#eb1000] text-white flex items-center justify-center font-bold font-mono shadow-xs">
              PTIT
            </div>
            <h3 className="font-bold text-base text-black">Học Viện CN Bưu Chính Viễn Thông</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Trường đại học trọng điểm quốc gia về Công nghệ thông tin và Truyền thông, đơn vị bảo trợ học thuật và nền tảng hạ tầng công nghệ số cho VCF.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 bg-white rounded-lg shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center font-bold font-mono shadow-xs">
              VLGM
            </div>
            <h3 className="font-bold text-base text-black">Viện Lãnh Đạo & Quản Trị LGM</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Viện nghiên cứu và tư vấn chiến lược chuyên sâu về phương pháp luận quản trị doanh nghiệp và bồi dưỡng lãnh đạo tinh hoa.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 bg-white rounded-lg shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#eb1000] text-white flex items-center justify-center font-bold font-mono shadow-xs">
              VNE
            </div>
            <h3 className="font-bold text-base text-black">Báo Điện Tử VnExpress</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Đối tác chiến lược thiết kế trải nghiệm người dùng, truyền thông và lan tỏa các giá trị học thuật tới cộng đồng độc giả doanh nhân.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-neutral-50 border border-neutral-200 p-8 md:p-10 rounded-lg text-center space-y-4 max-w-3xl mx-auto shadow-xs">
        <h3 className="text-2xl font-black text-black">
          Đồng Hành Cùng Diễn Đàn CEO Việt Nam
        </h3>
        <p className="text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed">
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
