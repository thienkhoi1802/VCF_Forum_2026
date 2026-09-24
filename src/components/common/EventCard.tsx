import React from 'react';
import { EventItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { WireframeImage } from '../wireframe/WireframeImage';
import { CustomButton } from './CustomButton';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  layout?: 'grid' | 'list';
  showFullDetails?: boolean;
  showListBadges?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  layout = 'grid',
  showListBadges = true
}) => {
  const { navigateTo, registeredEvents, simulatedState } = useApp();

  const isRegistered = registeredEvents.some(r => r.eventId === event.id && r.status !== 'cancelled');
  const isFullEffective = event.isFull || simulatedState === 'S-FULL';

  if (layout === 'list') {
    return (
      <div className="vcf-card p-5 flex flex-col md:flex-row gap-6">
        {/* Left Thumbnail 16:9 */}
        <div className="w-full md:w-72 shrink-0">
          <WireframeImage
            label={event.imagePlaceholder}
            imageUrl={event.imageUrl}
            alt={event.title}
            aspectRatio="16:9"
            className="w-full h-full min-h-[140px] rounded-lg"
          />
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase bg-red-50 text-brand-primary px-3 py-1 border border-red-200 rounded-full">
                {event.activityName}
              </span>
              {showListBadges && (
                <>
                  <span className="text-[10px] text-ink-secondary border border-hairline px-3 py-1 rounded-full font-semibold">
                    {event.type}
                  </span>
                  {isFullEffective ? (
                    <span className="text-[10px] font-semibold text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                      Hết chỗ
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      Còn {event.availableSeats}/{event.totalSeats} chỗ
                    </span>
                  )}
                  {isRegistered && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Đã đăng ký
                    </span>
                  )}
                </>
              )}
            </div>

            <h3 className="text-xl font-semibold text-ink leading-tight tracking-tight">
              {event.title}
            </h3>

            <p className="text-sm text-ink-secondary line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-secondary pt-1 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="truncate">{event.datetime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between gap-4">
            <div className="text-xs text-ink-secondary">
              {event.speakers.length > 0 && (
                <span>Diễn giả: <strong className="text-ink">{event.speakers[0].name}</strong></span>
              )}
            </div>
            <CustomButton
              variant={
                isRegistered
                  ? 'success'
                  : isFullEffective
                  ? 'gray'
                  : 'primary'
              }
              size="sm"
              onClick={() => navigateTo('event-detail', { eventId: event.id })}
            >
              {isRegistered ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Xem thông tin tham dự
                </>
              ) : isFullEffective ? (
                'Đăng ký danh sách chờ'
              ) : (
                'Đăng ký sự kiện ngay'
              )}
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card (16:9)
  return (
    <div 
      onClick={() => navigateTo('event-detail', { eventId: event.id })}
      className="vcf-card flex flex-col justify-between group overflow-hidden cursor-pointer"
    >
      <div>
        {/* 16:9 Image Placeholder */}
        <div className="relative overflow-hidden">
          <WireframeImage
            label={event.imagePlaceholder}
            imageUrl={event.imageUrl}
            alt={event.title}
            aspectRatio="16:9"
            className="rounded-none border-0"
          />
          <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase bg-white/95 text-brand-primary px-3 py-1 rounded-full border border-red-200 shadow-xs">
              {event.activityName}
            </span>
            {isFullEffective ? (
              <span className="text-[10px] font-semibold bg-rose-600 text-white px-3 py-1 rounded-full shadow-xs">
                HẾT CHỖ
              </span>
            ) : (
              <span className="text-[10px] font-semibold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
                CÒN CHỖ
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-ink-secondary font-semibold">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              {event.timeStr}, {event.dateStr}
            </span>
            <span className={isFullEffective ? 'text-rose-800 font-semibold bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full' : 'text-emerald-800 font-semibold bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full'}>
              {isFullEffective ? 'Hết chỗ' : `Còn ${event.availableSeats} chỗ`}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-ink leading-tight group-hover:text-brand-primary transition-colors">
            {event.title}
          </h3>

          <div className="flex items-start gap-1.5 text-xs text-ink-secondary">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="p-5 pt-0">
        <CustomButton
          variant={
            isRegistered
              ? 'success'
              : isFullEffective
              ? 'gray'
              : 'primary'
          }
          size="sm"
          fullWidth
          disabled={false}
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('event-detail', { eventId: event.id });
          }}
        >
          {isRegistered ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Xem thông tin tham dự
            </>
          ) : isFullEffective ? (
            'Đăng ký danh sách chờ'
          ) : (
            'Đăng ký sự kiện ngay'
          )}
        </CustomButton>
      </div>
    </div>
  );
};
