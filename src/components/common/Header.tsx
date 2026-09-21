import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { KnowledgeCategoryType } from '../../types';
import { CustomButton } from './CustomButton';

type MegaMenu = 'activities' | 'knowledge' | null;

export const Header: React.FC = () => {
  const { currentRoute, navigateTo, isLoggedIn, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);
  const [mobileKnowledgeOpen, setMobileKnowledgeOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenu>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickSearchText, setQuickSearchText] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setUserDropdownOpen(false);
  }, [currentRoute]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSearchModalOpen(false);
      setMobileMenuOpen(false);
      setActiveMegaMenu(null);
      setUserDropdownOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = quickSearchText.trim();
    if (!query) return;
    setSearchModalOpen(false);
    setQuickSearchText('');
    navigateTo('search', { searchQuery: query });
  };

  const isKnowledgeRoute = ['knowledge', 'knowledge-category', 'article-detail'].includes(currentRoute);
  const isActivityRoute = ['activities', 'activity-detail'].includes(currentRoute);
  const navClass = (active: boolean) =>
    `relative flex min-h-16 items-center px-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:transition-colors ${
      active
        ? 'text-ink after:bg-brand-primary'
        : 'text-ink-secondary after:bg-transparent hover:text-ink hover:after:bg-hairline'
    }`;

  return (
    <header className={currentRoute === 'event-detail' ? 'relative z-40 w-full' : 'sticky top-0 z-40 w-full'}>
      <div className="h-9 bg-ink text-white">
        <div className="vcf-container flex h-full items-center justify-between text-[11px] tracking-[0.04em] text-white/72">
          <button type="button" onClick={() => navigateTo('home')} className="font-medium text-white hover:text-white/80">
            VIETNAM CEO FORUM
          </button>
          <div className="flex items-center gap-4">
            <span>VLGM · PTIT</span>
            <button type="button" onClick={() => navigateTo('about')} className="hidden hover:text-white sm:inline">Về VCF</button>
          </div>
        </div>
      </div>

      <div className="border-b border-black/8 bg-white/88 backdrop-blur-xl">
        <div className="vcf-container flex h-16 items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            aria-label="Về trang chủ VCF"
            className="group flex shrink-0 items-center gap-3 text-left"
          >
            <span className="flex size-10 items-center justify-center rounded-sm bg-brand-primary text-base font-semibold tracking-[-0.04em] text-white transition-transform group-active:scale-95">VCF</span>
            <span className="hidden border-l border-hairline pl-3 sm:block">
              <span className="block text-[13px] font-semibold leading-tight tracking-[-0.02em] text-ink">Diễn đàn CEO Việt Nam</span>
              <span className="mt-0.5 block text-[10px] text-ink-secondary">Kết nối · Tri thức · Kiến tạo</span>
            </span>
          </button>

          <nav aria-label="Điều hướng chính" className="hidden h-full items-center gap-5 lg:flex">
            <button type="button" onClick={() => navigateTo('home')} className={navClass(currentRoute === 'home')}>Trang chủ</button>

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => setActiveMegaMenu('knowledge')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMegaMenu(null);
                  navigateTo('knowledge', { category: 'all' });
                }}
                className={navClass(isKnowledgeRoute)}
                aria-label="Mở trang listing Hệ tri thức LGM"
              >
                Tri thức
              </button>
              <button
                type="button"
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'knowledge' ? null : 'knowledge')}
                className="-ml-1 flex size-11 items-center justify-center rounded-md text-ink-secondary transition-colors hover:bg-parchment hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
                aria-label="Mở menu con Tri thức"
                aria-expanded={activeMegaMenu === 'knowledge'}
                aria-controls="knowledge-menu"
              >
                <ChevronDown className={`size-3.5 transition-transform ${activeMegaMenu === 'knowledge' ? 'rotate-180' : ''}`} />
              </button>
              {activeMegaMenu === 'knowledge' ? (
                <div id="knowledge-menu" className="absolute left-0 top-full w-[420px] rounded-lg border border-hairline bg-white p-3 animate-fadeIn">
                  <p className="px-3 pb-2 pt-1 text-xs font-medium text-ink-secondary">Kho tri thức lãnh đạo và quản trị</p>
                  {[
                    ['hung-bt', 'Bài viết của BT Nguyễn Mạnh Hùng', 'Triết lý lãnh đạo, văn hóa và tầm nhìn'],
                    ['other-authors', 'Góc nhìn chuyên gia', 'Kinh tế, quản trị, pháp lý và thị trường'],
                    ['derived-knowledge', 'Tri thức phái sinh', 'Case study, sách và nghiên cứu ứng dụng'],
                  ].map(([category, title, description]) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => navigateTo('knowledge-category', { category: category as KnowledgeCategoryType })}
                      className="block w-full rounded-md px-3 py-3 text-left hover:bg-parchment"
                    >
                      <span className="block text-sm font-medium text-ink">{title}</span>
                      <span className="mt-0.5 block text-xs text-ink-secondary">{description}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button type="button" onClick={() => navigateTo('events')} className={navClass(currentRoute === 'events' || currentRoute === 'event-detail')}>Sự kiện</button>

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => setActiveMegaMenu('activities')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMegaMenu(null);
                  navigateTo('activities');
                }}
                className={`${navClass(isActivityRoute)} gap-1`}
                aria-expanded={activeMegaMenu === 'activities'}
                aria-controls="activities-menu"
                aria-label="Mở trang tổng quan 9 hoạt động VCF"
              >
                Hoạt động <ChevronDown className={`size-3.5 transition-transform duration-150 ${activeMegaMenu === 'activities' ? 'rotate-180' : ''}`} />
              </button>
              {activeMegaMenu === 'activities' ? (
                <div id="activities-menu" className="absolute left-1/2 top-full grid w-[620px] -translate-x-1/2 grid-cols-2 gap-1 rounded-lg border border-hairline bg-white p-3 shadow-xl z-50 animate-fadeIn">
                  <div className="col-span-2 flex items-center justify-between border-b border-hairline px-3 pb-2.5 pt-1 mb-1">
                    <p className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">9 hoạt động trọng tâm của VCF</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        setActiveMegaMenu(null);
                        navigateTo('activities');
                      }} 
                      className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
                    >
                      Xem trang tổng quan →
                    </button>
                  </div>
                  {MOCK_ACTIVITIES.map((activity) => (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => {
                        setActiveMegaMenu(null);
                        navigateTo('activity-detail', { activityId: activity.id });
                      }}
                      className="rounded-md px-3 py-2.5 text-left hover:bg-parchment transition-colors"
                    >
                      <span className="block text-sm font-medium text-ink">{activity.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-ink-secondary">{activity.shortDesc}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button type="button" onClick={() => navigateTo('programs')} className={navClass(currentRoute === 'programs' || currentRoute === 'program-detail')}>Đào tạo CEO</button>
            <button type="button" onClick={() => navigateTo('about')} className={navClass(currentRoute === 'about')}>Giới thiệu</button>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSearchModalOpen(true)} aria-label="Mở tìm kiếm" className="flex size-11 items-center justify-center rounded-full text-ink-secondary hover:bg-parchment hover:text-ink">
              <Search className="size-5" />
            </button>

            <div className="relative hidden lg:block">
              {isLoggedIn ? (
                <button type="button" onClick={() => setUserDropdownOpen((value) => !value)} aria-expanded={userDropdownOpen} className="flex min-h-11 items-center gap-2 rounded-full border border-hairline px-3 text-sm font-medium text-ink hover:bg-parchment">
                  <span className="flex size-7 items-center justify-center rounded-full bg-brand-primary text-xs text-white">{currentUser?.fullName.charAt(0) || 'U'}</span>
                  <span className="max-w-32 truncate">{currentUser?.fullName || 'Hội viên'}</span>
                  <ChevronDown className="size-3.5 text-ink-secondary" />
                </button>
              ) : (
                <CustomButton size="sm" onClick={() => navigateTo('login')}>
                  <User className="size-4" /> Tài khoản
                </CustomButton>
              )}
              {userDropdownOpen && isLoggedIn ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] w-72 rounded-lg border border-hairline bg-white p-3 animate-fadeIn">
                  <div className="border-b border-hairline px-3 pb-3">
                    <p className="truncate text-sm font-medium text-ink">{currentUser?.fullName}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-secondary">{currentUser?.companyName}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-primary"><ShieldCheck className="size-3.5" /> Hội viên {currentUser?.memberId}</p>
                  </div>
                  <button type="button" onClick={() => navigateTo('profile')} className="mt-2 flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium hover:bg-parchment">Hồ sơ và sự kiện <ChevronRight className="size-4" /></button>
                  <button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm text-danger hover:bg-danger-soft"><LogOut className="size-4" /> Đăng xuất</button>
                </div>
              ) : null}
            </div>

            <button type="button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={mobileMenuOpen} className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-parchment lg:hidden">
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[100px] z-50 overflow-y-auto bg-white p-5 lg:hidden">
          <nav aria-label="Điều hướng trên điện thoại" className="vcf-container divide-y divide-hairline">
            <button type="button" onClick={() => navigateTo('home')} className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium">Trang chủ <ChevronRight className="size-4 text-ink-secondary" /></button>
            <div>
              <button type="button" onClick={() => setMobileKnowledgeOpen((value) => !value)} aria-expanded={mobileKnowledgeOpen} className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium">Hệ tri thức <ChevronDown className={`size-4 transition ${mobileKnowledgeOpen ? 'rotate-180' : ''}`} /></button>
              {mobileKnowledgeOpen ? (
                <div className="mb-4 space-y-1 border-l-2 border-brand-primary pl-4">
                  <button type="button" onClick={() => navigateTo('knowledge')} className="block min-h-11 w-full text-left text-sm font-medium text-brand-primary">Trang chủ hệ tri thức</button>
                  <button type="button" onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })} className="block min-h-11 w-full text-left text-sm">BT Nguyễn Mạnh Hùng</button>
                  <button type="button" onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })} className="block min-h-11 w-full text-left text-sm">Góc nhìn chuyên gia</button>
                  <button type="button" onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })} className="block min-h-11 w-full text-left text-sm">Tri thức phái sinh</button>
                </div>
              ) : null}
            </div>
            <button type="button" onClick={() => navigateTo('events')} className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium">Sự kiện <ChevronRight className="size-4 text-ink-secondary" /></button>
            <div>
              <div className="flex min-h-14 w-full items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('activities');
                  }} 
                  className="flex-1 text-left text-base font-medium py-3 hover:text-brand-primary"
                >
                  Hoạt động VCF (9 hoạt động)
                </button>
                <button 
                  type="button" 
                  onClick={() => setMobileActivitiesOpen((value) => !value)} 
                  aria-expanded={mobileActivitiesOpen} 
                  className="p-3 text-ink-secondary hover:text-ink"
                  aria-label="Mở rộng danh sách 9 hoạt động"
                >
                  <ChevronDown className={`size-4 transition ${mobileActivitiesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileActivitiesOpen ? (
                <div className="mb-4 space-y-1 border-l-2 border-brand-primary pl-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('activities');
                    }} 
                    className="block min-h-11 w-full text-left text-sm font-semibold text-brand-primary"
                  >
                    Xem tổng quan 9 hoạt động →
                  </button>
                  {MOCK_ACTIVITIES.map((activity) => (
                    <button 
                      key={activity.id} 
                      type="button" 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigateTo('activity-detail', { activityId: activity.id });
                      }} 
                      className="block min-h-11 w-full text-left text-sm text-neutral-700 hover:text-ink"
                    >
                      {activity.title}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button type="button" onClick={() => navigateTo('programs')} className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium">Đào tạo CEO <ChevronRight className="size-4 text-ink-secondary" /></button>
            <button type="button" onClick={() => navigateTo('about')} className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium">Giới thiệu <ChevronRight className="size-4 text-ink-secondary" /></button>
          </nav>
          <div className="vcf-container mt-8 border-t border-hairline pt-6">
            <CustomButton fullWidth onClick={() => navigateTo(isLoggedIn ? 'profile' : 'login')}>
              <User className="size-4" /> {isLoggedIn ? 'Hồ sơ hội viên' : 'Đăng nhập tài khoản'}
            </CustomButton>
          </div>
        </div>
      ) : null}

      {searchModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 px-4 pt-24 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSearchModalOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="site-search-title" className="w-full max-w-2xl rounded-lg bg-white p-5 animate-fadeIn sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="site-search-title" className="text-xl font-semibold text-ink">Tìm kiếm trên VCF</h2>
              <button type="button" onClick={() => setSearchModalOpen(false)} aria-label="Đóng tìm kiếm" className="flex size-11 items-center justify-center rounded-full hover:bg-parchment"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleSearchSubmit} role="search" className="space-y-4">
              <label htmlFor="global-search" className="sr-only">Từ khóa tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-secondary" />
                <input id="global-search" autoFocus type="search" value={quickSearchText} onChange={(event) => setQuickSearchText(event.target.value)} placeholder="Sự kiện, bài viết, hoạt động..." className="vcf-field h-14 rounded-full pl-12 pr-5 text-base" />
              </div>
              <div className="flex justify-end"><CustomButton type="submit">Tìm kiếm</CustomButton></div>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  );
};
