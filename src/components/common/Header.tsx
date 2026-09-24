import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
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
import { VcfLogo } from './VcfLogo';

type MegaMenu = 'activities' | 'knowledge' | null;

const SEARCH_QUICK_LINKS = [
  'Tri thức lãnh đạo',
  'Chuyển đổi số',
  'Quản trị doanh nghiệp',
  'CEO Summit',
  'Cố vấn & Mentor'
];

export const Header: React.FC = () => {
  const { currentRoute, navigateTo, isLoggedIn, currentUser, logout, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);
  const [mobileKnowledgeOpen, setMobileKnowledgeOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenu>(null);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [quickSearchText, setQuickSearchText] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setDesktopSearchOpen(false);
    setUserDropdownOpen(false);
  }, [currentRoute]);

  useEffect(() => {
    if (mobileMenuOpen || desktopSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [desktopSearchOpen, mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setDesktopSearchOpen(false);
      setQuickSearchText('');
      setMobileMenuOpen(false);
      setActiveMegaMenu(null);
      setUserDropdownOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#user-dropdown-container') && !target.closest('#mobile-user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userDropdownOpen]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = quickSearchText.trim();
    if (!query) return;
    setDesktopSearchOpen(false);
    setMobileMenuOpen(false);
    setQuickSearchText('');
    navigateTo('search', { searchQuery: query });
  };

  const openDesktopSearch = () => {
    setActiveMegaMenu(null);
    setUserDropdownOpen(false);
    setDesktopSearchOpen(true);
  };

  const closeDesktopSearch = () => {
    setDesktopSearchOpen(false);
    setQuickSearchText('');
  };

  const isKnowledgeRoute = ['knowledge', 'knowledge-category', 'article-detail'].includes(currentRoute);
  const isActivityRoute = ['activities', 'activity-detail'].includes(currentRoute);
  const navClass = (active: boolean) =>
    `group relative flex h-full items-center px-1.5 text-sm font-medium transition-colors cursor-pointer after:absolute after:inset-x-0 after:bottom-0 after:h-[2.5px] after:transition-all ${
      active
        ? 'text-ink font-semibold after:bg-brand-primary'
        : 'text-ink-secondary hover:text-ink after:bg-transparent hover:after:bg-neutral-300'
    }`;

  return (
    <header className={desktopSearchOpen ? 'sticky top-0 z-[70] w-full' : mobileMenuOpen ? 'fixed top-0 inset-x-0 z-50 w-full' : (['event-detail', 'article-detail'].includes(currentRoute) ? 'relative z-40 w-full lg:sticky lg:top-0' : 'sticky top-0 z-40 w-full')}>
      <div className={`border-b border-black/8 transition-colors ${mobileMenuOpen ? 'bg-white' : 'bg-white/88 backdrop-blur-xl'}`}>
        <div className="vcf-container flex h-16 lg:h-[55px] items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            aria-label="Về trang chủ Vietnam CEO Forum"
            className="group flex shrink-0 items-center text-left cursor-pointer transition-opacity hover:opacity-90 py-1"
          >
            <VcfLogo height={38} className="transition-transform group-active:scale-95" />
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
                className={`${navClass(isKnowledgeRoute)} gap-1.5`}
                aria-expanded={activeMegaMenu === 'knowledge'}
                aria-controls="knowledge-menu"
                aria-label="Mở trang Hệ tri thức LGM"
              >
                <span>Tri thức</span>
                <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-200 ${activeMegaMenu === 'knowledge' ? 'rotate-180' : ''}`} />
              </button>
              {activeMegaMenu === 'knowledge' ? (
                <div id="knowledge-menu" className="absolute left-0 top-full w-[400px] rounded-none border border-neutral-200 bg-white p-3 shadow-lg animate-fadeIn z-50">
                  {[
                    {
                      category: 'hung-bt' as const,
                      title: 'Tác giả BT. Nguyễn Mạnh Hùng',
                    },
                    {
                      category: 'other-authors' as const,
                      title: 'Góc nhìn chuyên gia',
                    },
                    {
                      category: 'derived-knowledge' as const,
                      title: 'Tri thức phái sinh',
                    },
                  ].map(({ category, title }) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setActiveMegaMenu(null);
                        navigateTo('knowledge', { category });
                      }}
                      className="block w-full rounded-none px-3 py-3 text-left hover:bg-neutral-50 group cursor-pointer transition-colors border-b border-neutral-100 last:border-b-0"
                    >
                      <span className="block text-sm font-semibold text-neutral-900 group-hover:text-[#AB071E] transition-colors">{title}</span>
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
                className={`${navClass(isActivityRoute)} gap-1.5`}
                aria-expanded={activeMegaMenu === 'activities'}
                aria-controls="activities-menu"
                aria-label="Mở trang tổng quan 9 hoạt động VCF"
              >
                <span>Hoạt động</span>
                <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-200 ${activeMegaMenu === 'activities' ? 'rotate-180' : ''}`} />
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

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop: Search panel mở rộng từ ngay dưới header */}
            <button
              type="button"
              onClick={desktopSearchOpen ? closeDesktopSearch : openDesktopSearch}
              aria-label={desktopSearchOpen ? 'Đóng tìm kiếm' : 'Mở tìm kiếm'}
              aria-expanded={desktopSearchOpen}
              className="hidden size-11 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-parchment hover:text-ink lg:flex"
            >
              {desktopSearchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>

            {/* Mobile: Biểu tượng icon User thay thế nút search - Hỗ trợ cả 2 trạng thái Chưa login và Đã login */}
            <div id="mobile-user-dropdown-container" className="relative lg:hidden">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigateTo('profile')}
                  aria-label="Mở hồ sơ hội viên"
                  className="flex size-11 items-center justify-center rounded-full hover:bg-parchment transition-colors"
                >
                  <span style={{ borderRadius: '50%' }} className="flex size-8 aspect-square items-center justify-center bg-brand-primary text-xs font-semibold text-white shadow-xs ring-2 ring-white overflow-hidden">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  aria-label="Đăng nhập tài khoản"
                  className="flex size-11 items-center justify-center rounded-full text-ink-secondary hover:bg-parchment hover:text-ink transition-colors"
                >
                  <User className="size-5.5 text-ink" />
                </button>
              )}

            </div>

            {/* Desktop: User Account button */}
            <div id="user-dropdown-container" className="relative hidden lg:block">
              {isLoggedIn ? (
                <button type="button" onClick={() => setUserDropdownOpen((value) => !value)} aria-label="Mở menu tài khoản hội viên" aria-expanded={userDropdownOpen} className="flex min-h-11 items-center gap-1 rounded-full px-1.5 text-sm font-medium text-ink hover:bg-parchment">
                  <span className="member-avatar flex size-7 items-center justify-center rounded-full bg-brand-primary text-xs text-white">{currentUser?.fullName.charAt(0) || 'U'}</span>
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

            {/* Hamburger button */}
            <button
              type="button"
              onClick={() => {
                setUserDropdownOpen(false);
                setMobileMenuOpen((value) => !value);
              }}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
              className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-parchment lg:hidden"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {desktopSearchOpen ? (
        <>
          <button
            type="button"
            aria-label="Đóng tìm kiếm"
            onClick={closeDesktopSearch}
            className="fixed inset-x-0 bottom-0 top-[55px] z-40 hidden cursor-default bg-black/45 backdrop-blur-md lg:block"
          />
          <section aria-label="Tìm kiếm bài viết" className="absolute inset-x-0 top-full z-50 hidden min-h-[38rem] bg-[#f5f5f7] shadow-[0_18px_30px_rgba(0,0,0,0.12)] lg:block motion-safe:animate-fadeIn">
            <div className="vcf-container py-16 xl:py-20">
              <form onSubmit={handleSearchSubmit} role="search" className="max-w-5xl">
                <label htmlFor="desktop-header-search" className="sr-only">Tìm kiếm bài viết</label>
                <div className="relative flex items-center">
                  <Search className="pointer-events-none mr-5 size-8 shrink-0 text-neutral-600" aria-hidden="true" />
                  <input
                    id="desktop-header-search"
                    autoFocus
                    type="search"
                    value={quickSearchText}
                    onChange={(event) => setQuickSearchText(event.target.value)}
                    placeholder="Tìm kiếm bài viết"
                    className="min-w-0 flex-1 bg-transparent py-2 text-[40px] font-semibold leading-tight tracking-tight text-ink placeholder:text-neutral-500 focus:outline-none"
                  />
                </div>
              </form>

              <div className="mt-16 max-w-5xl">
                <p className="text-lg font-medium text-neutral-500">Liên kết nhanh</p>
                <div className="mt-5 flex flex-col items-start gap-3">
                  {SEARCH_QUICK_LINKS.map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => {
                        closeDesktopSearch();
                        navigateTo('search', { searchQuery: link });
                      }}
                      className="flex min-h-10 items-center gap-3 text-left text-sm font-semibold text-ink transition-colors hover:text-brand-primary"
                    >
                      <ArrowRight className="size-5 text-neutral-500" aria-hidden="true" />
                      <span>{link}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {mobileMenuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-white px-6 py-5 lg:hidden shadow-2xl">
          {/* Mobile Search: Mở rộng thanh tìm kiếm bên trong menu theo yêu cầu */}
          <div className="mb-4 pb-2">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const query = quickSearchText.trim();
                if (!query) return;
                setMobileMenuOpen(false);
                setQuickSearchText('');
                navigateTo('search', { searchQuery: query });
              }}
              role="search"
              className="relative"
            >
              <label htmlFor="mobile-menu-search-input" className="sr-only">Tìm kiếm</label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-secondary pointer-events-none" />
              <input
                id="mobile-menu-search-input"
                type="search"
                value={quickSearchText}
                onChange={(event) => setQuickSearchText(event.target.value)}
                placeholder="Tìm kiếm sự kiện, bài viết, hoạt động..."
                className="w-full rounded-full border border-neutral-300 bg-parchment/60 py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-neutral-500 focus:bg-white focus:border-brand-primary focus:outline-none transition-all shadow-2xs"
              />
              {quickSearchText ? (
                <button
                  type="button"
                  onClick={() => setQuickSearchText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-ink"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </form>
          </div>

          <nav aria-label="Điều hướng trên điện thoại" className="divide-y divide-hairline">
            <button 
              type="button" 
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('home');
              }} 
              className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium"
            >
              Trang chủ
            </button>
            <div>
              <div className="flex min-h-14 w-full items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('knowledge');
                  }} 
                  className="flex-1 text-left text-base font-medium py-3 hover:text-brand-primary"
                >
                  Hệ tri thức
                </button>
                <button 
                  type="button" 
                  onClick={() => setMobileKnowledgeOpen((value) => !value)} 
                  aria-expanded={mobileKnowledgeOpen} 
                  className="px-px py-3 text-ink-secondary hover:text-ink"
                  aria-label="Mở rộng danh mục hệ tri thức"
                >
                  <ChevronDown className={`size-4 transition ${mobileKnowledgeOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileKnowledgeOpen ? (
                <div className="mb-4 space-y-1 border-l-2 border-brand-primary pl-4">
                  {[
                    { category: 'hung-bt' as const, title: 'Tác giả BT. Nguyễn Mạnh Hùng' },
                    { category: 'other-authors' as const, title: 'Góc nhìn chuyên gia' },
                    { category: 'derived-knowledge' as const, title: 'Tri thức phái sinh' },
                  ].map(({ category, title }) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigateTo('knowledge', { category });
                      }}
                      className="block min-h-10 w-full text-left text-sm text-neutral-800 hover:text-brand-primary font-medium py-1.5"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button 
              type="button" 
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('events');
              }} 
              className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium"
            >
              Sự kiện <ChevronRight className="size-4 text-ink-secondary" />
            </button>
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
                  Hoạt động VCF
                </button>
                <button 
                  type="button" 
                  onClick={() => setMobileActivitiesOpen((value) => !value)} 
                  aria-expanded={mobileActivitiesOpen} 
                  className="px-px py-3 text-ink-secondary hover:text-ink"
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
            <button 
              type="button" 
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('programs');
              }} 
              className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium"
            >
              Đào tạo CEO
            </button>
            <button 
              type="button" 
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('about');
              }} 
              className="flex min-h-14 w-full items-center justify-between text-left text-base font-medium"
            >
              Giới thiệu
            </button>
          </nav>
          <div className="mt-8 border-t border-hairline pt-6">
            <CustomButton fullWidth onClick={() => {
              setMobileMenuOpen(false);
              navigateTo(isLoggedIn ? 'profile' : 'login');
            }}>
              <User className="size-4" /> {isLoggedIn ? 'Hồ sơ hội viên' : 'Đăng nhập tài khoản'}
            </CustomButton>
          </div>
        </div>
      ) : null}

    </header>
  );
};
