import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
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
  
  // Tabs: Tất cả / Bài viết của BT Nguyễn Mạnh Hùng / Tác giả khác / Tri thức phái sinh
  const [activeTab, setActiveTab] = useState<TabKey>(selectedKnowledgeCategory || 'all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Synchronize when selectedKnowledgeCategory changes from AppContext (e.g. back button from article or breadcrumb)
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
    { key: 'hung-bt', label: 'Bài viết của BT Nguyễn Mạnh Hùng' },
    { key: 'other-authors', label: 'Tác giả khác' },
    { key: 'derived-knowledge', label: 'Tri thức phái sinh' }
  ];

  // Filter articles by active tab
  const filteredArticles = useMemo(() => {
    let list = [...MOCK_ARTICLES];

    if (activeTab !== 'all') {
      list = list.filter(a => a.category === activeTab);
    }

    return list;
  }, [activeTab]);

  // Top 4 articles (1 tin lớn dẫn đầu + 3 tin đồng hành)
  const topFourArticles: ArticleItem[] = filteredArticles.slice(0, 4);
  const leadArticle: ArticleItem | null = topFourArticles.length > 0 ? topFourArticles[0] : null;
  const companionArticles: ArticleItem[] = topFourArticles.length > 1 ? topFourArticles.slice(1, 4) : [];

  // Remaining articles (15 bài viết / trang)
  const remainingArticles: ArticleItem[] = filteredArticles.length > 4 ? filteredArticles.slice(4) : [];
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      {/* 1. Breadcrumb: Trang chủ -> Hệ tri thức LGM (-> Subfolder nếu có tab active) */}
      <Breadcrumb 
        items={
          activeTab === 'all'
            ? [{ label: 'Hệ tri thức LGM' }]
            : [
                { label: 'Hệ tri thức LGM', route: 'knowledge', params: { category: 'all' } },
                { label: tabs.find(t => t.key === activeTab)?.label || 'Bài viết' }
              ]
        } 
      />

      {/* 2. Header: Title chính: Hệ tri thức LGM -> Bên dưới phân tab (Tất cả / Tác giả Bộ trưởng Nguyễn Mạnh Hùng / Tác giả khác / Tri thức phái sinh) */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
          Hệ tri thức LGM
        </h1>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-6 border-b border-neutral-200 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`pb-3 pt-1 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px shrink-0 ${
                  isActive
                    ? 'border-[#eb1000] text-[#eb1000]'
                    : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
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
        <div className="border border-neutral-200 bg-white rounded-xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#eb1000] flex items-center justify-center mx-auto font-bold text-lg">
            !
          </div>
          <div className="font-black text-lg text-black">Chưa có bài viết nào trong mục này</div>
          <button 
            onClick={() => handleTabChange('all')}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#eb1000] hover:bg-[#c90d00] transition-colors"
          >
            Xem tất cả bài viết
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* =========================================================================
              3. CỤM 4 BÀI VIẾT (1 Tin Lead lớn bên trái + 3 Tin đồng hành bên phải)
              (Bỏ Tác giả, Thời gian, Số phút đọc)
              ========================================================================= */}
          {topFourArticles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* 1 LEAD ARTICLE LỚN (7 COLS ON DESKTOP) */}
              {leadArticle && (
                <div 
                  onClick={() => navigateTo('article-detail', { articleId: leadArticle.id })}
                  className="lg:col-span-7 border border-neutral-200 bg-white rounded-xl overflow-hidden hover:border-[#eb1000] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="p-5 sm:p-6 pb-0 space-y-4">
                    {/* 16:9 Visual */}
                    <div className="relative rounded-lg overflow-hidden border border-neutral-200 aspect-video">
                      <WireframeImage
                        label={leadArticle.imagePlaceholder}
                        imageUrl={leadArticle.imageUrl}
                        alt={leadArticle.title}
                        aspectRatio="16:9"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>

                    {/* Badge & Headline (No author, date, or read time) */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#eb1000] font-bold text-xs bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                          {leadArticle.subCategory || leadArticle.categoryName}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-black leading-tight group-hover:text-[#eb1000] transition-colors">
                        {leadArticle.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                        {leadArticle.sapo}
                      </p>
                    </div>
                  </div>

                  {/* Clean Action Footer */}
                  <div className="p-5 sm:p-6 pt-4 mt-4 border-t border-neutral-100 flex items-center justify-end bg-neutral-50/50">
                    <span className="text-xs font-bold text-[#eb1000] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Đọc toàn văn</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}

              {/* 3 COMPANION STORIES (5 COLS ON DESKTOP) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {companionArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    onClick={() => navigateTo('article-detail', { articleId: article.id })}
                    className="border border-neutral-200 bg-white rounded-xl p-4 hover:border-[#eb1000] hover:shadow-xs transition-all duration-200 cursor-pointer group flex-1 flex flex-col justify-between"
                  >
                    <div className="flex gap-4 items-start">
                      {/* Thumbnail 16:9 compact */}
                      <div className="w-28 sm:w-32 aspect-video rounded-lg overflow-hidden border border-neutral-200 shrink-0 relative">
                        <WireframeImage
                          label={article.imagePlaceholder}
                          imageUrl={article.imageUrl}
                          alt={article.title}
                          aspectRatio="16:9"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 2}
                        </span>
                      </div>

                      {/* Content (No author, date, or read time) */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {article.subCategory && (
                          <div>
                            <span className="font-bold text-[#eb1000] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full text-[10px] inline-block">
                              {article.subCategory}
                            </span>
                          </div>
                        )}

                        <h3 className="font-black text-xs sm:text-sm text-black leading-snug line-clamp-2 group-hover:text-[#eb1000] transition-colors">
                          {article.title}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-end">
                      <span className="font-bold text-xs text-[#eb1000] group-hover:text-[#c90d00] flex items-center gap-0.5">
                        <span>Chi tiết</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              4. 15 BÀI VIẾT CÒN LẠI + PAGE NUMBER PHÂN TRANG (PAGINATED ARTICLE FEED)
              ========================================================================= */}
          {remainingArticles.length > 0 && (
            <section id="articles-feed" className="space-y-8 pt-6 border-t border-neutral-200 scroll-mt-16">
              {/* Articles Grid (15 items per page) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentArticles.map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>

              {/* =========================================================================
                  PAGE NUMBER PHÂN TRANG (PAGINATION BAR)
                  ========================================================================= */}
              {totalPages > 1 && (
                <div className="pt-6 pb-2 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Information count */}
                  <div className="text-xs text-neutral-500 font-medium">
                    Trang <strong className="text-black">{currentPage}</strong> / {totalPages} • Hiển thị bài <strong>{startIndex + 1}</strong> - <strong>{endIndex}</strong> trong <strong>{remainingArticles.length}</strong> bài viết
                  </div>

                  {/* Page number buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        currentPage === 1
                          ? 'border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50'
                          : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-black cursor-pointer bg-white shadow-xs'
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
                          className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                            isActive
                              ? 'bg-[#eb1000] text-white shadow-xs scale-105'
                              : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black'
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
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        currentPage === totalPages
                          ? 'border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50'
                          : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-black cursor-pointer bg-white shadow-xs'
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
