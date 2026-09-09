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
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  layout = 'grid'
}) => {
  const { navigateTo, registeredEvents, simulatedState } = useApp();

  const isRegistered = registeredEvents.some(r => r.eventId === event.id && r.status !== 'cancelled');
  const isFullEffective = event.isFull || simulatedState === 'S-FULL';

  if (layout === 'list') {
    return (
      <div className="border border-neutral-200 bg-white p-5 rounded-lg flex flex-col md:flex-row gap-6 hover:border-[#eb1000] hover:shadow-xs transition-all duration-150">
        {/* Left Thumbnail 16:9 */}
        <div className="w-full md:w-72 shrink-0">
          <WireframeImage
            label={event.imagePlaceholder}
            imageUrl={event.imageUrl}
            alt={event.title}
            aspectRatio="16:9"
            className="w-full h-full min-h-[140px] rounded-md border border-neutral-200"
          />
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase bg-red-50 text-[#eb1000] px-3 py-1 border border-red-200 rounded-full">
                {event.activityName}
              </span>
              <span className="text-[10px] text-neutral-600 border border-neutral-200 px-3 py-1 rounded-full font-semibold">
                {event.type}
              </span>
              {isFullEffective ? (
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  Hết chỗ
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  Còn {event.availableSeats}/{event.totalSeats} chỗ
                </span>
              )}
              {isRegistered && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Đã đăng ký
                </span>
              )}
            </div>

            <h3 className="text-base md:text-lg font-black text-black leading-snug tracking-tight">
              {event.title}
            </h3>

            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 pt-1 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#eb1000] shrink-0" />
                <span className="truncate">{event.datetime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#eb1000] shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between gap-4">
            <div className="text-[11px] text-neutral-500">
              {event.speakers.length > 0 && (
                <span>Diễn giả: <strong className="text-black">{event.speakers[0].name}</strong></span>
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
                  Đã xác nhận tham dự
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
      className="border border-neutral-200 bg-white flex flex-col justify-between hover:border-[#eb1000] hover:shadow-xs transition-all duration-150 rounded-lg group overflow-hidden cursor-pointer"
    >
      <div>
        {/* 16:9 Image Placeholder */}
        <div className="relative p-3 pb-0">
          <WireframeImage
            label={event.imagePlaceholder}
            imageUrl={event.imageUrl}
            alt={event.title}
            aspectRatio="16:9"
            className="rounded-md border border-neutral-200"
          />
          <div className="absolute top-5 left-5 flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase bg-white/95 text-[#eb1000] px-3 py-1 rounded-full border border-red-200 shadow-xs">
              {event.activityName}
            </span>
            {isFullEffective ? (
              <span className="text-[10px] font-bold bg-rose-600 text-white px-3 py-1 rounded-full shadow-xs">
                HẾT CHỖ
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
                CÒN CHỖ
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-neutral-600 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#eb1000]" />
              {event.timeStr}, {event.dateStr}
            </span>
            <span className={isFullEffective ? 'text-rose-800 font-bold bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full' : 'text-emerald-800 font-bold bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full'}>
              {isFullEffective ? 'Hết chỗ' : `Còn ${event.availableSeats} chỗ`}
            </span>
          </div>

          <h3 className="text-sm font-black text-black leading-snug group-hover:text-[#eb1000] transition-colors">
            {event.title}
          </h3>

          <div className="flex items-start gap-1.5 text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="p-4 pt-0">
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
              Đã xác nhận tham dự
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
