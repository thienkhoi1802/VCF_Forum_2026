import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
import { MOCK_ARTICLES } from '../../data/mockData';
import { 
  FileText, 
  ArrowLeft,
  Check
} from 'lucide-react';

// Solid Social Share Icons - Đồng bộ phong cách Solid với màu xám nhẹ (neutral-500)
const FacebookSolidIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterSolidIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
  </svg>
);

const LinkedinSolidIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.37 9.74v-8.37H5.09v8.37h2.74z" />
  </svg>
);

const MailSolidIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const LinkSolidIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

interface ShareBarProps {
  copied: boolean;
  onShareFacebook: () => void;
  onShareTwitter: () => void;
  onShareLinkedin: () => void;
  onShareEmail: () => void;
  onCopyLink: () => void;
}

// Cụm nút chia sẻ đồng bộ trên dưới (Solid icon + màu xám nhẹ text-neutral-500, khung vuông border-neutral-300)
const ShareBar: React.FC<ShareBarProps> = ({
  copied,
  onShareFacebook,
  onShareTwitter,
  onShareLinkedin,
  onShareEmail,
  onCopyLink
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    {/* Facebook */}
    <button
      type="button"
      onClick={onShareFacebook}
      className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 flex items-center justify-center text-neutral-500 hover:text-neutral-900 shadow-2xs transition-colors cursor-pointer"
      title="Chia sẻ lên Facebook"
      aria-label="Chia sẻ lên Facebook"
    >
      <FacebookSolidIcon className="w-4 h-4" />
    </button>

    {/* Twitter */}
    <button
      type="button"
      onClick={onShareTwitter}
      className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 flex items-center justify-center text-neutral-500 hover:text-neutral-900 shadow-2xs transition-colors cursor-pointer"
      title="Chia sẻ lên Twitter"
      aria-label="Chia sẻ lên Twitter"
    >
      <TwitterSolidIcon className="w-4 h-4" />
    </button>

    {/* LinkedIn */}
    <button
      type="button"
      onClick={onShareLinkedin}
      className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 flex items-center justify-center text-neutral-500 hover:text-neutral-900 shadow-2xs transition-colors cursor-pointer"
      title="Chia sẻ lên LinkedIn"
      aria-label="Chia sẻ lên LinkedIn"
    >
      <LinkedinSolidIcon className="w-4 h-4" />
    </button>

    {/* Email */}
    <button
      type="button"
      onClick={onShareEmail}
      className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 flex items-center justify-center text-neutral-500 hover:text-neutral-900 shadow-2xs transition-colors cursor-pointer"
      title="Chia sẻ qua Email"
      aria-label="Chia sẻ qua Email"
    >
      <MailSolidIcon className="w-4 h-4" />
    </button>

    {/* Copy Link */}
    <button
      type="button"
      onClick={onCopyLink}
      className={`w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center shadow-2xs transition-colors cursor-pointer ${
        copied
          ? 'border-emerald-400 bg-emerald-50/50 text-emerald-600'
          : 'border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-500 hover:text-neutral-900'
      }`}
      title="Sao chép liên kết bài viết"
      aria-label="Sao chép liên kết bài viết"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkSolidIcon className="w-4 h-4" />}
    </button>
  </div>
);

export const ArticleDetailPage: React.FC = () => {
  const { selectedArticleId, navigateTo, showNotification } = useApp();
  const [copied, setCopied] = useState(false);

  const article = MOCK_ARTICLES.find(a => a.id === selectedArticleId) || MOCK_ARTICLES[0];
  const sameCategoryArticles = MOCK_ARTICLES.filter(a => a.id !== article.id && a.category === article.category);
  const otherCategoryArticles = MOCK_ARTICLES.filter(a => a.id !== article.id && a.category !== article.category);
  const relatedArticles = [...sameCategoryArticles, ...otherCategoryArticles].slice(0, 3);

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedin = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(article.title);
    const body = encodeURIComponent(`Đọc bài viết trên Diễn đàn CEO Việt Nam (VCF):\n${article.title}\n\nXem chi tiết tại: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
    <div className="w-full pb-16 sm:pb-24 font-sans bg-white">
      {/* Top Breadcrumb navigation - Bỏ hiển thị tác giả, chỉ giữ Hệ tri thức LGM */}
      <div className="w-[min(100%-3rem,780px)] mx-auto pt-4 sm:pt-6">
        <Breadcrumb
          className="mb-0"
          items={[
            { label: 'Hệ tri thức LGM', route: 'knowledge', params: { category: 'all' } }
          ]}
        />
      </div>

      {/* ARTICLE BODY - CENTERED ADOBE BLOG LAYOUT (max 780px)
          Title cách breadcrumb chính xác 24px (mt-6 = 24px) */}
      <article className="w-[min(100%-3rem,780px)] mx-auto mt-6 space-y-6 sm:space-y-7">
        {/* Article Title (H1) - cách breadcrumb đúng 24px, không còn badge tác giả bên trên */}
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-neutral-900 tracking-tight leading-[1.25]">
          {article.title}
        </h1>

        {/* Sapo / Tóm tắt mở đầu bài viết */}
        {article.sapo && (
          <p className="text-base sm:text-[18px] text-neutral-600 font-normal leading-relaxed">
            {article.sapo}
          </p>
        )}

        {/* Byline trên: Tên tác giả + Ngày đăng & Cụm chia sẻ đồng bộ (Solid icon + màu xám nhẹ) */}
        <div className="pt-2 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100">
          {/* Author info */}
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-neutral-900 hover:text-brand-primary cursor-pointer transition-colors">
              {article.author.name}
            </div>
            <div className="text-xs text-neutral-500 font-normal">
              {article.publishedDate}
            </div>
          </div>

          {/* Cụm Icon Chia sẻ Trên - Đồng bộ chuẩn */}
          <ShareBar
            copied={copied}
            onShareFacebook={handleShareFacebook}
            onShareTwitter={handleShareTwitter}
            onShareLinkedin={handleShareLinkedin}
            onShareEmail={handleShareEmail}
            onCopyLink={handleCopyLink}
          />
        </div>

        {/* Full Article Content - Adobe Blog reading typography (Ảnh đại diện đã được lược bỏ theo yêu cầu) */}
        <div className="max-w-none text-base sm:text-[17.5px] text-neutral-800 space-y-6 leading-[1.8] font-sans pt-1">
          {article.content.map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-bold text-neutral-900 pt-6 pb-2 border-b border-hairline tracking-tight leading-snug">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg sm:text-xl font-semibold text-neutral-900 pt-4 pb-1 leading-snug">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className="my-7 pl-5 border-l-4 border-brand-primary italic text-neutral-800 bg-neutral-50/80 py-4 pr-4 text-[17px] leading-relaxed">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
              return (
                <li key={index} className="text-base sm:text-[17.5px] leading-relaxed text-neutral-700 ml-5 sm:ml-6 list-disc py-0.5">
                  {paragraph.replace(/^[•-]\s*/, '')}
                </li>
              );
            }
            return (
              <p key={index} className="text-base sm:text-[17.5px] leading-[1.8] text-neutral-700">
                {paragraph}
              </p>
            );
          })}

          {/* Inset Quote Callout */}
          <div className="my-8 p-6 bg-red-50/60 border border-red-200 text-sm space-y-2 rounded-sm">
            <div className="font-semibold text-brand-primary uppercase tracking-wider text-xs">TRÍCH ĐOẠN KHUYẾN NGHỊ QUẢN TRỊ LGM</div>
            <p className="text-neutral-900 italic leading-relaxed font-medium text-base sm:text-[17px]">
              "Lãnh đạo trong nghịch cảnh đòi hỏi sự bình tâm và định hướng rõ ràng. Một khi hệ thống quản trị đủ minh bạch, mọi mắt xích trong tổ chức sẽ tự động vận hành mà không cần sự can thiệp vi mô liên tục của người đứng đầu."
            </p>
          </div>
        </div>

        {/* DERIVED KNOWLEDGE SOURCE CITATION BLOCK (MANDATORY FOR CATEGORY 3) */}
        {article.category === 'derived-knowledge' && article.sourceReference && (
          <div className="bg-parchment border border-hairline p-5 space-y-2 text-xs rounded-sm">
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

        {/* THIẾT KẾ ĐIỀU HƯỚNG DƯỚI BODY (Đã bỏ Lưu & Bỏ Thêm Google; Đồng bộ chia sẻ với bên trên) */}
        <div className="pt-6 sm:pt-8 border-t border-hairline flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Trái: Duy nhất Nút Trở lại Hệ tri thức LGM (Đã bỏ nút Lưu theo yêu cầu) */}
          <button
            type="button"
            onClick={() => navigateTo('knowledge', { category: article.category })}
            className="h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-800 text-sm font-medium flex items-center gap-2 shadow-2xs transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-600 shrink-0" />
            <span>Trở lại Hệ tri thức LGM</span>
          </button>

          {/* Phải: Cụm Icon Chia sẻ Dưới - Đồng bộ 100% với cụm trên (Đã bỏ nút Thêm VCF trên Google) */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">Chia sẻ:</span>
            <ShareBar
              copied={copied}
              onShareFacebook={handleShareFacebook}
              onShareTwitter={handleShareTwitter}
              onShareLinkedin={handleShareLinkedin}
              onShareEmail={handleShareEmail}
              onCopyLink={handleCopyLink}
            />
          </div>
        </div>
      </article>

      {/* RELATED NEWS: "Tin cùng chuyên mục" (Full 1280px container, 3 uniform cards, gap 32px) */}
      {relatedArticles.length > 0 && (
        <section className="related-news mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-hairline space-y-6 sm:space-y-8">
          <h3 className="text-xl sm:text-2xl font-bold sm:font-semibold text-ink uppercase tracking-tight">
            Tin cùng chuyên mục
          </h3>
          <div className="related-news-grid">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
