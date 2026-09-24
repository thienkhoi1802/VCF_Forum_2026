import React from 'react';
import { VcfAuthTrustPanel } from '../auth/VcfAuthTrustPanel';
import { VcfAuthCard } from '../auth/VcfAuthCard';

export const MemberRegistrationPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 sm:py-12 md:py-16">
      <div className="vcf-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Trust / Value Panel (Căn trái chuẩn lề 1280px) */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6">
            <VcfAuthTrustPanel />
          </div>

          {/* Right Column: Auth Card in Registration mode (Căn phải chuẩn lề 1280px) */}
          <div className="w-full lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <VcfAuthCard initialMode="register" />
          </div>
        </div>
      </div>
    </div>
  );
};
