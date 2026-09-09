import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
import { CustomButton } from '../common/CustomButton';
import { KnowledgeCategoryType } from '../../types';
import { MOCK_ARTICLES } from '../../data/mockData';
import { Filter, Tag, Folder } from 'lucide-react';

export const KnowledgeCategoryPage: React.FC = () => {
  const { 
    selectedKnowledgeCategory, 
    navigateTo
  } = useApp();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [pageCount, setPageCount] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getCategoryInfo = (cat: KnowledgeCategoryType) => {
    switch (cat) {
      case 'hung-bt':
        return {
          title: 'Bài viết của Bộ trưởng Nguyễn Mạnh Hùng',
          desc: 'Các bài viết chuyên sâu về triết lý người đứng đầu, văn hóa kỷ luật thực thi và chiến lược phụng sự quốc gia.',
          code: 'Thư mục 1 / 3'
        };
      case 'other-authors':
        return {
          title: 'Bài viết của các tác giả khác',
          desc: 'Tuyển tập các góc nhìn, phân tích quản trị công ty, tài chính vĩ mô từ các chuyên gia hàng đầu.',
          code: 'Thư mục 2 / 3'
        };
      case 'derived-knowledge':
        return {
          title: 'Tri thức phái sinh (Case Study & Tóm lược sách)',
          desc: 'Nội dung do Ban Nghiên cứu VLGM biên soạn và chuẩn hóa dựa trên tài liệu gốc, case study thực tế.',
          code: 'Thư mục 3 / 3'
        };
    }
  };

  const activeCat: KnowledgeCategoryType = selectedKnowledgeCategory === 'all' ? 'hung-bt' : selectedKnowledgeCategory;
  const currentCatInfo = getCategoryInfo(activeCat);
  const allArticlesInCat = MOCK_ARTICLES.filter(a => a.category === activeCat);

  // Extract unique subcategories
  const subCategories = Array.from(new Set(allArticlesInCat.map(a => a.subCategory).filter(Boolean))) as string[];

  // Extract all unique tags
  const tags = Array.from(new Set(allArticlesInCat.flatMap(a => a.tags)));

  const filteredArticles = allArticlesInCat.filter(a => {
    if (selectedSubCategory !== 'all' && a.subCategory !== selectedSubCategory) return false;
    if (selectedTag !== 'all' && !a.tags.includes(selectedTag)) return false;
    return true;
  });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      setPageCount(prev => prev + 1);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Hệ tri thức LGM', route: 'knowledge', params: { category: 'all' } },
          { label: currentCatInfo.title }
        ]}
      />

      {/* Category Header */}
      <div className="space-y-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full inline-block">
            {currentCatInfo.code}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('knowledge-category', { category: 'hung-bt' })}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-150 ${selectedKnowledgeCategory === 'hung-bt' ? 'bg-[#eb1000] text-white border-[#eb1000] font-bold' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
            >
              BT N.M.Hùng
            </button>
            <button
              onClick={() => navigateTo('knowledge-category', { category: 'other-authors' })}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-150 ${selectedKnowledgeCategory === 'other-authors' ? 'bg-[#eb1000] text-white border-[#eb1000] font-bold' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
            >
              Tác giả khác
            </button>
            <button
              onClick={() => navigateTo('knowledge-category', { category: 'derived-knowledge' })}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-150 ${selectedKnowledgeCategory === 'derived-knowledge' ? 'bg-[#eb1000] text-white border-[#eb1000] font-bold' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
            >
              Tri thức phái sinh
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
          {currentCatInfo.title}
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl font-sans">
          {currentCatInfo.desc}
        </p>

        {/* Subfolder tabs in category page */}
        {subCategories.length > 0 && (
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 mr-2">
              <Tag className="w-3.5 h-3.5 text-[#eb1000]" />
              <span className="uppercase text-[10px] tracking-wider text-black font-black">Tiểu mục:</span>
            </div>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-150 font-semibold ${selectedSubCategory === 'all' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              Tất cả ({allArticlesInCat.length})
            </button>
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-150 font-semibold ${selectedSubCategory === sub ? 'bg-[#eb1000] text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                {sub} ({allArticlesInCat.filter(a => a.subCategory === sub).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter by Tag / Topic */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs bg-white p-4 border border-neutral-200 rounded-lg shadow-xs">
          <Filter className="w-4 h-4 text-[#eb1000]" />
          <span className="font-bold text-neutral-800">Lọc theo chủ đề:</span>
          
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 border rounded-full transition-all duration-150 ${selectedTag === 'all' ? 'bg-[#eb1000] text-white border-[#eb1000] font-bold shadow-xs' : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'}`}
          >
            Tất cả ({allArticlesInCat.length})
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 border rounded-full transition-all duration-150 ${selectedTag === tag ? 'bg-[#eb1000] text-white border-[#eb1000] font-bold shadow-xs' : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="border border-neutral-200 p-12 text-center bg-white rounded-lg space-y-3 shadow-xs">
          <div className="font-black text-black">[S-EMPTY] Không có bài viết nào với bộ lọc này</div>
          <CustomButton variant="secondary" size="sm" onClick={() => setSelectedTag('all')}>
            Xem tất cả bài viết
          </CustomButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      )}

      {/* Pagination / Load More Button */}
      <div className="pt-8 border-t border-neutral-200 flex flex-col items-center gap-3">
        <div className="text-xs text-neutral-500 font-medium">
          Hiển thị <strong>{filteredArticles.length}</strong> trên tổng số <strong>{allArticlesInCat.length}</strong> bài viết
        </div>
        <CustomButton
          variant="secondary"
          size="md"
          disabled={isLoadingMore}
          onClick={handleLoadMore}
        >
          {isLoadingMore ? 'Đang tải thêm...' : 'Xem thêm bài viết (Load More)'}
        </CustomButton>
      </div>
    </div>
  );
};
