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

  // Minimal variant: Strictly thumb + title only
  if (variant === 'minimal') {
    if (featured) {
      return (
        <div 
          onClick={() => navigateTo('article-detail', { articleId: article.id })}
          className="vcf-card p-3.5 sm:p-5 cursor-pointer group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            <div className="lg:col-span-6">
              <WireframeImage
                label={article.imagePlaceholder}
                imageUrl={article.imageUrl}
                alt={article.title}
                aspectRatio="16:9"
                className="w-full rounded-lg object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
            </div>
            <div className="lg:col-span-6">
              <h3 className="text-[24px] lg:text-3xl font-bold sm:font-semibold text-ink group-hover:text-brand-primary transition-colors leading-tight tracking-tight">
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

          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
            <h4 className="text-[20px] sm:text-base lg:text-lg font-bold sm:font-semibold text-ink leading-snug group-hover:text-brand-primary transition-colors">
              {article.title}
            </h4>
          </div>
        </div>
      </div>
    );
  }

  if (featured) {
    return (
      <div 
        onClick={() => navigateTo('article-detail', { articleId: article.id })}
        className="vcf-card p-4 sm:p-6 cursor-pointer group"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
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
            {/* Title mobile 24px, desktop full title */}
            <h3 className="text-[24px] md:text-3xl font-bold sm:font-semibold text-ink group-hover:text-brand-primary transition-colors leading-tight tracking-tight">
              {article.title}
            </h3>

            <div className="pt-2 sm:pt-3 border-t border-neutral-100 flex items-center justify-end">
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

        {/* Nội dung: Bỏ tag đỏ, bỏ mô tả, show full title */}
        <div className="p-3.5 sm:p-4.5">
          {/* Title bài sau heading: 20px trên mobile, show full title */}
          <h4 className="text-[20px] sm:text-base lg:text-lg font-bold sm:font-semibold text-ink leading-snug group-hover:text-brand-primary transition-colors">
            {article.title}
          </h4>
        </div>
      </div>
    </div>
  );
};
