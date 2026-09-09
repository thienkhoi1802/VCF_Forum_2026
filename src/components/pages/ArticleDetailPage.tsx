import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { MOCK_ARTICLES } from '../../data/mockData';
import { 
  Calendar, 
  Clock, 
  Share2, 
  FileText, 
  ArrowLeft
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { selectedArticleId, navigateTo, showNotification } = useApp();

  const article = MOCK_ARTICLES.find(a => a.id === selectedArticleId) || MOCK_ARTICLES[0];
  const relatedArticles = MOCK_ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);

  const handleShare = () => {
    showNotification('Đã sao chép liên kết bài viết vào clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Hệ tri thức LGM', route: 'knowledge', params: { category: 'all' } },
          { 
            label: article.categoryName, 
            route: 'knowledge', 
            params: { category: article.category } 
          }
        ]}
      />

      {/* ARTICLE HEADER */}
      <article className="space-y-8">
        <div className="space-y-4 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#eb1000] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
              {article.categoryName}
            </span>
            {article.subCategory && (
              <span className="bg-neutral-100 text-neutral-800 text-[11px] font-bold px-3 py-1 rounded-full">
                {article.subCategory}
              </span>
            )}
            <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#eb1000]" />
              {article.publishedDate}
            </span>
            <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#eb1000]" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-snug">
            {article.title}
          </h1>

          {/* Sapo Lead Paragraph */}
          <div className="text-base sm:text-lg text-neutral-800 font-medium leading-relaxed border-l-4 border-[#eb1000] pl-4 py-2 italic bg-neutral-50 rounded-r-lg">
            "{article.sapo}"
          </div>

          {/* Author Byline Box */}
          <div className="p-5 bg-white border border-neutral-200 rounded-lg shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {article.author.avatarUrl ? (
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center font-bold text-xs text-[#eb1000] shrink-0">
                  {article.author.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-black text-sm text-black">{article.author.name}</div>
                <div className="text-xs text-neutral-600 font-medium">{article.author.role}</div>
                <div className="text-[11px] text-neutral-400 line-clamp-1">{article.author.bio}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="p-2.5 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-700 transition-colors shadow-2xs"
                title="Chia sẻ bài viết"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <WireframeImage
          label={article.imagePlaceholder}
          imageUrl={article.imageUrl}
          alt={article.title}
          aspectRatio="16:9"
          className="w-full border border-neutral-200 rounded-lg overflow-hidden shadow-xs"
        />

        {/* Full Article Content */}
        <div className="prose prose-neutral max-w-none text-base text-neutral-700 space-y-6 leading-relaxed font-sans">
          {article.content.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Inline Image Quote Section */}
          <div className="my-8 p-6 bg-red-50/60 border border-red-200 rounded-lg text-sm space-y-2">
            <div className="font-bold text-[#eb1000] uppercase tracking-wide text-xs">TRÍCH ĐOẠN KHUYẾN NGHỊ QUẢN TRỊ LGM</div>
            <p className="text-neutral-900 italic leading-relaxed font-medium">
              "Lãnh đạo trong nghịch cảnh đòi hỏi sự bình tâm và định hướng rõ ràng. Một khi hệ thống quản trị đủ minh bạch, mọi mắt xích trong tổ chức sẽ tự động vận hành mà không cần sự can thiệp vi mô liên tục của người đứng đầu."
            </p>
          </div>
        </div>

        {/* DERIVED KNOWLEDGE SOURCE CITATION BLOCK (MANDATORY FOR CATEGORY 3) */}
        {article.category === 'derived-knowledge' && article.sourceReference && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-black uppercase">
              <FileText className="w-4 h-4 text-[#eb1000]" />
              <span>Nguồn Tham Chiếu & Tài Liệu Gốc (Tri Thức Phái Sinh)</span>
            </div>
            <div className="space-y-1 text-neutral-600 pt-1">
              <div>• <strong>Tác phẩm gốc:</strong> {article.sourceReference.originalSource}</div>
              <div>• <strong>Tác giả / Cơ quan nghiên cứu:</strong> {article.sourceReference.author} ({article.sourceReference.year})</div>
              <div>• <strong>Ghi chú biên soạn:</strong> {article.sourceReference.notes}</div>
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div className="pt-6 border-t border-neutral-200 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-neutral-800">Từ khóa:</span>
          {article.tags.map((t, idx) => (
            <span key={idx} className="bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-neutral-700 font-medium">
              #{t}
            </span>
          ))}
        </div>

        {/* Social Share & Navigation Footer */}
        <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <CustomButton
            variant="secondary"
            size="sm"
            onClick={() => navigateTo('knowledge', { category: article.category })}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Quay lại danh mục {article.categoryName}
          </CustomButton>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium">Chia sẻ bài viết:</span>
            <button onClick={handleShare} className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-bold text-neutral-800 hover:bg-neutral-200 transition-all duration-150">
              Sao chép Link
            </button>
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-neutral-200 pt-8 space-y-6">
            <h3 className="text-xl font-black text-black uppercase">
              Bài Viết Cùng Chuyên Mục
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
