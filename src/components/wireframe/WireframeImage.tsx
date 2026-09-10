import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export interface WireframeImageProps {
  label: string;
  imageUrl?: string;
  alt?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9' | '16:10' | 'auto';
  heightClass?: string;
  className?: string;
  showIcon?: boolean;
  wireframeType?: 'general' | 'avatar' | 'venue' | 'document' | 'course';
  dimensionHint?: string;
}

// Curated high-resolution business & leadership imagery (used only when user switches to Photo Mode)
const KEYWORD_IMAGE_MAP: { keywords: string[]; url: string }[] = [
  {
    keywords: ['nguyễn mạnh hùng', 'bộ trưởng', 'tác giả nguyễn mạnh hùng'],
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['summit', 'đại hội', 'trung tâm hội nghị', 'toàn cảnh'],
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['forum', 'tọa đàm', 'bàn tròn', 'đối thoại'],
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['mentoring', 'cố vấn', '1:1', 'mentor'],
    url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['peer group', 'đồng cấp', 'sinh hoạt kín'],
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['lgm', 'trường phái', 'học viện', 'ptit'],
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['sách', 'xuất bản', 'ấn phẩm', 'chuyên khảo', 'tóm lược'],
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['nhà máy', 'sản xuất', 'thực địa', 'fieldtrip', 'kaizen'],
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['đào tạo', 'khoá học', 'mastery', 'chương trình', 'lớp học', 'giảng viên'],
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['văn hóa', 'nhân sự', 'đội ngũ', 'bản sắc'],
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['chuyển đổi số', 'ai', 'công nghệ', 'bán dẫn', 'dữ liệu', 'kỷ nguyên số'],
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['hđqt', 'hội đồng', 'phân quyền', 'tái cấu trúc', 'quản trị'],
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['vĩ mô', 'kinh tế', 'thị trường', 'chu kỳ', 'tài chính'],
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['talk', 'truyền thông', 'studio', 'podcast', 'phỏng vấn'],
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['chân dung', 'trương gia bình', 'trần đình thiên', 'nguyễn thanh tùng'],
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  }
];

function getAppropriateImage(label: string, customUrl?: string): string {
  if (customUrl && customUrl.trim()) {
    return customUrl;
  }
  const lowerLabel = (label || '').toLowerCase();
  for (const item of KEYWORD_IMAGE_MAP) {
    if (item.keywords.some((kw) => lowerLabel.includes(kw))) {
      return item.url;
    }
  }
  return 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80';
}

function getRatioDimensions(aspectRatio: string): string {
  switch (aspectRatio) {
    case '16:9': return '1200 × 675px';
    case '4:3': return '800 × 600px';
    case '1:1': return '400 × 400px';
    case '21:9': return '1680 × 720px';
    case '16:10': return '1200 × 750px';
    default: return 'Khung thích ứng';
  }
}

export const WireframeImage: React.FC<WireframeImageProps> = ({
  label,
  imageUrl,
  alt,
  aspectRatio = '16:9',
  heightClass,
  className = '',
  showIcon = true,
  wireframeType,
  dimensionHint
}) => {
  const { wireframeImageMode } = useApp();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  let aspectStyle = 'aspect-video';
  if (aspectRatio === '4:3') aspectStyle = 'aspect-[4/3]';
  if (aspectRatio === '1:1') aspectStyle = 'aspect-square';
  if (aspectRatio === '21:9') aspectStyle = 'aspect-[21/9]';
  if (aspectRatio === '16:10') aspectStyle = 'aspect-[16/10]';
  if (aspectRatio === 'auto') aspectStyle = '';

  const lower = (label || '').toLowerCase();
  const isAvatar = aspectRatio === '1:1' || wireframeType === 'avatar' || lower.includes('chân dung') || lower.includes('avatar') || lower.includes('mentor') || lower.includes('tác giả');
  const isDoc = wireframeType === 'document' || lower.includes('sách') || lower.includes('ấn phẩm') || lower.includes('chuyên khảo') || lower.includes('bài viết');
  const isCourse = wireframeType === 'course' || lower.includes('đào tạo') || lower.includes('khoá học') || lower.includes('mastery') || lower.includes('học viện');
  const isVenue = wireframeType === 'venue' || lower.includes('summit') || lower.includes('sảnh') || lower.includes('hội trường') || lower.includes('venue') || lower.includes('toàn cảnh');

  const dimensionText = dimensionHint || getRatioDimensions(aspectRatio);

  // Clean formatted label
  const cleanLabel = (label || 'Ảnh minh họa').trim();

  // Minimalist Wireframe Mode: gray background + crossed diagonal line "X" only (no text, labels, badges, or icons)
  if (wireframeImageMode === 'wireframe') {
    return (
      <div
        className={`relative w-full bg-neutral-100 border border-neutral-300/80 rounded-lg overflow-hidden select-none flex items-center justify-center transition-colors ${aspectStyle} ${heightClass || ''} ${className}`}
        aria-label={alt || label || 'Image placeholder'}
      >
        {/* Wireframe Diagonal Cross Guide Lines ("X") */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none text-neutral-300" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1.2" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // Otherwise, user explicitly toggled 'photo' mode
  const activeSrc = getAppropriateImage(label, imageUrl);

  return (
    <div
      className={`relative w-full bg-neutral-100 border border-neutral-200 rounded-lg overflow-hidden select-none group/img ${aspectStyle} ${heightClass || ''} ${className}`}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
          <span className="text-xs font-mono text-neutral-500">Đang tải ảnh...</span>
        </div>
      )}

      {!hasError ? (
        <img
          src={activeSrc}
          alt={alt || label || 'Hình ảnh tư liệu Diễn Đàn CEO'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Fallback wireframe box if photo fails */
        <div className="w-full h-full relative bg-neutral-100 border border-neutral-300/80">
          <svg className="absolute inset-0 w-full h-full pointer-events-none text-neutral-300" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1.2" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      )}

      {/* Subtle bottom vignette in photo mode */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
