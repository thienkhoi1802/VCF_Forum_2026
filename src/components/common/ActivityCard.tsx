import React from 'react';
import { Activity } from '../../types';
import { useApp } from '../../context/AppContext';
import { WireframeImage } from '../wireframe/WireframeImage';
import { 
  Trophy, 
  Users, 
  Compass, 
  ShieldAlert, 
  BookMarked, 
  FileSpreadsheet, 
  Globe, 
  Tv, 
  Coffee,
  ArrowUpRight 
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  showCover?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, showCover = false }) => {
  const { navigateTo } = useApp();

  const getIcon = () => {
    switch (activity.id) {
      case 'ceo-summit': return <Trophy className="w-5 h-5 text-brand-primary" />;
      case 'ceo-forum': return <Users className="w-5 h-5 text-brand-primary" />;
      case 'ceo-mentoring': return <Compass className="w-5 h-5 text-brand-primary" />;
      case 'ceo-peer-group': return <ShieldAlert className="w-5 h-5 text-brand-primary" />;
      case 'lgm-school': return <BookMarked className="w-5 h-5 text-brand-primary" />;
      case 'knowledge-publication': return <FileSpreadsheet className="w-5 h-5 text-brand-primary" />;
      case 'website-app': return <Globe className="w-5 h-5 text-brand-primary" />;
      case 'ceo-talk': return <Tv className="w-5 h-5 text-brand-primary" />;
      case 'ceo-club': return <Coffee className="w-5 h-5 text-brand-primary" />;
      default: return <Users className="w-5 h-5 text-brand-primary" />;
    }
  };

  return (
    <div
      onClick={() => navigateTo('activity-detail', { activityId: activity.id })}
      className="vcf-card flex flex-col justify-between p-5 cursor-pointer group"
    >
      <div className="space-y-3">
        {showCover && (
          <WireframeImage
            label={activity.coverImagePlaceholder}
            imageUrl={activity.imageUrl}
            alt={activity.title}
            aspectRatio="16:9"
            className="mb-4 rounded-lg"
          />
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="w-11 h-11 bg-brand-soft rounded-md flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        <div>
          <h3 className="font-semibold text-base text-ink leading-snug group-hover:text-brand-primary transition-colors">
            {activity.title}
          </h3>
          <div className="text-xs text-ink-secondary mt-1">
            {activity.frequency}
          </div>
        </div>

        <p className="text-sm text-ink-secondary line-clamp-2 leading-relaxed">
          {activity.shortDesc}
        </p>
      </div>

      <div className="pt-4 mt-5 border-t border-hairline flex items-center justify-between text-sm text-brand-primary font-medium">
        <span>Chi tiết hoạt động</span>
        <span>→</span>
      </div>
    </div>
  );
};
