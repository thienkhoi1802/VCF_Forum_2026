import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { ChevronDown, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showSpecAnnotations } = useApp();
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="bg-black text-neutral-300 border-t border-neutral-800 text-xs font-sans">
      {showSpecAnnotations && (
        <div className="bg-neutral-950 text-neutral-400 px-4 py-1.5 border-b border-neutral-800 font-mono text-[10px]">
          [REF: B3 Footer — 4-5 Cột Desktop / Accordion Collapse Mobile | Tuân thủ Nghị định 13/2023/NĐ-CP]
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Desktop Grid Layout (hidden on small screens, shown on md/lg) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1: Logo & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#eb1000] text-white font-black flex items-center justify-center text-base rounded-md shadow-sm">
                VCF
              </div>
              <div>
                <div className="font-black text-sm text-white uppercase tracking-tight adobe-heading">
                  Diễn Đàn CEO Việt Nam
                </div>
                <div className="text-[10px] text-neutral-400 font-semibold">
                  Vietnam CEO Forum (VCF)
                </div>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Nền tảng kết nối, chuyển giao tri thức và phát triển năng lực lãnh đạo cho cộng đồng doanh nhân, người đứng đầu doanh nghiệp Việt Nam. Hợp tác phát triển giữa Viện Lãnh đạo & Quản trị Tinh hoa (VLGM) và Học viện Công nghệ Bưu chính Viễn thông (PTIT).
            </p>

            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#eb1000] shrink-0" />
                <span>Trụ sở PTIT: 122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#eb1000] shrink-0" />
                <span>Hotline: (024) 3756 2186 | 0988 123 456</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#eb1000] shrink-0" />
                <span>Email: vcf@ptit.edu.vn | lienhe@vlgm.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: 9 Hoạt động */}
          <div className="space-y-3">
            <div className="font-black text-white uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-2">
              Hoạt động VCF
            </div>
            <ul className="space-y-2.5 text-xs">
              {MOCK_ACTIVITIES.slice(0, 5).map((act) => (
                <li key={act.id}>
                  <button
                    onClick={() => navigateTo('activity-detail', { activityId: act.id })}
                    className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                  >
                    {act.title}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => navigateTo('activities')}
                  className="text-[#eb1000] font-bold hover:text-red-400 transition-colors text-xs inline-flex items-center gap-1"
                >
                  <span>Xem toàn bộ 9 hoạt động</span>
                  <span>→</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hệ tri thức LGM */}
          <div className="space-y-3">
            <div className="font-black text-white uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-2">
              Hệ Tri Thức LGM
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Bài viết BT Nguyễn Mạnh Hùng
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Bài viết của các tác giả khác
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Tri thức phái sinh (Case Studies)
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => navigateTo('events')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Lịch sự kiện & Summit
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Đào tạo & Điều hướng */}
          <div className="space-y-3">
            <div className="font-black text-white uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-2">
              Đào tạo & Thành viên
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('programs')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Chương trình Đào tạo CEO
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Về VCF / VLGM / PTIT
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('register-member')}
                  className="text-[#eb1000] font-bold hover:text-red-400 transition-colors text-left"
                >
                  Đăng ký thành viên VCF
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('login')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-medium"
                >
                  Đăng nhập tài khoản
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordion Layout (< md) */}
        <div className="md:hidden space-y-4 pb-8 border-b border-neutral-800">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#eb1000] text-white font-black flex items-center justify-center rounded-md text-sm">
                VCF
              </div>
              <span className="font-black text-white text-sm">DIỄN ĐÀN CEO VIỆT NAM</span>
            </div>
            <p className="text-neutral-400 text-xs">
              Hệ sinh thái kết nối và tri thức lãnh đạo doanh nhân Việt Nam. Hợp tác giữa VLGM và PTIT.
            </p>
          </div>

          {/* Accordion 1: Hoạt động */}
          <div className="border-t border-neutral-800 pt-3">
            <button
              onClick={() => toggleAccordion('activities')}
              className="w-full flex items-center justify-between py-2 text-white font-bold text-xs uppercase"
            >
              <span>Hoạt động VCF (9 mục)</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openAccordions['activities'] ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions['activities'] && (
              <ul className="pl-3 py-2 space-y-2 text-xs text-neutral-400 border-l border-neutral-800 my-1">
                {MOCK_ACTIVITIES.map((act) => (
                  <li key={act.id}>
                    <button
                      onClick={() => navigateTo('activity-detail', { activityId: act.id })}
                      className="text-left hover:text-white"
                    >
                      {act.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 2: Hệ tri thức */}
          <div className="border-t border-neutral-800 pt-3">
            <button
              onClick={() => toggleAccordion('knowledge')}
              className="w-full flex items-center justify-between py-2 text-white font-bold text-xs uppercase"
            >
              <span>Hệ Tri Thức LGM</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openAccordions['knowledge'] ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions['knowledge'] && (
              <ul className="pl-3 py-2 space-y-2 text-xs text-neutral-400 border-l border-neutral-800 my-1">
                <li>
                  <button onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })}>
                    Bài viết BT Nguyễn Mạnh Hùng
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })}>
                    Bài viết tác giả khác
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })}>
                    Tri thức phái sinh
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Accordion 3: Đào tạo & Giới thiệu */}
          <div className="border-t border-neutral-800 pt-3">
            <button
              onClick={() => toggleAccordion('more')}
              className="w-full flex items-center justify-between py-2 text-white font-bold text-xs uppercase"
            >
              <span>Đào tạo & Giới thiệu</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openAccordions['more'] ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions['more'] && (
              <ul className="pl-3 py-2 space-y-2 text-xs text-neutral-400 border-l border-neutral-800 my-1">
                <li><button onClick={() => navigateTo('programs')}>Chương trình Đào tạo CEO</button></li>
                <li><button onClick={() => navigateTo('about')}>Về VCF / VLGM / PTIT</button></li>
                <li><button onClick={() => navigateTo('events')}>Sự kiện</button></li>
                <li><button onClick={() => navigateTo('register-member')}>Đăng ký thành viên</button></li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-sans">
          <div>
            © 2026 Diễn đàn CEO Việt Nam (VCF) — Viện Lãnh đạo VLGM & Học viện PTIT.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#eb1000]" />
              Chính sách Bảo vệ Dữ liệu Cá nhân (Nghị định 13/2023/NĐ-CP)
            </span>
            <span className="text-neutral-700">|</span>
            <span>Điều khoản sử dụng</span>
            <span className="text-neutral-700">|</span>
            <span>Đối tác thiết kế: VnExpress (VNE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
