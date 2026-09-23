import React from 'react';
import { ArticleItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { WireframeImage } from '../wireframe/WireframeImage';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface KnowledgeFeaturedGridProps {
  articles: ArticleItem[];
  className?: string;
  mobileLimit?: number;
}

export const KnowledgeFeaturedGrid: React.FC<KnowledgeFeaturedGridProps> = ({
  articles,
  className = '',
  mobileLimit
}) => {
  const { navigateTo } = useApp();

  if (!articles || articles.length === 0) return null;

  // Khi danh sách chỉ có 3 bài viết (như trên Trang Chủ theo yêu cầu người dùng)
  if (articles.length <= 3) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch ${className}`}>
        {articles.slice(0, 3).map((article, idx) => (
          <div
            key={article.id}
            onClick={() => navigateTo('article-detail', { articleId: article.id })}
            className="border border-hairline bg-white rounded-xl overflow-hidden hover:border-brand-primary hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group h-full"
          >
            <div>
              {/* 16:9 Visual - Tràn viền 2 bên, tỉ lệ chuẩn */}
              <div className="relative overflow-hidden aspect-video w-full bg-parchment">
                <WireframeImage
                  label={article.imagePlaceholder}
                  imageUrl={article.imageUrl}
                  alt={article.title}
                  aspectRatio="16:9"
                  className="!rounded-none !border-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Nội dung: Bỏ tag đỏ, bỏ mô tả bài viết, show full toàn bộ title */}
              <div className="p-3.5 sm:p-5">
                {/* Title: cùng style đồng nhất 20px trên mobile, show full toàn bộ */}
                <h3 className="text-[20px] sm:text-lg lg:text-xl font-bold text-ink leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
                  {article.title}
                </h3>
              </div>
            </div>

            {/* Action Footer - Padding thu gọn */}
            <div className="px-3.5 py-2.5 sm:px-5 sm:py-3 border-t border-neutral-100 flex items-center justify-between bg-parchment/40 mt-auto">
              <div className="flex items-center gap-2 text-xs text-ink-secondary">
                <span>{article.publishedDate || '15/10/2026'}</span>
              </div>
              <span className="text-xs font-semibold text-brand-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const leadArticle = articles[0];
  const companionArticles = articles.slice(1, 5);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch ${className}`}>
      {/* 1 LEAD ARTICLE LỚN (6 COLS ON DESKTOP) */}
      {leadArticle && (
        <div className="lg:col-span-6 flex flex-col">
          <div
            onClick={() => navigateTo('article-detail', { articleId: leadArticle.id })}
            className="border border-hairline bg-white rounded-xl overflow-hidden hover:border-brand-primary hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group h-full"
          >
            <div>
              {/* 16:9 Visual - Tràn 2 bên trái phải, không có padding */}
              <div className="relative overflow-hidden aspect-video w-full">
                <WireframeImage
                  label={leadArticle.imagePlaceholder}
                  imageUrl={leadArticle.imageUrl}
                  alt={leadArticle.title}
                  aspectRatio="16:9"
                  className="!rounded-none !border-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Headline - Bỏ tag đỏ, bỏ mô tả, show full toàn bộ title */}
              <div className="p-3.5 sm:p-5">
                <h2 className="text-[24px] sm:text-2xl lg:text-[26px] font-bold text-ink leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
                  {leadArticle.title}
                </h2>
              </div>
            </div>

            {/* Clean Action Footer - Padding thu gọn */}
            <div className="px-3.5 py-2.5 sm:px-5 sm:py-3 border-t border-neutral-100 flex items-center justify-between bg-parchment/40 mt-auto">
              <div className="flex items-center gap-2 text-xs text-ink-secondary">
                <span>{leadArticle.publishedDate || '15/10/2026'}</span>
              </div>
              <span className="text-xs font-semibold text-brand-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Đọc toàn văn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 COMPANION STORIES (6 COLS ON DESKTOP, 2x2 GRID) */}
      <div className="lg:col-span-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full">
          {companionArticles.map((article, idx) => {
            const isHiddenOnMobile = Boolean(mobileLimit && (idx + 1) >= mobileLimit);
            return (
              <div
                key={article.id}
                onClick={() => navigateTo('article-detail', { articleId: article.id })}
                className={`border border-hairline bg-white rounded-xl overflow-hidden hover:border-brand-primary hover:shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full ${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                }`}
              >
              <div>
                {/* Thumbnail 16:10 - Tràn 2 bên trái phải, không có padding */}
                <div className="relative overflow-hidden aspect-[16/10] w-full">
                  <WireframeImage
                    label={article.imagePlaceholder}
                    imageUrl={article.imageUrl}
                    alt={article.title}
                    aspectRatio="16:9"
                    className="!rounded-none !border-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content - Bỏ tag đỏ, bỏ mô tả, show full toàn bộ title */}
                <div className="p-3.5 sm:p-4">
                  <h3 className="text-[20px] sm:text-sm lg:text-[15px] font-bold sm:font-semibold text-ink leading-snug group-hover:text-brand-primary transition-colors">
                    {article.title}
                  </h3>
                </div>
              </div>

              {/* Action Footer - Padding thu gọn */}
              <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 border-t border-neutral-100 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-ink-secondary">
                  {article.publishedDate || '2026'}
                </span>
                <span className="font-semibold text-xs text-brand-primary group-hover:text-brand-primary-hover flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
