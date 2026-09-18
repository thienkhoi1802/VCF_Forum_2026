import React from 'react';

interface SpecBadgeProps {
  label: string;
  type?: 'state' | 'source' | 'prd' | 'page';
  className?: string;
}

export const SpecBadge: React.FC<SpecBadgeProps> = ({ label, type = 'prd', className = '' }) => {
  let styleClasses = 'bg-neutral-100 text-neutral-800 border-hairline font-medium';
  
  if (type === 'state') {
    styleClasses = 'bg-ink text-white border-black font-mono shadow-xs';
  } else if (type === 'source') {
    styleClasses = 'bg-parchment text-ink-secondary border-neutral-300 font-mono italic';
  } else if (type === 'page') {
    styleClasses = 'bg-brand-primary text-white border-brand-primary font-semibold shadow-xs';
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider border rounded-full select-none ${styleClasses} ${className}`}
    >
      {label}
    </span>
  );
};
