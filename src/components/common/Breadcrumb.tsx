import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageRoute } from '../../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  route?: PageRoute;
  params?: any;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeText?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = '',
  showHomeText = false
}) => {
  const { navigateTo } = useApp();

  return (
    <nav aria-label="Đường dẫn điều hướng" className={`flex items-center flex-wrap text-xs text-neutral-600 py-3 border-b border-neutral-200 mb-6 font-sans gap-y-1 ${className}`}>
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-1.5 hover:text-[#eb1000] text-neutral-600 transition-colors p-1 -m-1 rounded shrink-0"
        title="Trang chủ"
        aria-label="Trang chủ"
      >
        <Home className="w-4 h-4 shrink-0" />
        {showHomeText && <span className="font-medium">Trang chủ</span>}
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-neutral-400 shrink-0" />
            {isLast && !item.route ? (
              <span className="text-black font-bold truncate max-w-[260px] sm:max-w-none">
                {item.label}
              </span>
            ) : item.route ? (
              <button
                type="button"
                onClick={() => navigateTo(item.route!, item.params)}
                className={`${
                  isLast 
                    ? 'text-black font-bold hover:text-[#eb1000]' 
                    : 'text-neutral-600 hover:text-[#eb1000] font-medium'
                } transition-colors truncate max-w-[260px] sm:max-w-none text-left`}
              >
                {item.label}
              </button>
            ) : (
              <span className="text-neutral-600 font-medium truncate max-w-[260px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
