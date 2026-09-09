import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { SkeletonLoader } from '../wireframe/SkeletonLoader';
import { EventItem } from '../../types';
import { MOCK_EVENTS, MOCK_ACTIVITIES } from '../../data/mockData';
import { 
  Calendar as CalendarIcon, 
  List, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Tag,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';

export const EventsCalendarPage: React.FC = () => {
  const { 
    showSpecAnnotations, 
    simulatedState, 
    navigateTo,
    registeredEvents
  } = useApp();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [timingFilter, setTimingFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // October 2026
  const [isGeneralFilterOpen, setIsGeneralFilterOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsGeneralFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLoading = simulatedState === 'S-LOADING';
  const isEmptySimulated = simulatedState === 'S-EMPTY';

  // Base activity filtering
  const activityFilteredEvents = MOCK_EVENTS.filter(evt => {
    if (selectedActivityFilter !== 'all' && evt.activityId !== selectedActivityFilter) return false;
    return true;
  });

  // Separate upcoming vs past
  const upcomingEvents = activityFilteredEvents.filter(evt => evt.status === 'upcoming');
  const pastEvents = activityFilteredEvents.filter(evt => evt.status === 'past');

  // Final events list prioritized: Upcoming first, then Past
  const filteredEvents = 
    timingFilter === 'upcoming' ? upcomingEvents :
    timingFilter === 'past' ? pastEvents :
    [...upcomingEvents, ...pastEvents]; // Prioritize upcoming first

  const handleGoToEventDetail = (evt: EventItem) => {
    navigateTo('event-detail', { eventId: evt.id });
  };

  // Helper function to extract and format date components for scanning
  const parseDateBlock = (dateStr?: string) => {
    if (!dateStr) return { day: '15', monthText: 'THG 10', fullMonth: 'Tháng 10', year: '2026' };
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parseInt(parts[1], 10);
      const day = parts[2];
      return {
        day,
        monthText: `THG ${month}`,
        fullMonth: `Tháng ${month}`,
        year
      };
    }
    return { day: '15', monthText: 'THG 10', fullMonth: 'Tháng 10', year: '2026' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb items={[{ label: 'Lịch sự kiện VCF' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C5: Lịch / Đăng ký sự kiện [Trang chính]" type="page" />
            <SpecBadge label="PRD 4.3 / Module Sự kiện (Calendar + List View)" type="source" />
          </div>
          <span className="text-neutral-500">
            States: [S-EMPTY], [S-FULL], [S-LOGGED-IN], [S-GUEST]
          </span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-neutral-200 gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 rounded-full inline-block">
            Hoạt Động & Sự Kiện VCF
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Lịch Sự Kiện & Hội Nghị VCF
          </h1>
          <p className="text-sm text-neutral-600 font-sans">
            Toàn bộ lịch trình các kỳ Summit, Diễn đàn chuyên ngành, Talkshow và sinh hoạt câu lạc bộ
          </p>
        </div>

        {/* View Switcher: Calendar vs List */}
        <div className="flex items-center gap-3">
          <div className="flex border border-neutral-200 bg-neutral-100 p-1 rounded-full shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-150 ${
                viewMode === 'list' ? 'bg-white text-[#eb1000] shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-150 ${
                viewMode === 'calendar' ? 'bg-white text-[#eb1000] shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Lịch tháng</span>
            </button>
          </div>
        </div>
      </div>

      {/* THANH LỌC TINH GỌN (COMPACT FILTER TOOLBAR - KHÔNG CHIẾM DIỆN TÍCH) */}
      <div className="relative z-20 bg-white border border-neutral-200 rounded-xl p-2 sm:px-3.5 sm:py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        {/* 1. Chỉ xuất hiện phần lọc theo thời gian: Tất cả, Sắp diễn ra, Đã diễn ra */}
        <div className="flex items-center p-1 bg-neutral-100 border border-neutral-200/70 rounded-lg text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setTimingFilter('all')}
            className={`py-1.5 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              timingFilter === 'all'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Tất cả ({activityFilteredEvents.length})
          </button>
          <button
            onClick={() => setTimingFilter('upcoming')}
            className={`py-1.5 px-3 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              timingFilter === 'upcoming'
                ? 'bg-[#eb1000] text-white shadow-xs font-black'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${timingFilter === 'upcoming' ? 'bg-white' : 'bg-emerald-500'}`} />
            Sắp diễn ra ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setTimingFilter('past')}
            className={`py-1.5 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              timingFilter === 'past'
                ? 'bg-neutral-800 text-white shadow-xs font-black'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Đã diễn ra ({pastEvents.length})
          </button>
        </div>

        {/* 2. Gom lại các nhóm bộ lọc chung vào Dropdown gọn gàng */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Tag hoạt động đang được lọc (nếu có) để xóa nhanh 1 chạm */}
          {selectedActivityFilter !== 'all' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#eb1000] text-xs font-bold border border-red-200 animate-in fade-in">
              <span className="truncate max-w-[130px]">
                {MOCK_ACTIVITIES.find(a => a.id === selectedActivityFilter)?.title || selectedActivityFilter}
              </span>
              <button
                onClick={() => setSelectedActivityFilter('all')}
                className="hover:bg-red-100 rounded-full p-0.5 cursor-pointer text-[#eb1000]"
                title="Bỏ lọc hoạt động này"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Consolidated Filter Dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setIsGeneralFilterOpen(!isGeneralFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                selectedActivityFilter !== 'all'
                  ? 'bg-red-50 text-[#eb1000] border-red-200 shadow-2xs'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {selectedActivityFilter === 'all' ? 'Bộ lọc chung' : 'Đang lọc'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGeneralFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Popover */}
            {isGeneralFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-black">
                    <Tag className="w-3.5 h-3.5 text-[#eb1000]" />
                    <span>Trụ cột hoạt động VCF</span>
                  </div>
                  {selectedActivityFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedActivityFilter('all')}
                      className="text-[11px] font-bold text-[#eb1000] hover:underline cursor-pointer"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedActivityFilter('all');
                      setIsGeneralFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-colors text-left cursor-pointer ${
                      selectedActivityFilter === 'all'
                        ? 'bg-red-50 text-[#eb1000]'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedActivityFilter === 'all' && <Check className="w-3.5 h-3.5 text-[#eb1000]" />}
                      <span className={selectedActivityFilter === 'all' ? 'font-black' : ''}>Tất cả hoạt động</span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {MOCK_EVENTS.length}
                    </span>
                  </button>

                  {['ceo-summit', 'ceo-forum', 'ceo-talk', 'ceo-club'].map((actId) => {
                    const act = MOCK_ACTIVITIES.find(a => a.id === actId);
                    if (!act) return null;
                    const count = MOCK_EVENTS.filter(e => e.activityId === actId).length;
                    const isSelected = selectedActivityFilter === actId;
                    return (
                      <button
                        key={actId}
                        onClick={() => {
                          setSelectedActivityFilter(actId);
                          setIsGeneralFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 text-[#eb1000]'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#eb1000] shrink-0" />}
                          <span className={`truncate ${isSelected ? 'font-black' : ''}`}>{act.title}</span>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 shrink-0 ml-2">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick reset all when filters applied */}
          {(timingFilter !== 'all' || selectedActivityFilter !== 'all') && (
            <button
              onClick={() => {
                setTimingFilter('all');
                setSelectedActivityFilter('all');
              }}
              className="p-1.5 text-neutral-400 hover:text-[#eb1000] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* STATE DISPLAY: LOADING OR EMPTY */}
      {isLoading ? (
        <SkeletonLoader variant="event" count={3} />
      ) : isEmptySimulated || filteredEvents.length === 0 ? (
        <div className="border border-neutral-200 bg-white rounded-lg p-12 text-center space-y-3 shadow-xs">
          <div className="font-black text-base text-black">[S-EMPTY] Không có sự kiện nào phù hợp</div>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Không tìm thấy sự kiện nào trong bộ lọc đã chọn. Vui lòng chọn hoạt động khác hoặc xóa bộ lọc.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedActivityFilter('all');
                setTimingFilter('all');
              }}
            >
              Đặt lại toàn bộ lọc
            </CustomButton>
          </div>
        </div>
      ) : viewMode === 'calendar' ? (
        /* CALENDAR VIEW */
        <div className="border border-neutral-200 bg-white rounded-lg p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="font-black text-lg text-black">
              Tháng {selectedMonth} / 2026 (Quý IV)
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedMonth(prev => prev > 1 ? prev - 1 : 12)}
                className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setSelectedMonth(prev => prev < 12 ? prev + 1 : 1)}
                className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden text-xs">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
              <div key={i} className="bg-neutral-50 p-2.5 text-center font-bold text-neutral-700">
                {day}
              </div>
            ))}

            {/* Days Mock Grid */}
            {Array.from({ length: 31 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateKey = `2026-${selectedMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              const eventsOnDay = MOCK_EVENTS.filter(e => e.dateStr === dateKey);

              return (
                <div
                  key={idx}
                  className={`bg-white min-h-[95px] p-2 flex flex-col justify-between transition-colors ${
                    eventsOnDay.length > 0 ? 'bg-red-50/40 border border-red-200 font-semibold' : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className="font-mono text-neutral-400 text-xs">{dayNum}</span>
                  {eventsOnDay.map(ev => (
                    <button
                      key={ev.id}
                      onClick={() => handleGoToEventDetail(ev)}
                      className={`text-[10px] text-left p-1 rounded-sm truncate mt-1 block shadow-2xs cursor-pointer ${
                        ev.status === 'past'
                          ? 'bg-neutral-600 text-white hover:bg-neutral-700'
                          : 'bg-[#eb1000] text-white hover:bg-[#c80e00]'
                      }`}
                      title={ev.title}
                    >
                      • {ev.activityName} ({ev.timeStr.split(' ')[0]})
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-8">
          {/* If Timing Filter is 'all', show Section Header for Upcoming Events */}
          {timingFilter === 'all' && upcomingEvents.length > 0 && (
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#eb1000]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eb1000] animate-pulse" />
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Sự Kiện Sắp Diễn Ra ({upcomingEvents.length})
                </h2>
                <span className="text-xs bg-red-50 text-[#eb1000] font-bold px-2 py-0.5 rounded border border-red-200">
                  Ưu tiên hiển thị
                </span>
              </div>
              <span className="text-xs text-neutral-500 hidden sm:inline font-medium">
                Đang mở cổng tiếp nhận đăng ký đại biểu
              </span>
            </div>
          )}

          {/* List of Events */}
          <div className="space-y-6">
            {filteredEvents.map((evt, index) => {
              const isFullEffective = evt.isFull || simulatedState === 'S-FULL';
              const regItem = registeredEvents.find(r => r.eventId === evt.id && r.status !== 'cancelled');
              const isPast = evt.status === 'past';

              // Check if we need to insert the "Past Events" separator header when timingFilter === 'all'
              const showPastHeader = timingFilter === 'all' && isPast && (index === 0 || filteredEvents[index - 1]?.status === 'upcoming');

              return (
                <React.Fragment key={evt.id}>
                  {showPastHeader && (
                    <div className="pt-6">
                      <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-300">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                          <h2 className="text-lg font-black text-neutral-800 uppercase tracking-tight">
                            Sự Kiện Đã Diễn Ra ({pastEvents.length})
                          </h2>
                          <span className="text-xs bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded border border-neutral-300">
                            Kho lưu trữ & Kỷ yếu
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500 hidden sm:inline font-medium">
                          Xem báo cáo đúc kết & tài liệu hội nghị
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    onClick={() => handleGoToEventDetail(evt)}
                    className={`border bg-white p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-5 lg:gap-6 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md ${
                      isPast
                        ? 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/40 opacity-95'
                        : 'border-neutral-200 hover:border-[#eb1000]'
                    }`}
                  >
                    {/* 1. Mobile Timeline Header (Only on small screens) */}
                    <div className="flex md:hidden items-center justify-between pb-3 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isPast ? 'bg-neutral-400' : 'bg-[#eb1000]'}`} />
                        <span className={`text-xs font-black uppercase tracking-wider ${isPast ? 'text-neutral-600' : 'text-[#eb1000]'}`}>
                          {parseDateBlock(evt.dateStr).monthText} {parseDateBlock(evt.dateStr).day}
                        </span>
                        <span className="text-xs font-semibold text-neutral-400">
                          {parseDateBlock(evt.dateStr).year}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{evt.timeStr?.split(' - ')[0] || '08:30'}</span>
                      </div>
                    </div>

                    {/* 2. Desktop Dedicated Timeline Date Column (Never overlaps anything) */}
                    <div className="hidden md:flex flex-col items-center justify-center w-24 lg:w-28 shrink-0 text-center py-2 pr-5 border-r border-neutral-100 select-none">
                      <span className={`text-[11px] font-black uppercase tracking-wider block ${isPast ? 'text-neutral-500' : 'text-[#eb1000]'}`}>
                        {parseDateBlock(evt.dateStr).monthText}
                      </span>
                      <span className="text-3xl lg:text-4xl font-black text-neutral-900 block leading-none my-1 tracking-tight">
                        {parseDateBlock(evt.dateStr).day}
                      </span>
                      <span className="text-xs font-bold text-neutral-400 block">
                        {parseDateBlock(evt.dateStr).year}
                      </span>
                      <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200">
                        <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{evt.timeStr?.split(' - ')[0] || '08:30'}</span>
                      </div>
                    </div>

                    {/* 3. Thumbnail Container (Clean 16:9 - no overlapping badges) */}
                    <div className="w-full md:w-64 lg:w-72 shrink-0 rounded-xl overflow-hidden bg-neutral-100 self-start">
                      <WireframeImage
                        label={evt.imagePlaceholder}
                        aspectRatio="16:9"
                        className="w-full h-full min-h-[150px] md:min-h-[175px] object-cover rounded-xl border border-neutral-200 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details - Structured for maximum scanning speed */}
                    <div className="flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-3">
                        {/* 1. Status & Pillar Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            isPast
                              ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                              : 'bg-red-50 text-[#eb1000] border-red-200'
                          }`}>
                            {evt.activityName}
                          </span>

                          {/* Past vs Upcoming badge */}
                          {isPast ? (
                            <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-full">
                              ĐÃ DIỄN RA
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              SẮP DIỄN RA
                            </span>
                          )}

                          {!isPast && (
                            <>
                              {isFullEffective ? (
                                <span className="text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                                  Hết chỗ
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                                  Còn {evt.availableSeats}/{evt.totalSeats} chỗ
                                </span>
                              )}
                            </>
                          )}

                          {regItem?.status === 'pending_approval' && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              Đang chờ duyệt
                            </span>
                          )}
                          {regItem?.status === 'waitlisted' && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              Danh sách chờ
                            </span>
                          )}
                        </div>

                        {/* 2. Title */}
                        <h3 className={`text-lg sm:text-xl font-black leading-snug transition-colors ${
                          isPast 
                            ? 'text-neutral-800 group-hover:text-black' 
                            : 'text-black group-hover:text-[#eb1000]'
                        }`}>
                          {evt.title}
                        </h3>

                        {/* 3. Chỉ hiện Địa điểm (Đã bỏ phần thời gian nhỏ bên trong) */}
                        <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                          <div className="w-6 h-6 rounded-md bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className={`w-3.5 h-3.5 ${isPast ? 'text-neutral-500' : 'text-[#eb1000]'}`} />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold uppercase text-neutral-400 block leading-tight">Địa điểm</span>
                            <span className="font-bold text-neutral-900 leading-snug block" title={evt.location}>
                              {evt.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 4. Footer Row: Diễn giả chính & CTA */}
                      <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-neutral-600 flex items-center gap-1.5">
                          {evt.speakers.length > 0 && (
                            <>
                              <span className="text-neutral-400">Diễn giả chính:</span>
                              <strong className="text-black font-bold">{evt.speakers[0].name}</strong>
                              {evt.speakers.length > 1 && (
                                <span className="text-neutral-400">(+{evt.speakers.length - 1} khách mời)</span>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <CustomButton
                            variant={
                              isPast
                                ? 'secondary'
                                : regItem?.status === 'confirmed'
                                ? 'success'
                                : (isFullEffective || regItem?.status === 'waitlisted')
                                ? 'gray'
                                : 'primary'
                            }
                            size="sm"
                            className="font-bold text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoToEventDetail(evt);
                            }}
                          >
                            {isPast ? (
                              'Xem kỷ yếu & Chi tiết'
                            ) : regItem?.status === 'confirmed' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Đã xác nhận tham dự
                              </>
                            ) : regItem?.status === 'pending_approval' ? (
                              'Đang chờ duyệt'
                            ) : regItem?.status === 'waitlisted' ? (
                              'Xem hàng chờ'
                            ) : isFullEffective ? (
                              'Đăng ký danh sách chờ'
                            ) : (
                              'Đăng ký sự kiện ngay'
                            )}
                          </CustomButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
