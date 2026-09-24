import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArticleCard } from '../common/ArticleCard';
import { CustomButton } from '../common/CustomButton';
import { SpecBadge } from '../wireframe/SpecBadge';
import { MOCK_ARTICLES } from '../../data/mockData';
import { FileSearch, Search } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { searchQuery, showSpecAnnotations } = useApp();

  const [inputQuery, setInputQuery] = useState(searchQuery || '');

  const query = inputQuery.toLowerCase().trim();

  const matchingArticles = MOCK_ARTICLES.filter(a => 
    !query || a.title.toLowerCase().includes(query) || a.sapo.toLowerCase().includes(query) || a.author.name.toLowerCase().includes(query) || a.tags.some(t => t.toLowerCase().includes(query))
  );

  const totalResults = matchingArticles.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="vcf-container py-6 pb-24 space-y-8 font-sans">
      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-hairline p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
          <SpecBadge label="C13: Kết quả tìm kiếm toàn văn [Trang phụ]" type="page" />
          <span className="text-ink-secondary">PRD 5.3 Full-Text Engine Prototype</span>
        </div>
      )}

      {/* Search Header Form */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl font-semibold text-ink tracking-tight">
          Tìm kiếm
        </h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Nhập từ khoá tìm kiếm..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-neutral-300 rounded-full focus:outline-none focus:border-brand-primary font-sans shadow-xs transition-all duration-150"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>
          <CustomButton type="submit" variant="primary" size="md" className="shadow-xs" aria-label="Tìm kiếm" title="Tìm kiếm">
            <Search className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Tìm kiếm</span>
          </CustomButton>
        </form>
      </div>

      {/* Results or Empty State */}
      {totalResults === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-ink-secondary mx-auto flex items-center justify-center">
            <FileSearch className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-[28px] leading-tight text-ink">
              Không tìm thấy kết quả phù hợp cho "{inputQuery}"
            </h3>
            <p className="text-xs text-ink-secondary font-sans">
              Vui lòng kiểm tra lại chính tả hoặc thử các từ khóa phổ biến dưới đây:
            </p>
          </div>

        </div>
      ) : (
        <div className="space-y-12">
          {/* Articles Group */}
          {matchingArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <h3 className="font-semibold text-lg text-ink uppercase">
                  Kết quả (24)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingArticles.map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
