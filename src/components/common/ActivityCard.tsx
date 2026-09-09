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
      case 'ceo-summit': return <Trophy className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-forum': return <Users className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-mentoring': return <Compass className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-peer-group': return <ShieldAlert className="w-5 h-5 text-[#eb1000]" />;
      case 'lgm-school': return <BookMarked className="w-5 h-5 text-[#eb1000]" />;
      case 'knowledge-publication': return <FileSpreadsheet className="w-5 h-5 text-[#eb1000]" />;
      case 'website-app': return <Globe className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-talk': return <Tv className="w-5 h-5 text-[#eb1000]" />;
      case 'ceo-club': return <Coffee className="w-5 h-5 text-[#eb1000]" />;
      default: return <Users className="w-5 h-5 text-[#eb1000]" />;
    }
  };

  return (
    <div
      onClick={() => navigateTo('activity-detail', { activityId: activity.id })}
      className="border border-neutral-200 bg-white p-5 rounded-lg flex flex-col justify-between hover:border-[#eb1000] hover:shadow-xs cursor-pointer transition-all duration-150 group"
    >
      <div className="space-y-3">
        {showCover && (
          <WireframeImage
            label={activity.coverImagePlaceholder}
            imageUrl={activity.imageUrl}
            alt={activity.title}
            aspectRatio="16:9"
            className="mb-3 rounded-md border border-neutral-200"
          />
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-md flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#eb1000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        <div>
          <h3 className="font-black text-sm text-black leading-snug group-hover:text-[#eb1000] transition-colors">
            {activity.title}
          </h3>
          <div className="text-[11px] text-neutral-500 font-semibold mt-0.5">
            {activity.frequency}
          </div>
        </div>

        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {activity.shortDesc}
        </p>
      </div>

      <div className="pt-3 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-[#eb1000] font-bold">
        <span>Chi tiết hoạt động</span>
        <span>→</span>
      </div>
    </div>
  );
};
