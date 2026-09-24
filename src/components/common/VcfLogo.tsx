import React from 'react';

interface VcfLogoProps {
  className?: string;
  height?: number | string;
}

/** Shared Vietnam CEO Forum logo used throughout the app. */
export const VcfLogo: React.FC<VcfLogoProps> = ({
  className = '',
  height = 42,
}) => (
  <img
    src="/vcf-logo.svg"
    alt="Vietnam CEO Forum"
    className={`shrink-0 ${className}`}
    style={{ height, width: 'auto' }}
  />
);
