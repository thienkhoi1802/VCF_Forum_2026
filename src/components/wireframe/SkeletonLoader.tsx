import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'image' | 'event';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'card',
  count = 1
}) => {
  const items = Array.from({ length: count });

  if (variant === 'event') {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="border border-slate-200 p-6 bg-white rounded-xl shadow-sm animate-pulse flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-36 bg-slate-100 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-9 bg-slate-200 rounded-lg w-32 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="border border-slate-200 p-5 bg-white rounded-xl shadow-sm animate-pulse space-y-4">
            <div className="w-full aspect-video bg-slate-100 rounded-lg" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-5 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded w-full" />
      ))}
    </div>
  );
};
