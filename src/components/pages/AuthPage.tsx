import React from 'react';
import { VcfAuthTrustPanel } from '../auth/VcfAuthTrustPanel';
import { VcfAuthCard } from '../auth/VcfAuthCard';

export const AuthPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-[calc(100vh-80px)] flex items-center justify-center py-3 sm:py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-[1180px] mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center justify-between">
          {/* Left Column: Trust / Value Panel (Desktop) */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 pr-4">
            <VcfAuthTrustPanel />
          </div>

          {/* Right Column: Auth Card (460-500px on desktop, full-width with compact padding on mobile) */}
          <div className="w-full lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <VcfAuthCard initialMode="login" />
          </div>
        </div>
      </div>
    </div>
  );
};
