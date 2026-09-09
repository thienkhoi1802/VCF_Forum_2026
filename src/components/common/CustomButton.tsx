import React from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white' | 'success' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  // Adobe Design System: 150ms cubic-bezier(0.42, 0, 0, 1) snappy transitions, pill radius 9999px
  const baseStyle = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 select-none focus:outline-none whitespace-nowrap active:scale-[0.98] cursor-pointer tracking-tight';

  // 2x horizontal padding math: (h: 4/8, 6/12, 8/16)
  let sizeStyle = 'px-6 py-3 text-sm gap-2 font-semibold';
  if (size === 'sm') sizeStyle = 'px-4 py-2 text-xs gap-1.5 font-medium';
  if (size === 'lg') sizeStyle = 'px-8 py-4 text-base gap-2.5 font-bold';

  let variantStyle = 'bg-[#eb1000] text-white hover:bg-[#c90d00] active:bg-[#a80b00]';
  if (variant === 'secondary') {
    variantStyle = 'bg-white text-black border border-black/20 hover:border-black/50 hover:bg-neutral-50';
  } else if (variant === 'white') {
    variantStyle = 'bg-white text-[#eb1000] hover:bg-neutral-100 font-bold';
  } else if (variant === 'ghost') {
    variantStyle = 'bg-transparent text-black hover:bg-black/5 hover:text-black';
  } else if (variant === 'danger') {
    variantStyle = 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100';
  } else if (variant === 'success') {
    variantStyle = 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-2xs';
  } else if (variant === 'gray') {
    variantStyle = 'bg-neutral-600 text-white hover:bg-neutral-700 active:bg-neutral-800 shadow-2xs';
  }

  if (disabled) {
    variantStyle = 'bg-neutral-200 text-neutral-400 border border-neutral-200 cursor-not-allowed shadow-none active:scale-100 hover:bg-neutral-200 hover:text-neutral-400';
  }

  return (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.42, 0, 0, 1)'
      }}
      {...props}
    >
      {children}
    </button>
  );
};

