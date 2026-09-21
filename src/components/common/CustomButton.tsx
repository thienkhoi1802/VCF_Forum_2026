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
  const baseStyle = 'inline-flex min-h-11 items-center justify-center rounded-none font-medium transition-all duration-150 select-none whitespace-nowrap active:scale-95 cursor-pointer tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info disabled:pointer-events-none';

  // 2x horizontal padding math: (h: 4/8, 6/12, 8/16)
  let sizeStyle = 'px-6 py-2.5 text-[15px] gap-2 font-medium';
  if (size === 'sm') sizeStyle = 'px-4 py-2 text-sm gap-1.5 font-medium';
  if (size === 'lg') sizeStyle = 'px-8 py-3 text-base gap-2.5 font-medium';

  let variantStyle = 'bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-brand-primary-pressed';
  if (variant === 'secondary') {
    variantStyle = 'bg-white text-ink border border-hairline hover:border-ink/45 hover:bg-parchment';
  } else if (variant === 'white') {
    variantStyle = 'bg-white text-brand-primary hover:bg-parchment font-medium';
  } else if (variant === 'ghost') {
    variantStyle = 'bg-transparent text-ink hover:bg-black/5';
  } else if (variant === 'danger') {
    variantStyle = 'bg-danger-soft text-danger border border-danger/20 hover:border-danger/45';
  } else if (variant === 'success') {
    variantStyle = 'bg-success text-white hover:bg-[#0f6937] active:bg-[#0b552c]';
  } else if (variant === 'gray') {
    variantStyle = 'bg-ink-secondary text-white hover:bg-ink active:bg-ink';
  }

  if (disabled) {
    variantStyle = 'bg-parchment text-[#86868b] border border-hairline cursor-not-allowed active:scale-100';
  }

  return (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
