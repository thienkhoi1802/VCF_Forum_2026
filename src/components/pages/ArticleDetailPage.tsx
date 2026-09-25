import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
import { MOCK_ARTICLES } from '../../data/mockData';
import { ArticleItem } from '../../types';
import { 
  FileText, 
  ArrowLeft,
  Check,
  Menu,
  Share2
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

// Helper function ensuring all articles in Tri thức have rich long-form content and inline demo images
const getEnhancedContent = (article: ArticleItem): string[] => {
  if (article.content && article.content.length >= 7) {
    return article.content;
  }
  const base = [...article.content];
  base.push(
    '## I. Bối Cảnh Thực Tiễn & Thách Thức Quản Trị Cốt Lõi',
    'Trong môi trường kinh doanh đầy biến động hiện nay, các nhà lãnh đạo doanh nghiệp liên tục phải đối mặt với bài toán vừa tối ưu hiệu quả ngắn hạn, vừa duy trì nguồn lực đầu tư cho năng lực cốt lõi dài hạn. Sự thành công của tổ chức không thể chỉ dựa vào trực giác hay kinh nghiệm cá nhân đơn lẻ, mà đòi hỏi một hệ thống quản trị minh bạch và tư duy chiến lược có chiều sâu.',
    '> "Thử thách lớn nhất của người đứng đầu không phải là đối mặt với bão giông, mà là giữ cho ngọn hải đăng của tổ chức luôn rực sáng để đội ngũ không mất phương hướng."',
    '![Ảnh 2: Tọa đàm chuyên đề và phiên đối thoại chiến lược chuyên sâu của lãnh đạo doanh nghiệp](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80)',
    '## II. Khung Giải Pháp Thực Thi Toàn Diện Cho Nhà Lãnh Đạo',
    'Để hiện thực hóa định hướng chiến lược vào từng nhịp thở vận hành của doanh nghiệp, các chuyên gia Viện LGM khuyến nghị 4 trọng tâm hành động:',
    '• 1. Tinh gọn hóa quy trình ra quyết định: Loại bỏ các khâu trung gian không tạo ra giá trị, ủy quyền có kiểm soát cho đội ngũ quản lý cơ sở.',
    '• 2. Xây dựng văn hóa kỷ luật và trách nhiệm giải trình: Đo lường tiến độ công việc dựa trên kết quả đầu ra thực tế thay vì thời gian có mặt tại văn phòng.',
    '• 3. Ứng dụng công nghệ và dữ liệu tập trung: Thiết lập bảng điều khiển số (Executive Dashboard) để ban điều hành nắm bắt sức khỏe tài chính theo thời gian thực.',
    '• 4. Đầu tư phát triển thế hệ lãnh đạo kế cận: Luân chuyển cán bộ trẻ qua các bài toán khó để tích lũy bản lĩnh thực chiến.',
    '![Ảnh 3: Đội ngũ điều hành phân tích dữ liệu và thiết lập lộ trình hành động ưu tiên](https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80)',
    '## III. Bài Học Đúc Kết Dành Cho Nhà Quản Trị',
    'Mọi sự chuyển đổi bền vững đều bắt đầu từ sự cam kết và làm gương của người đứng đầu. Khi ban lãnh đạo kiên định với sứ mệnh phụng sự và không ngừng học hỏi, tổ chức sẽ tích tụ được nội lực mạnh mẽ để vượt qua mọi chu kỳ thăng trầm của thị trường.'
  );
  return base;
};

export const ArticleDetailPage: React.FC = () => {
  const { selectedArticleId, navigateTo, showNotification, setMobileMenuOpen } = useApp();
  const [copied, setCopied] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fontSizeMenuOpen, setFontSizeMenuOpen] = useState(false);
  const [fontScale, setFontScale] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  const article = MOCK_ARTICLES.find(a => a.id === selectedArticleId) || MOCK_ARTICLES[0];
  const articleContent = React.useMemo(() => getEnhancedContent(article), [article]);
  const sameCategoryArticles = MOCK_ARTICLES.filter(a => a.id !== article.id && a.category === article.category);
  const otherCategoryArticles = MOCK_ARTICLES.filter(a => a.id !== article.id && a.category !== article.category);
  const relatedArticles = [...sameCategoryArticles, ...otherCategoryArticles].slice(0, 3);

  // Scroll listener for sticky bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
        setFontSizeMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key to close popovers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFontSizeMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Chia sẻ theo thiết bị (Web Share API)
  const handleDeviceShare = async () => {
    const shareData = {
      title: article.title,
      text: article.sapo || article.title,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const getParagraphClass = (scale: 'sm' | 'base' | 'lg' | 'xl') => {
    switch (scale) {
      case 'sm':
        return 'text-[15px] sm:text-[16px] leading-[1.7] text-neutral-700';
      case 'lg':
        return 'text-[18.5px] sm:text-[19.5px] leading-[1.85] text-neutral-700';
      case 'xl':
        return 'text-[20.5px] sm:text-[22px] leading-[1.9] text-neutral-800';
      case 'base':
      default:
        return 'text-[17px] sm:text-[17.5px] leading-[1.8] text-neutral-700';
    }
  };

  const getListItemClass = (scale: 'sm' | 'base' | 'lg' | 'xl') => {
    switch (scale) {
      case 'sm':
        return 'text-[15px] sm:text-[16px] leading-[1.7] text-neutral-700 ml-5 sm:ml-6 list-disc py-0.5';
      case 'lg':
        return 'text-[18.5px] sm:text-[19.5px] leading-[1.85] text-neutral-700 ml-5 sm:ml-6 list-disc py-0.5';
      case 'xl':
        return 'text-[20.5px] sm:text-[22px] leading-[1.9] text-neutral-800 ml-5 sm:ml-6 list-disc py-0.5';
      case 'base':
      default:
        return 'text-[17px] sm:text-[17.5px] leading-relaxed text-neutral-700 ml-5 sm:ml-6 list-disc py-0.5';
    }
  };

  return (
    <div className="w-full pb-20 sm:pb-24 font-sans bg-white relative">
      {/* Top Breadcrumb navigation - Bỏ hiển thị tác giả, chỉ giữ Hệ tri thức LGM */}
      <div className="w-[min(100%-3rem,780px)] mx-auto pt-1.5 sm:pt-6">
        <Breadcrumb
          className="mb-0"
          items={[
            { label: 'Hệ tri thức LGM', route: 'knowledge', params: { category: 'all' } }
          ]}
        />
      </div>

      {/* ARTICLE BODY - CENTERED ADOBE BLOG LAYOUT (max 780px) */}
      <article className="w-[min(100%-3rem,780px)] mx-auto mt-4 sm:mt-6 space-y-5 sm:space-y-6">
        {/* Cấu trúc phần đầu bài viết:
            1. Title bài viết
            2. Mô tả bài viết (Sapo - gần Title hơn, space-y-2.5)
            3. Thời gian xuất bản (Bỏ 8 phút đọc, bỏ tác giả, bỏ social share trên mobile) */}
        <header className="space-y-2 sm:space-y-2.5">
          {/* 1. Title bài viết */}
          <h1 className="text-[36px] font-bold text-neutral-900 tracking-tight leading-[1.28]">
            {article.title}
          </h1>

          {/* 2. Mô tả bài viết (Sapo) - Nằm sát ngay dưới Title */}
          {article.sapo && (
            <p className="text-[17px] sm:text-[17.5px] text-neutral-600 font-normal leading-relaxed pt-0.5">
              {article.sapo}
            </p>
          )}

          {/* 3. Thời gian xuất bản - Chỉ thời gian xuất bản, bỏ tác giả & bỏ 8 phút đọc */}
          <div className="pt-2 flex items-center justify-between border-b border-neutral-100 pb-3">
            <time className="text-xs sm:text-sm text-neutral-500 font-normal tracking-wide" dateTime={article.publishedDate}>
              {article.publishedDate}
            </time>

            {/* Desktop share buttons (ẩn hoàn toàn trên mobile theo yêu cầu "Bỏ Social share") */}
            <div className="hidden sm:block">
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
        </header>

        {/* Featured Hero Demo Image (Ảnh đại diện chính của bài viết chi tiết) */}
        {article.imageUrl && (
          <figure className="my-5 sm:my-6 space-y-2">
            <div className="overflow-hidden border border-neutral-200 bg-neutral-100 aspect-16/9 w-full shadow-xs">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            </div>
            <figcaption className="text-xs sm:text-sm text-neutral-500 text-left font-sans">
              {article.imagePlaceholder ? article.imagePlaceholder.replace(/^\[|\]$/g, '') : `Ảnh tư liệu: ${article.title}`}
            </figcaption>
          </figure>
        )}

        {/* Full Article Content - Adobe Blog reading typography with demo images & long text */}
        <div className="max-w-none space-y-6 font-sans pt-1">
          {articleContent.map((paragraph, index) => {
            // Check for inline demo images: ![caption](url) or [IMAGE: url | caption]
            if (paragraph.startsWith('![') || paragraph.startsWith('[IMAGE:')) {
              let caption = '';
              let src = '';
              if (paragraph.startsWith('![')) {
                const match = paragraph.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) {
                  caption = match[1];
                  src = match[2];
                }
              } else {
                const match = paragraph.match(/\[IMAGE:\s*(.*?)\s*\|\s*(.*?)\]/);
                if (match) {
                  src = match[1];
                  caption = match[2];
                }
              }
              if (src) {
                return (
                  <figure key={index} className="my-8 space-y-2">
                    <div className="overflow-hidden border border-neutral-200 bg-neutral-100 aspect-16/9 w-full shadow-xs">
                      <img
                        src={src}
                        alt={caption || article.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    {caption && (
                      <figcaption className="text-xs sm:text-sm text-neutral-500 text-left font-sans">
                        {caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
            }

            if (paragraph.startsWith('## ')) {
              const headingText = paragraph.replace('## ', '');
              const headingId = `heading-${index}`;
              return (
                <h2 id={headingId} key={index} className="text-xl sm:text-2xl font-bold text-neutral-900 pt-6 pb-2 border-b border-hairline tracking-tight leading-snug scroll-mt-20">
                  {headingText}
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
                <blockquote key={index} className="my-7 pl-5 border-l-4 border-brand-primary italic text-neutral-800 bg-neutral-50/80 py-4 pr-4 text-[16px] sm:text-[17px] leading-relaxed">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
              return (
                <li key={index} className={getListItemClass(fontScale)}>
                  {paragraph.replace(/^[•-]\s*/, '')}
                </li>
              );
            }
            return (
              <p key={index} className={getParagraphClass(fontScale)}>
                {paragraph}
              </p>
            );
          })}

          {/* Inset Quote Callout */}
          <div className="my-8 p-6 bg-red-50/60 border border-red-200 text-sm space-y-2 rounded-none">
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
        <div className="pt-6 sm:pt-8 flex items-center justify-between gap-3">
          {/* Trái: Duy nhất Nút Trở lại Hệ tri thức LGM (Đã bỏ nút Lưu theo yêu cầu) */}
          <button
            type="button"
            onClick={() => navigateTo('knowledge', { category: article.category })}
            className="h-10 px-3 sm:px-4 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-800 text-sm font-medium flex items-center gap-2 shadow-2xs transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-600 shrink-0" />
            <span>Trở lại Hệ tri thức LGM</span>
          </button>

          <button
            type="button"
            onClick={handleDeviceShare}
            className="h-10 px-3 border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-800 text-sm font-medium flex items-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0"
            aria-label="Chia sẻ bài viết"
          >
            <Share2 className="w-4 h-4 text-neutral-600 shrink-0" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </article>

      {/* RELATED NEWS: "Tin cùng chuyên mục" (Full 1280px container, 3 uniform cards, gap 32px) */}
      {relatedArticles.length > 0 && (
        <section className="related-news mt-16 sm:mt-20 pt-5 border-t border-hairline space-y-4">
          <h3 className="text-xl sm:text-2xl font-normal text-ink tracking-tight">
            Tin cùng chuyên mục
          </h3>
          <div className="related-news-grid">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}

      {/* MOBILE STICKY BAR KHI SCROLL: Điều chỉnh cỡ chữ + chia sẻ theo thiết bị */}
      <div 
        className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-4 py-2 transition-all duration-300 transform sm:hidden ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto relative">
          <button
            type="button"
            onClick={() => {
              setFontSizeMenuOpen(false);
              setMobileMenuOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-800 hover:text-brand-primary active:bg-neutral-100 rounded-lg transition-colors cursor-pointer border border-neutral-200/80 bg-neutral-50/80"
            aria-label="Mở menu hệ thống"
          >
            <Menu className="w-4 h-4 text-neutral-800" />
          </button>

          {/* Cụm Tính năng Cỡ chữ & Share dạng thiết bị */}
          <div className="flex items-center gap-2">
            {/* 1. Nút Điều chỉnh kích font chữ */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFontSizeMenuOpen(!fontSizeMenuOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  fontSizeMenuOpen 
                    ? 'bg-neutral-900 text-white border-neutral-900' 
                    : 'bg-neutral-50/80 text-neutral-800 border-neutral-200/80 hover:bg-neutral-100'
                }`}
                aria-label="Điều chỉnh cỡ chữ"
              >
                <span className="font-sans font-bold text-xs tracking-tight">Aa</span>
                <span className="text-xs font-medium">Cỡ chữ</span>
              </button>

              {/* Popover điều chỉnh font chữ nổi ngay phía trên */}
              {fontSizeMenuOpen && (
                <div className="absolute right-0 bottom-full mb-3 bg-white border border-neutral-200 rounded-xl shadow-2xl p-3 z-50 w-64 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-100">
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Cỡ chữ bài viết</span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {fontScale === 'sm' ? 'Nhỏ' : fontScale === 'base' ? 'Chuẩn' : fontScale === 'lg' ? 'Lớn' : 'Rất lớn'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 bg-neutral-100/80 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFontScale('sm')}
                      className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                        fontScale === 'sm' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale('base')}
                      className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                        fontScale === 'base' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale('lg')}
                      className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                        fontScale === 'lg' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      A+
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale('xl')}
                      className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                        fontScale === 'xl' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      A++
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Nút Share: Dạng share theo thiết bị (Web Share API) */}
            <button
              type="button"
              onClick={handleDeviceShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-800 hover:text-brand-primary active:bg-neutral-100 rounded-lg transition-colors cursor-pointer border border-neutral-200/80 bg-neutral-50/80"
              aria-label="Chia sẻ bài viết"
            >
              <Share2 className="w-4 h-4 text-neutral-800" />
              <span className="text-xs font-semibold text-neutral-900">Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
