import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageRoute } from '../../types';
import { 
  Smartphone, 
  Monitor, 
  Eye, 
  EyeOff, 
  UserCheck, 
  UserX,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const WireframeHeaderBar: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    showSpecAnnotations,
    setShowSpecAnnotations,
    viewportMode,
    setViewportMode,
    wireframeImageMode,
    setWireframeImageMode,
    showNotification,
    isLoggedIn,
    login,
    logout
  } = useApp();

  const pages: { route: PageRoute; code: string; name: string; isMain: boolean }[] = [
    { route: 'home', code: 'C1', name: 'Trang chủ', isMain: true },
    { route: 'activities', code: 'C2', name: 'Hoạt động VCF (9 mục)', isMain: true },
    { route: 'activity-detail', code: 'C3', name: 'Chi tiết 1 Hoạt động', isMain: false },
    { route: 'register-member', code: 'C4', name: 'Đăng ký thành viên', isMain: false },
    { route: 'events', code: 'C5', name: 'Lịch / Đăng ký sự kiện', isMain: true },
    { route: 'event-detail', code: 'C5.1', name: 'Chi tiết sự kiện (WAN-IFRA)', isMain: false },
    { route: 'knowledge', code: 'C6', name: 'Hệ tri thức LGM (3 thư mục)', isMain: true },
    { route: 'knowledge-category', code: 'C7', name: 'Danh sách bài viết thư mục', isMain: false },
    { route: 'article-detail', code: 'C8', name: 'Chi tiết bài viết', isMain: false },
    { route: 'programs', code: 'C9', name: 'Đào tạo CEO', isMain: true },
    { route: 'program-detail', code: 'C9.1', name: 'Chi tiết chương trình đào tạo', isMain: false },
    { route: 'about', code: 'C10', name: 'Giới thiệu VCF/VLGM', isMain: true },
    { route: 'login', code: 'C11', name: 'Đăng nhập / Đăng ký', isMain: false },
    { route: 'profile', code: 'C12', name: 'Hồ sơ + Lịch sử sự kiện', isMain: false },
    { route: 'search', code: 'C13', name: 'Kết quả tìm kiếm', isMain: false },
  ];

  return (
    <aside aria-label="Khung điều khiển & mô phỏng Wireframe" className="bg-black text-white text-xs border-b border-neutral-800 sticky top-0 z-50 select-none shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Spec Title & Page selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-neutral-300">
            <span className="bg-[#eb1000] text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase shadow-xs">
              VCF SPEC
            </span>
            <span className="hidden sm:inline text-neutral-400 font-sans text-xs">PRD 2026 (PTIT / VLGM / VNE)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <label htmlFor="quick-page-jump-select" className="text-neutral-400 font-mono text-[11px]">Trang:</label>
            <select
              id="quick-page-jump-select"
              value={currentRoute}
              onChange={(e) => navigateTo(e.target.value as PageRoute)}
              className="bg-neutral-900 text-white border border-neutral-700 px-3 py-1 text-xs rounded-full font-sans focus:outline-none focus:border-[#eb1000] transition-colors"
            >
              {pages.map((p) => (
                <option key={p.route} value={p.route}>
                  [{p.code}] {p.name} {p.isMain ? '★' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Spec & Layout Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Wireframe Placeholder Mode Indicator & Toggle */}
          <button
            onClick={() => {
              const newMode = wireframeImageMode === 'wireframe' ? 'photo' : 'wireframe';
              setWireframeImageMode(newMode);
              showNotification(
                newMode === 'wireframe'
                  ? 'Đã kích hoạt: Chế độ Bản High Wireframe (Tất cả hình ảnh dạng Placeholder kỹ thuật)'
                  : 'Đã kích hoạt: Chế độ Xem trước ảnh mẫu thực tế (Demo Photos)'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1 border text-[11px] rounded-full transition-colors font-medium ${
              wireframeImageMode === 'wireframe'
                ? 'bg-neutral-800 text-amber-300 border-amber-400/40 shadow-xs'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="Mục tiêu: Biến tất cả hình ảnh thành dạng Wireframe Placeholder chuẩn High Wireframe"
          >
            {wireframeImageMode === 'wireframe' ? (
              <Layers className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="font-mono text-[11px]">
              {wireframeImageMode === 'wireframe' ? 'High Wireframe [Bật]' : 'Ảnh mẫu [Demo]'}
            </span>
          </button>

          {/* Toggle Annotations */}
          <button
            onClick={() => setShowSpecAnnotations(!showSpecAnnotations)}
            className={`flex items-center gap-1.5 px-3 py-1 border text-[11px] rounded-full transition-colors font-medium ${
              showSpecAnnotations 
                ? 'bg-neutral-900 text-[#ff4b3e] border-[#eb1000]/60' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="Bật/Tắt nhãn chú thích PRD và nguồn dữ liệu Wireframe"
          >
            {showSpecAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline font-sans">Ghi chú Spec</span>
          </button>

          {/* Toggle Device Viewport Simulation */}
          <div className="flex items-center border border-neutral-800 bg-neutral-900 rounded-full p-0.5">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 text-xs rounded-full transition-colors ${
                viewportMode === 'desktop' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="Xem giao diện chuẩn Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 text-xs rounded-full transition-colors ${
                viewportMode === 'mobile' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="Mô phỏng màn hình Mobile (<768px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fast Login / Logout toggle */}
          <button
            onClick={isLoggedIn ? logout : login}
            className={`flex items-center gap-1.5 px-3 py-1 text-[11px] border font-medium rounded-full transition-colors ${
              isLoggedIn 
                ? 'bg-neutral-900 text-white border-neutral-700 hover:border-[#eb1000]' 
                : 'bg-neutral-900 text-neutral-200 border-neutral-800 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {isLoggedIn ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Hội viên: P.M. Đức</span>
                <span className="text-[10px] text-emerald-400/80">(Thoát)</span>
              </>
            ) : (
              <>
                <UserX className="w-3.5 h-3.5 text-slate-400" />
                <span>Khách (Guest)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
