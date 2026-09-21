import React from 'react';
import { ArticleItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { WireframeImage } from '../wireframe/WireframeImage';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: ArticleItem;
  featured?: boolean;
  variant?: 'standard' | 'minimal';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  featured = false,
  variant = 'standard'
}) => {
  const { navigateTo } = useApp();

  // Minimal variant: Strictly thumb + subfolder + title only
  if (variant === 'minimal') {
    if (featured) {
      return (
        <div 
          onClick={() => navigateTo('article-detail', { articleId: article.id })}
          className="vcf-card p-4 sm:p-6 cursor-pointer group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">
            <div className="lg:col-span-6">
              <WireframeImage
                label={article.imagePlaceholder}
                imageUrl={article.imageUrl}
                alt={article.title}
                aspectRatio="16:9"
                className="w-full rounded-lg object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
            </div>
            <div className="lg:col-span-6 space-y-3">
              <div>
                <span className="bg-red-50 text-brand-primary border border-red-200/80 px-3 py-1 text-xs font-semibold rounded-full inline-block">
                  {article.subCategory || article.categoryName}
                </span>
              </div>
              <h3 className="text-xl lg:text-3xl font-semibold text-ink group-hover:text-brand-primary transition-colors leading-tight tracking-tight">
                {article.title}
              </h3>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => navigateTo('article-detail', { articleId: article.id })}
        className="vcf-card flex flex-col justify-between cursor-pointer group overflow-hidden h-full"
      >
        <div className="flex flex-col h-full">
          <div className="overflow-hidden">
            <WireframeImage
              label={article.imagePlaceholder}
              imageUrl={article.imageUrl}
              alt={article.title}
              aspectRatio="16:9"
              className="rounded-none border-0 w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <div>
              <span className="text-xs font-semibold text-brand-primary bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full inline-block">
                {article.subCategory || article.categoryName}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-semibold text-ink leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 sm:line-clamp-3">
              {article.title}
            </h4>
          </div>
        </div>
      </div>
    );
  }

  if (featured || article.isSpotlight) {
    return (
      <div 
        onClick={() => navigateTo('article-detail', { articleId: article.id })}
        className="vcf-card p-6 md:p-8 cursor-pointer group"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-5">
            <WireframeImage
              label={article.imagePlaceholder}
              imageUrl={article.imageUrl}
              alt={article.title}
              aspectRatio="16:9"
              className="w-full rounded-lg"
            />
          </div>
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-brand-primary text-white px-3 py-1 text-[10px] font-semibold tracking-wider rounded-full uppercase">
                {article.subCategory || article.categoryName}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold text-ink group-hover:text-brand-primary transition-colors leading-tight tracking-tight">
              {article.title}
            </h3>

            <p className="text-xs md:text-sm text-ink-secondary leading-relaxed line-clamp-3">
              {article.sapo}
            </p>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end">
              <span className="text-xs font-semibold text-brand-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Đọc toàn văn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigateTo('article-detail', { articleId: article.id })}
      className="vcf-card flex flex-col justify-between cursor-pointer group overflow-hidden"
    >
      <div>
        <div className="overflow-hidden">
          <WireframeImage
            label={article.imagePlaceholder}
            imageUrl={article.imageUrl}
            alt={article.title}
            aspectRatio="16:9"
            className="rounded-none border-0 w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        <div className="p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center text-[11px]">
            <span className="truncate max-w-[220px] text-brand-primary font-semibold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              {article.subCategory || article.categoryName}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-ink leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
            {article.title}
          </h4>

          <p className="text-sm text-ink-secondary line-clamp-2 leading-relaxed">
            {article.sapo}
          </p>
        </div>
      </div>
    </div>
  );
};
