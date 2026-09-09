import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ActivityCard } from '../common/ActivityCard';
import { CustomButton } from '../common/CustomButton';
import { SpecBadge } from '../wireframe/SpecBadge';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { Layers, HelpCircle } from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { navigateTo, showSpecAnnotations, isLoggedIn } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-12">
      <Breadcrumb items={[{ label: 'Hoạt động VCF' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpecBadge label="C2: Tuyến 1 — Trang tổng quan 9 hoạt động [Trang chính]" type="page" />
            <span className="text-neutral-600">Hub điều hướng đầy đủ 9 hoạt động | Lưới Desktop 3x3</span>
          </div>
          <span className="text-neutral-500">State: [S-DEFAULT] Nội dung tĩnh</span>
        </div>
      )}

      {/* Page Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full">
          <Layers className="w-3.5 h-3.5 text-[#eb1000]" />
          <span>Tuyến Nội Dung 1 — Hệ Thống Hoạt Động</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
          Hoạt Động Của Diễn Đàn CEO Việt Nam
        </h1>

        <p className="text-base text-neutral-600 leading-relaxed font-sans">
          Hệ sinh thái 9 hoạt động đa diện được thiết kế khoa học, kết hợp giữa đối thoại chiến lược cấp quốc gia, cố vấn chuyển giao thế hệ, phản biện đồng cấp và nghiên cứu học thuật trường phái quản trị LGM.
        </p>
      </div>

      {/* 3x3 Grid of 9 Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {MOCK_ACTIVITIES.map((act) => (
          <ActivityCard key={act.id} activity={act} showCover={true} />
        ))}
      </div>

      {/* Advisory & Onboarding CTA Block */}
      <div className="bg-white border border-neutral-200 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <h3 className="font-black text-lg text-black flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#eb1000]" />
            Chưa biết bắt đầu từ hoạt động nào?
          </h3>
          <p className="text-xs text-neutral-600 max-w-xl">
            Đăng ký thành viên VCF để được Ban Thư ký thẩm định hồ sơ, tư vấn lộ trình tham gia các nhóm Peer Group phù hợp hoặc kết nối Mentor cùng ngành.
          </p>
        </div>

        <CustomButton
          variant="primary"
          size="md"
          onClick={() => navigateTo(isLoggedIn ? 'profile' : 'register-member')}
          className="shrink-0"
        >
          {isLoggedIn ? 'Xem Hồ Sơ Thành Viên' : 'Đăng Ký Thành Viên Để Được Tư Vấn'}
        </CustomButton>
      </div>
    </div>
  );
};
