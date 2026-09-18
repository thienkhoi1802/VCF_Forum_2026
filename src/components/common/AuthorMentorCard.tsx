import React from 'react';
import { Mentor } from '../../types';
import { WireframeImage } from '../wireframe/WireframeImage';
import { CustomButton } from './CustomButton';

interface AuthorMentorCardProps {
  mentor: Mentor;
  onSelect?: () => void;
  showAction?: boolean;
}

export const AuthorMentorCard: React.FC<AuthorMentorCardProps> = ({
  mentor,
  onSelect,
  showAction = true
}) => {
  return (
    <div className="border border-hairline bg-white p-5 flex flex-col justify-between hover:border-brand-primary hover:shadow-xs transition-all duration-150 rounded-lg">
      <div className="space-y-3">
        {/* Portrait 1:1 ratio */}
        <div className="w-full aspect-square max-w-[140px] mx-auto rounded-lg overflow-hidden border border-hairline">
          <WireframeImage
            label={mentor.avatarPlaceholder}
            imageUrl={mentor.avatarUrl}
            alt={mentor.name}
            aspectRatio="1:1"
            className="w-full h-full"
          />
        </div>

        <div className="text-center space-y-1">
          <h4 className="font-semibold text-base text-ink leading-snug">
            {mentor.name}
          </h4>
          <p className="text-xs font-semibold text-brand-primary">
            {mentor.role}
          </p>
          <p className="text-[11px] text-ink-secondary font-medium">
            {mentor.organization}
          </p>
        </div>

        <p className="text-xs text-ink-secondary leading-relaxed text-center line-clamp-3">
          {mentor.bio}
        </p>

        {mentor.specialties && mentor.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center pt-1">
            {mentor.specialties.map((spec, i) => (
              <span
                key={i}
                className="text-[10px] bg-neutral-100 border border-hairline rounded-full px-2.5 py-0.5 text-neutral-700 font-semibold"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {showAction && (
        <div className="pt-4 mt-3 border-t border-neutral-100">
          <CustomButton
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onSelect}
          >
            Đăng ký cố vấn
          </CustomButton>
        </div>
      )}
    </div>
  );
};
