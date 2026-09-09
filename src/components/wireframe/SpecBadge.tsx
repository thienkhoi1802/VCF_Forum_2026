import React from 'react';

interface SpecBadgeProps {
  label: string;
  type?: 'state' | 'source' | 'prd' | 'page';
  className?: string;
}

export const SpecBadge: React.FC<SpecBadgeProps> = ({ label, type = 'prd', className = '' }) => {
  let styleClasses = 'bg-neutral-100 text-neutral-800 border-neutral-200 font-medium';
  
  if (type === 'state') {
    styleClasses = 'bg-black text-white border-black font-mono shadow-xs';
  } else if (type === 'source') {
    styleClasses = 'bg-neutral-50 text-neutral-600 border-neutral-300 font-mono italic';
  } else if (type === 'page') {
    styleClasses = 'bg-[#eb1000] text-white border-[#eb1000] font-bold shadow-xs';
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider border rounded-full select-none ${styleClasses} ${className}`}
    >
      {label}
    </span>
  );
};
