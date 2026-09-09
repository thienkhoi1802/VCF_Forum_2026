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
          className="border border-neutral-200 bg-white p-4 sm:p-6 cursor-pointer hover:border-[#eb1000] hover:shadow-xs transition-all duration-150 rounded-xl group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">
            <div className="lg:col-span-6">
              <WireframeImage
                label={article.imagePlaceholder}
                imageUrl={article.imageUrl}
                alt={article.title}
                aspectRatio="16:9"
                className="w-full rounded-lg border border-neutral-200 object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
            </div>
            <div className="lg:col-span-6 space-y-3">
              <div>
                <span className="bg-red-50 text-[#eb1000] border border-red-200/80 px-3 py-1 text-xs font-bold rounded-full inline-block">
                  {article.subCategory || article.categoryName}
                </span>
              </div>
              <h3 className="text-base sm:text-xl lg:text-2xl font-black text-black group-hover:text-[#eb1000] transition-colors leading-snug tracking-tight">
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
        className="border border-neutral-200 bg-white flex flex-col justify-between hover:border-[#eb1000] hover:shadow-xs cursor-pointer transition-all duration-150 rounded-xl group overflow-hidden h-full"
      >
        <div className="flex flex-col h-full">
          <div className="p-3 pb-0">
            <WireframeImage
              label={article.imagePlaceholder}
              imageUrl={article.imageUrl}
              alt={article.title}
              aspectRatio="16:9"
              className="rounded-lg border border-neutral-200 w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
            />
          </div>

          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <div>
              <span className="text-xs font-bold text-[#eb1000] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full inline-block">
                {article.subCategory || article.categoryName}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-black leading-snug group-hover:text-[#eb1000] transition-colors line-clamp-2 sm:line-clamp-3">
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
        className="border border-neutral-200 bg-white p-6 md:p-8 cursor-pointer hover:border-[#eb1000] hover:shadow-xs transition-all duration-150 rounded-xl group"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-5">
            <WireframeImage
              label={article.imagePlaceholder}
              imageUrl={article.imageUrl}
              alt={article.title}
              aspectRatio="16:9"
              className="w-full rounded-md border border-neutral-200"
            />
          </div>
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#eb1000] text-white px-3 py-1 text-[10px] font-bold tracking-wider rounded-full uppercase">
                {article.subCategory || article.categoryName}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-black text-black group-hover:text-[#eb1000] transition-colors leading-snug tracking-tight">
              {article.title}
            </h3>

            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed line-clamp-3">
              {article.sapo}
            </p>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end">
              <span className="text-xs font-bold text-[#eb1000] group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
      className="border border-neutral-200 bg-white flex flex-col justify-between hover:border-[#eb1000] hover:shadow-md cursor-pointer transition-all duration-150 rounded-xl group overflow-hidden"
    >
      <div>
        <div className="p-3 pb-0">
          <WireframeImage
            label={article.imagePlaceholder}
            imageUrl={article.imageUrl}
            alt={article.title}
            aspectRatio="16:9"
            className="rounded-lg border border-neutral-200 w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-center text-[11px]">
            <span className="truncate max-w-[220px] text-[#eb1000] font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              {article.subCategory || article.categoryName}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-black text-black leading-snug group-hover:text-[#eb1000] transition-colors line-clamp-2">
            {article.title}
          </h4>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {article.sapo}
          </p>
        </div>
      </div>
    </div>
  );
};
