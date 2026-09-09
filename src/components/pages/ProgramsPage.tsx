import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ProgramCard } from '../common/ProgramCard';
import { SpecBadge } from '../wireframe/SpecBadge';
import { MOCK_PROGRAMS } from '../../data/mockData';
import { GraduationCap, Award, CheckCircle2, Users } from 'lucide-react';

export const ProgramsPage: React.FC = () => {
  const { showSpecAnnotations } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12 font-sans">
      <Breadcrumb items={[{ label: 'Đào tạo CEO' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C9: Chương trình đào tạo — Trang danh sách [Trang chính]" type="page" />
            <SpecBadge label="PRD VI / Module Đào tạo Lãnh đạo" type="source" />
          </div>
          <span className="text-neutral-500">State: [S-DEFAULT]</span>
        </div>
      )}

      {/* Page Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full">
          <GraduationCap className="w-4 h-4" />
          <span>Học Viện Lãnh Đạo & Quản Trị Tinh Hoa (VLGM / PTIT)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
          Chương Trình Đào Tạo Giám Đốc Điều Hành (CEO)
        </h1>

        <p className="text-base text-neutral-600 leading-relaxed font-sans">
          Chương trình bồi dưỡng năng lực lãnh đạo cấp cao được xây dựng theo chuẩn quốc tế, kết hợp triết lý LGM và kinh nghiệm thực chiến từ các nhà lãnh đạo hàng đầu Việt Nam.
        </p>
      </div>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border border-neutral-200 bg-white rounded-lg p-6 md:p-8 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-[#eb1000]" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-black text-sm">Hội Đồng Giảng Viên Đẳng Cấp</div>
            <div className="text-xs text-neutral-500 leading-relaxed">Các nguyên Viện trưởng, Chuyên gia Kinh tế & CEO tập đoàn trực tiếp giảng dạy.</div>
          </div>
        </div>
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#eb1000]" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-black text-sm">Phương Pháp Case-Method</div>
            <div className="text-xs text-neutral-500 leading-relaxed">Học qua giải quyết bài toán thực tế của chính doanh nghiệp học viên.</div>
          </div>
        </div>
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#eb1000]" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-black text-sm">Mạng Lưới Alumni VCF</div>
            <div className="text-xs text-neutral-500 leading-relaxed">Gia nhập cộng đồng cựu học viên CEO với hơn 1.000 doanh nhân toàn quốc.</div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h2 className="text-2xl font-black text-black">
            Các Chương Trình Đang Tuyển Sinh
          </h2>
          <span className="text-xs text-neutral-500 font-medium">
            {MOCK_PROGRAMS.length} chương trình đào tạo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_PROGRAMS.map((prog) => (
            <ProgramCard key={prog.id} program={prog} />
          ))}
        </div>
      </div>
    </div>
  );
};
