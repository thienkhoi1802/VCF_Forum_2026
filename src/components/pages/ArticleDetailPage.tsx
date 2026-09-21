import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { MOCK_ARTICLES } from '../../data/mockData';
import { 
  Calendar, 
  FileText, 
  ArrowLeft,
  Facebook,
  Twitter,
  Link2,
  Check
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { selectedArticleId, navigateTo, showNotification } = useApp();
  const [copied, setCopied] = useState(false);

  const article = MOCK_ARTICLES.find(a => a.id === selectedArticleId) || MOCK_ARTICLES[0];
  const relatedArticles = MOCK_ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    showNotification('Đã sao chép liên kết bài viết vào clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Hệ tri thức LGM', route: 'knowledge', params: { category: 'all' } },
          { 
            label: article.subCategory || article.categoryName || 'Chuyên đề', 
            route: 'knowledge', 
            params: { category: article.category } 
          },
          { label: article.title }
        ]}
      />

      {/* ARTICLE HEADER */}
      <article className="space-y-8">
        <div className="space-y-3 pb-6 border-b border-hairline">
          {/* Category & Date (Không có badge BT Nguyễn Mạnh Hùng, Không có thời gian đọc) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {article.subCategory && (
              <span className="bg-neutral-100 text-neutral-800 text-xs font-semibold px-3 py-1 border border-hairline uppercase tracking-wider">
                {article.subCategory}
              </span>
            )}
            <span className="text-xs text-ink-secondary flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              {article.publishedDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink tracking-tight leading-snug">
            {article.title}
          </h1>

          {/* Subtitle nhỏ gọn gàng, thanh lịch dưới tiêu đề */}
          {article.sapo && (
            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed pt-1">
              {article.sapo}
            </p>
          )}
        </div>

        {/* Featured Image */}
        <WireframeImage
          label={article.imagePlaceholder}
          imageUrl={article.imageUrl}
          alt={article.title}
          aspectRatio="16:9"
          className="w-full border border-hairline overflow-hidden shadow-xs"
        />

        {/* Full Article Content - Dài gấp 5 lần với cấu trúc bài báo chuyên sâu */}
        <div className="prose prose-neutral max-w-none text-base text-neutral-700 space-y-5 leading-relaxed font-sans">
          {article.content.map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-bold text-ink pt-6 pb-2 border-b border-hairline tracking-tight">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg sm:text-xl font-semibold text-ink pt-4 pb-1">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className="my-6 pl-5 border-l-4 border-brand-primary italic text-neutral-800 bg-neutral-50 py-3 pr-4">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
              return (
                <li key={index} className="text-base leading-relaxed text-neutral-700 ml-5 list-disc py-0.5">
                  {paragraph.replace(/^[•-]\s*/, '')}
                </li>
              );
            }
            return (
              <p key={index} className="text-base leading-relaxed text-neutral-700">
                {paragraph}
              </p>
            );
          })}

          {/* Inline Quote Section */}
          <div className="my-8 p-6 bg-red-50/60 border border-red-200 text-sm space-y-2">
            <div className="font-semibold text-brand-primary uppercase tracking-wide text-xs">TRÍCH ĐOẠN KHUYẾN NGHỊ QUẢN TRỊ LGM</div>
            <p className="text-neutral-900 italic leading-relaxed font-medium">
              "Lãnh đạo trong nghịch cảnh đòi hỏi sự bình tâm và định hướng rõ ràng. Một khi hệ thống quản trị đủ minh bạch, mọi mắt xích trong tổ chức sẽ tự động vận hành mà không cần sự can thiệp vi mô liên tục của người đứng đầu."
            </p>
          </div>
        </div>

        {/* DERIVED KNOWLEDGE SOURCE CITATION BLOCK (MANDATORY FOR CATEGORY 3) */}
        {article.category === 'derived-knowledge' && article.sourceReference && (
          <div className="bg-parchment border border-hairline p-6 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-ink uppercase">
              <FileText className="w-4 h-4 text-brand-primary" />
              <span>Nguồn Tham Chiếu & Tài Liệu Gốc (Tri Thức Phái Sinh)</span>
            </div>
            <div className="space-y-1 text-ink-secondary pt-1">
              <div>• <strong>Tác phẩm gốc:</strong> {article.sourceReference.originalSource}</div>
              <div>• <strong>Tác giả / Cơ quan nghiên cứu:</strong> {article.sourceReference.author} ({article.sourceReference.year})</div>
              <div>• <strong>Ghi chú biên soạn:</strong> {article.sourceReference.notes}</div>
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div className="pt-6 border-t border-hairline flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-neutral-800">Từ khóa:</span>
          {article.tags.map((t, idx) => (
            <span key={idx} className="bg-neutral-100 border border-hairline px-3 py-1 text-neutral-700 font-medium">
              #{t}
            </span>
          ))}
        </div>

        {/* Social Share & Navigation Footer */}
        <div className="p-4 bg-white border border-hairline shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <CustomButton
            variant="secondary"
            size="sm"
            onClick={() => navigateTo('knowledge', { category: article.category })}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Quay lại Hệ tri thức LGM
          </CustomButton>

          {/* Social Share Icon Buttons (Facebook, X / Twitter, Copy link) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-ink-secondary font-medium mr-1">Chia sẻ bài viết:</span>
            
            {/* Facebook */}
            <button 
              type="button"
              onClick={handleShareFacebook} 
              className="w-8 h-8 flex items-center justify-center border border-hairline bg-white hover:bg-neutral-100 text-neutral-700 hover:text-blue-600 transition-colors cursor-pointer"
              title="Chia sẻ lên Facebook"
              aria-label="Chia sẻ lên Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>

            {/* X / Twitter */}
            <button 
              type="button"
              onClick={handleShareTwitter} 
              className="w-8 h-8 flex items-center justify-center border border-hairline bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black transition-colors cursor-pointer"
              title="Chia sẻ lên X (Twitter)"
              aria-label="Chia sẻ lên X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </button>

            {/* Copy link */}
            <button 
              type="button"
              onClick={handleCopyLink} 
              className="h-8 px-3 flex items-center gap-1.5 border border-hairline bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-medium transition-colors cursor-pointer"
              title="Sao chép liên kết bài viết"
              aria-label="Sao chép liên kết bài viết"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-neutral-600" />}
              <span>{copied ? 'Đã sao chép' : 'Copy link'}</span>
            </button>
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-hairline pt-8 space-y-6">
            <h3 className="text-xl font-semibold text-ink uppercase">
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
