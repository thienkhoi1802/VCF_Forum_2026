import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArticleCard } from '../common/ArticleCard';
import { KnowledgeFeaturedGrid } from '../common/KnowledgeFeaturedGrid';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SkeletonLoader } from '../wireframe/SkeletonLoader';
import { MOCK_ARTICLES } from '../../data/mockData';
import { ArticleItem, KnowledgeTabType } from '../../types';
import { 
  ArrowRight,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const PAGE_SIZE = 15;

type TabKey = KnowledgeTabType;

export const KnowledgeHomePage: React.FC = () => {
  const { 
    navigateTo, 
    simulatedState,
    selectedKnowledgeCategory,
    setSelectedKnowledgeCategory 
  } = useApp();
  
  // Subfolders: Tất cả / Tác giả BT. Nguyễn Mạnh Hùng / Góc nhìn chuyên gia / Tri thức phái sinh
  const [activeTab, setActiveTab] = useState<TabKey>(selectedKnowledgeCategory || 'all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Synchronize when selectedKnowledgeCategory changes from AppContext
  useEffect(() => {
    if (selectedKnowledgeCategory) {
      setActiveTab(selectedKnowledgeCategory);
      setCurrentPage(1);
    }
  }, [selectedKnowledgeCategory]);

  const isLoading = simulatedState === 'S-LOADING';
  const isEmpty = simulatedState === 'S-EMPTY';

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'hung-bt', label: 'Tác giả BT. Nguyễn Mạnh Hùng' },
    { key: 'other-authors', label: 'Góc nhìn chuyên gia' },
    { key: 'derived-knowledge', label: 'Tri thức phái sinh' }
  ];

  // Filter articles by active subfolder
  const filteredArticles = useMemo(() => {
    let list = [...MOCK_ARTICLES];

    if (activeTab !== 'all') {
      list = list.filter(a => a.category === activeTab);
    }

    return list;
  }, [activeTab]);

  // Top 5 articles (1 tin lớn dẫn đầu + 4 tin nhỏ theo layout 2x2)
  const topFiveArticles: ArticleItem[] = filteredArticles.slice(0, 5);

  // Remaining articles (15 bài viết / trang)
  const remainingArticles: ArticleItem[] = filteredArticles.length > 5 ? filteredArticles.slice(5) : [];
  const totalPages = Math.max(1, Math.ceil(remainingArticles.length / PAGE_SIZE));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, remainingArticles.length);
  const currentArticles = remainingArticles.slice(startIndex, endIndex);

  // Handle page change with smooth scroll to feed
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const feedElement = document.getElementById('articles-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setSelectedKnowledgeCategory(key);
    setCurrentPage(1);
  };

  return (
    <div className="vcf-container py-4 sm:py-6 pb-16 sm:pb-24 space-y-5 sm:space-y-8 font-sans">
      {/* Header: Title chính: Hệ tri thức LGM -> Phân subfolder tabs */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-[24px] sm:text-3xl lg:text-4xl font-bold sm:font-semibold text-ink tracking-tight">
            Hệ tri thức LGM
          </h1>
          <span className="text-xs text-neutral-500 font-medium">
            Kho tri thức lãnh đạo, quản trị và chiến lược VCF
          </span>
        </div>

        {/* Subfolder Navigation Tabs: Tất cả / BT. Nguyễn Mạnh Hùng / Góc nhìn chuyên gia / Tri thức phái sinh */}
        <div className="flex items-center gap-2 sm:gap-6 border-b border-hairline overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`pb-2.5 sm:pb-3 pt-1 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#AB071E] text-[#AB071E]'
                    : 'border-transparent text-ink-secondary hover:text-ink hover:border-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : isEmpty || filteredArticles.length === 0 ? (
        <div className="border border-hairline bg-white rounded-none p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-none bg-red-50 text-[#AB071E] flex items-center justify-center mx-auto font-semibold text-lg">
            !
          </div>
          <div className="font-semibold text-base sm:text-lg text-ink">Chưa có bài viết nào trong danh mục này</div>
          <button 
            onClick={() => {
              handleTabChange('all');
            }}
            className="px-5 py-2.5 rounded-none text-xs font-semibold text-white bg-[#AB071E] hover:bg-[#8E0518] transition-colors cursor-pointer"
          >
            Xem tất cả bài viết
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-10">
          {/* =========================================================================
              3. CỤM 5 BÀI VIẾT NỔI BẬT: 1 TIN LỚN DẪN ĐẦU + 4 TIN NHỎ (2x2 GRID)
              ========================================================================= */}
          {topFiveArticles.length > 0 && (
            <KnowledgeFeaturedGrid articles={topFiveArticles} />
          )}

          {/* =========================================================================
              4. 15 BÀI VIẾT CÒN LẠI + PAGE NUMBER PHÂN TRANG (PAGINATED ARTICLE FEED)
              ========================================================================= */}
          {remainingArticles.length > 0 && (
            <section id="articles-feed" className="space-y-5 sm:space-y-8 pt-4 sm:pt-6 border-t border-hairline scroll-mt-16">
              {/* Articles Grid (15 items per page) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {currentArticles.map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>

              {/* =========================================================================
                  PAGE NUMBER PHÂN TRANG (PAGINATION BAR)
                  ========================================================================= */}
              {totalPages > 1 && (
                <div className="pt-6 pb-2 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Information count */}
                  <div className="text-xs text-ink-secondary font-medium">
                    Trang <strong className="text-ink">{currentPage}</strong> / {totalPages} • Hiển thị bài <strong>{startIndex + 1}</strong> - <strong>{endIndex}</strong> trong <strong>{remainingArticles.length}</strong> bài viết
                  </div>

                  {/* Page number buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        currentPage === 1
                          ? 'border-hairline text-neutral-300 cursor-not-allowed bg-parchment'
                          : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-ink cursor-pointer bg-white shadow-xs'
                      }`}
                      aria-label="Trang trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Trang trước</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-brand-primary text-white shadow-xs scale-105'
                              : 'bg-white border border-hairline text-neutral-700 hover:bg-neutral-100 hover:text-ink'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        currentPage === totalPages
                          ? 'border-hairline text-neutral-300 cursor-not-allowed bg-parchment'
                          : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-ink cursor-pointer bg-white shadow-xs'
                      }`}
                      aria-label="Trang sau"
                    >
                      <span className="hidden sm:inline">Trang sau</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};
