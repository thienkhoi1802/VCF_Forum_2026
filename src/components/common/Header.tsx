import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from './CustomButton';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  Sparkles,
  Home,
  UserPlus,
  LogIn,
  ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    isLoggedIn,
    currentUser,
    logout,
    showSpecAnnotations
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);
  const [mobileKnowledgeOpen, setMobileKnowledgeOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'activities' | 'knowledge' | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickSearchText, setQuickSearchText] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setUserDropdownOpen(false);
  }, [currentRoute]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchText.trim()) {
      setSearchModalOpen(false);
      navigateTo('search', { searchQuery: quickSearchText.trim() });
      setQuickSearchText('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs w-full transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="text-left focus:outline-none group flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#eb1000] text-white rounded-md flex items-center justify-center font-black text-xl tracking-tighter shadow-sm">
                VCF
              </div>
              <div className="border-l border-neutral-200 pl-3">
                <div className="font-black text-sm tracking-tight text-black uppercase adobe-heading">
                  Diễn Đàn CEO Việt Nam
                </div>
                <div className="text-[10px] text-neutral-500 font-sans tracking-wider uppercase font-semibold">
                  VLGM & PTIT | PRD 2026
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold h-full">
            <button
              onClick={() => navigateTo('home')}
              className={`h-full flex items-center px-2.5 transition-colors border-b-2 ${
                currentRoute === 'home'
                  ? 'border-[#eb1000] text-[#eb1000]'
                  : 'border-transparent text-neutral-600 hover:text-black'
              }`}
              title="Trang chủ"
              aria-label="Trang chủ"
            >
              <Home className="w-5 h-5" />
            </button>

            {/* 2. Mega-menu: Hệ tri thức LGM */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMegaMenu('knowledge')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                onClick={() => navigateTo('knowledge')}
                className={`h-full flex items-center gap-1.5 transition-colors border-b-2 ${
                  currentRoute === 'knowledge' || currentRoute === 'knowledge-category' || currentRoute === 'article-detail'
                    ? 'border-[#eb1000] text-[#eb1000] font-bold'
                    : 'border-transparent text-neutral-700 hover:text-black'
                }`}
              >
                <span>Hệ tri thức LGM</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Mega-menu panel for Knowledge */}
              {activeMegaMenu === 'knowledge' && (
                <div className="absolute top-full left-0 w-[440px] bg-white border border-neutral-200 rounded-lg p-4 space-y-2 shadow-2xl z-50 animate-fadeIn">
                  <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                      Kho Tri thức Lãnh đạo & Quản trị
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveMegaMenu(null);
                      navigateTo('knowledge-category', { category: 'hung-bt' });
                    }}
                    className="w-full text-left p-3 hover:bg-neutral-50 border border-neutral-100 rounded-md text-xs block transition-all"
                  >
                    <div className="font-bold text-black flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#eb1000]" />
                      Bài viết của BT Nguyễn Mạnh Hùng
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Triết lý Lãnh đạo, Văn hóa & Tầm nhìn Quốc gia</div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveMegaMenu(null);
                      navigateTo('knowledge-category', { category: 'other-authors' });
                    }}
                    className="w-full text-left p-3 hover:bg-neutral-50 border border-neutral-100 rounded-md text-xs block transition-all"
                  >
                    <div className="font-bold text-black">Bài viết của các tác giả khác</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Chuyên gia kinh tế vĩ mô, chuyên gia quản trị & pháp lý</div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveMegaMenu(null);
                      navigateTo('knowledge-category', { category: 'derived-knowledge' });
                    }}
                    className="w-full text-left p-3 hover:bg-neutral-50 border border-neutral-100 rounded-md text-xs block transition-all"
                  >
                    <div className="font-bold text-black">Tri thức phái sinh</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Nghiên cứu điển hình (Case Studies), tóm lược sách chuyên khảo</div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Sự kiện */}
            <button
              onClick={() => navigateTo('events')}
              className={`h-full flex items-center transition-colors border-b-2 ${
                currentRoute === 'events'
                  ? 'border-[#eb1000] text-[#eb1000] font-bold'
                  : 'border-transparent text-neutral-700 hover:text-black'
              }`}
            >
              Sự kiện
            </button>

            {/* 4. Mega-menu: Hoạt động VCF */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMegaMenu('activities')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                onClick={() => navigateTo('activities')}
                className={`h-full flex items-center gap-1.5 transition-colors border-b-2 ${
                  currentRoute === 'activities' || currentRoute === 'activity-detail'
                    ? 'border-[#eb1000] text-[#eb1000] font-bold'
                    : 'border-transparent text-neutral-700 hover:text-black'
                }`}
              >
                <span>Hoạt động VCF</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Mega-menu panel */}
              {activeMegaMenu === 'activities' && (
                <div className="absolute top-full left-0 w-[580px] bg-white border border-neutral-200 rounded-lg p-5 grid grid-cols-2 gap-3 shadow-2xl z-50 animate-fadeIn">
                  <div className="col-span-2 pb-2 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                      9 Hoạt động Trọng tâm VCF
                    </span>
                    <button
                      onClick={() => {
                        setActiveMegaMenu(null);
                        navigateTo('activities');
                      }}
                      className="text-xs text-[#eb1000] hover:text-[#c90d00] font-bold"
                    >
                      Xem trang tổng quan →
                    </button>
                  </div>
                  {MOCK_ACTIVITIES.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        setActiveMegaMenu(null);
                        navigateTo('activity-detail', { activityId: act.id });
                      }}
                      className="text-left p-2.5 rounded-md hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all text-xs"
                    >
                      <div className="font-bold text-black">{act.title}</div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{act.shortDesc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Đào tạo CEO */}
            <button
              onClick={() => navigateTo('programs')}
              className={`h-full flex items-center transition-colors border-b-2 ${
                currentRoute === 'programs' || currentRoute === 'program-detail'
                  ? 'border-[#eb1000] text-[#eb1000] font-bold'
                  : 'border-transparent text-neutral-700 hover:text-black'
              }`}
            >
              Đào tạo CEO
            </button>

            {/* Giới thiệu */}
            <button
              onClick={() => navigateTo('about')}
              className={`h-full flex items-center transition-colors border-b-2 ${
                currentRoute === 'about'
                  ? 'border-[#eb1000] text-[#eb1000] font-bold'
                  : 'border-transparent text-neutral-700 hover:text-black'
              }`}
            >
              Giới thiệu
            </button>
          </nav>

          {/* Desktop Right Utility Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 text-neutral-700 hover:text-black rounded-full border border-neutral-200 hover:bg-neutral-50 transition-all shadow-xs"
              title="Tìm kiếm toàn site (Hoạt động, Bài viết, Đào tạo)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Unified Account Button (Tài khoản) */}
            <div className="relative">
              {isLoggedIn ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 border border-neutral-300 hover:border-black rounded-full text-xs bg-white hover:bg-neutral-50 shadow-xs transition-all cursor-pointer font-bold text-black"
                >
                  <div className="w-6 h-6 rounded-full bg-[#eb1000] text-white flex items-center justify-center font-bold text-[11px]">
                    {currentUser?.fullName.charAt(0) || 'U'}
                  </div>
                  <span className="font-bold text-black">{currentUser?.fullName || 'Hội viên'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('login')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs bg-black text-white hover:bg-[#eb1000] cursor-pointer"
                  title="Đăng nhập tài khoản Hội viên"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Tài khoản</span>
                </button>
              )}

              {userDropdownOpen && isLoggedIn && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-neutral-200 rounded-xl p-3 shadow-2xl z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-2 border-b border-neutral-100 mb-2">
                    <div className="font-bold text-sm text-black truncate">{currentUser?.fullName}</div>
                    <div className="text-[11px] text-neutral-500 truncate">{currentUser?.companyName}</div>
                    <div className="text-[10px] font-mono text-[#eb1000] mt-1.5 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 inline-flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Hội viên VCF: {currentUser?.memberId}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigateTo('profile');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-50 flex items-center justify-between text-black font-semibold transition-colors cursor-pointer"
                  >
                    <span>Hồ sơ & Sự kiện đã đăng ký</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 mt-1 border-t border-neutral-100 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Controls: Search + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-50"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black rounded-full border border-neutral-200 hover:bg-neutral-50"
              aria-label="Menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-50 overflow-y-auto p-6 flex flex-col justify-between border-t border-slate-200 animate-fadeIn lg:hidden">
          <div className="space-y-4">
            {/* Search Input Bar on Top */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động, bài viết, sự kiện..."
                value={quickSearchText}
                onChange={(e) => setQuickSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-neutral-300 rounded-full focus:outline-none focus:border-[#eb1000] focus:ring-2 focus:ring-[#eb1000]/20 font-sans shadow-xs"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            </form>

            {/* Navigation List */}
            <nav className="divide-y divide-neutral-100 text-sm font-semibold pt-2">
              {/* 1. Trang chủ */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('home');
                }}
                className="w-full py-3 text-left flex items-center justify-between text-black hover:text-[#eb1000] font-bold"
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#eb1000]" />
                  <span>Trang chủ</span>
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* 2. Accordion: Hệ tri thức LGM */}
              <div className="py-2">
                <button
                  onClick={() => setMobileKnowledgeOpen(!mobileKnowledgeOpen)}
                  className="w-full py-2 text-left flex items-center justify-between text-black font-bold"
                >
                  <span>Hệ tri thức LGM (3 thư mục)</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${mobileKnowledgeOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileKnowledgeOpen && (
                  <div className="pl-4 py-2 space-y-2 border-l-2 border-[#eb1000] my-1">
                    <button
                      onClick={() => navigateTo('knowledge')}
                      className="block text-xs text-[#eb1000] font-bold underline mb-2"
                    >
                      → Xem trang chủ Hệ tri thức LGM
                    </button>
                    <button
                      onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })}
                      className="block w-full text-left py-1 text-xs text-neutral-700 hover:text-black font-medium"
                    >
                      • Bài viết của BT Nguyễn Mạnh Hùng
                    </button>
                    <button
                      onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })}
                      className="block w-full text-left py-1 text-xs text-neutral-700 hover:text-black font-medium"
                    >
                      • Bài viết của các tác giả khác
                    </button>
                    <button
                      onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })}
                      className="block w-full text-left py-1 text-xs text-neutral-700 hover:text-black font-medium"
                    >
                      • Tri thức phái sinh (Case Study, Sách)
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Sự kiện */}
              <button
                onClick={() => navigateTo('events')}
                className="w-full py-3 text-left flex items-center justify-between text-black hover:text-[#eb1000] font-bold"
              >
                <span>Sự kiện</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* 4. Accordion: Hoạt động VCF */}
              <div className="py-2">
                <button
                  onClick={() => setMobileActivitiesOpen(!mobileActivitiesOpen)}
                  className="w-full py-2 text-left flex items-center justify-between text-black font-bold"
                >
                  <span>Hoạt động VCF (9 mục)</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${mobileActivitiesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileActivitiesOpen && (
                  <div className="pl-4 py-2 space-y-2 border-l-2 border-[#eb1000] my-1">
                    <button
                      onClick={() => navigateTo('activities')}
                      className="block text-xs text-[#eb1000] font-bold underline mb-2"
                    >
                      → Xem trang tổng quan 9 hoạt động
                    </button>
                    {MOCK_ACTIVITIES.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => navigateTo('activity-detail', { activityId: act.id })}
                        className="block w-full text-left py-1 text-xs text-neutral-700 hover:text-black font-medium"
                      >
                        • {act.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Đào tạo CEO */}
              <button
                onClick={() => navigateTo('programs')}
                className="w-full py-3 text-left flex items-center justify-between text-black hover:text-[#eb1000] font-bold"
              >
                <span>Đào tạo CEO</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* 6. Giới thiệu */}
              <button
                onClick={() => navigateTo('about')}
                className="w-full py-3 text-left flex items-center justify-between text-black hover:text-[#eb1000] font-bold"
              >
                <span>Giới thiệu</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
            </nav>
          </div>

          {/* Bottom Area: Unified Tài khoản */}
          <div className="pt-6 border-t border-neutral-200 space-y-3 pb-8">
            {isLoggedIn ? (
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#eb1000] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser?.fullName.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">{currentUser?.fullName}</div>
                    <div className="text-[10px] text-neutral-500">{currentUser?.companyName}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <CustomButton
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('profile');
                    }}
                  >
                    Xem Hồ sơ
                  </CustomButton>
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                  >
                    Đăng xuất
                  </CustomButton>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-black flex items-center gap-2">
                    <User className="w-4 h-4 text-[#eb1000]" />
                    Tài khoản Hội viên
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">VCF Portal</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('login');
                  }}
                  className="w-full py-3 text-center text-xs font-bold bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập tài khoản</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Quick Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white border border-neutral-200 w-full max-w-2xl p-6 shadow-2xl rounded-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                Tìm kiếm toàn hệ thống VCF [PRD 7.4]
              </span>
              <button onClick={() => setSearchModalOpen(false)} className="text-neutral-400 hover:text-black p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Nhập từ khóa (VD: CEO Summit, Quản trị rủi ro, BT Nguyễn Mạnh Hùng, Mentoring...)"
                  value={quickSearchText}
                  onChange={(e) => setQuickSearchText(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-base border border-neutral-300 rounded-full focus:outline-none focus:border-[#eb1000] focus:ring-2 focus:ring-[#eb1000]/20 font-sans shadow-xs"
                />
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-4" />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="truncate max-w-[70%]">Gợi ý: "CEO Summit 2026", "Tái cấu trúc", "Lãnh đạo phụng sự"</span>
                <CustomButton type="submit" variant="primary" size="sm">
                  Tìm kiếm
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
