import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { SkeletonLoader } from '../wireframe/SkeletonLoader';
import { EventItem } from '../../types';
import { MOCK_EVENTS } from '../../data/mockData';
import {
  Calendar as CalendarIcon,
  List,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  User
} from 'lucide-react';

export const EventsCalendarPage: React.FC = () => {
  const {
    showSpecAnnotations,
    simulatedState,
    navigateTo,
    registeredEvents,
    eventTimingFilter: timingFilter,
    setEventTimingFilter: setTimingFilter
  } = useApp();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // October
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  // Default to null: When opening calendar tab, no date is active until user clicks a date
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const TODAY_STR = '2026-10-15';

  const isLoading = simulatedState === 'S-LOADING';
  const isEmptySimulated = simulatedState === 'S-EMPTY';

  // Separate upcoming, ongoing, past
  const ongoingEvents = useMemo(() => MOCK_EVENTS.filter(evt => evt.status === 'ongoing'), []);
  const upcomingEvents = useMemo(() => MOCK_EVENTS.filter(evt => evt.status === 'upcoming'), []);
  const pastEvents = useMemo(() => MOCK_EVENTS.filter(evt => evt.status === 'past'), []);

  // Filtered events based on timing filter
  const filteredEvents = useMemo(() => {
    if (timingFilter === 'upcoming') {
      return MOCK_EVENTS.filter(evt => evt.status === 'upcoming');
    }
    if (timingFilter === 'ongoing') {
      return MOCK_EVENTS.filter(evt => evt.status === 'ongoing');
    }
    if (timingFilter === 'past') {
      return MOCK_EVENTS.filter(evt => evt.status === 'past');
    }
    return [
      ...MOCK_EVENTS.filter(e => e.status === 'ongoing'),
      ...MOCK_EVENTS.filter(e => e.status === 'upcoming'),
      ...MOCK_EVENTS.filter(e => e.status === 'past')
    ];
  }, [timingFilter]);

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

  const formatWeekdayAndDate = (dateStr?: string) => {
    if (!dateStr) return 'Thứ Năm, 15/10/2026';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month - 1, day);
      const dayOfWeek = d.getDay();
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const weekday = weekdays[dayOfWeek] || 'Thứ Năm';
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      return `${weekday}, ${formattedDay}/${formattedMonth}/${year}`;
    }
    return dateStr;
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    setSelectedDateStr(null);
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDateStr(null);
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // Calculate calendar days for selectedMonth and selectedYear (including prev/next month filler days)
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    const firstDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    // VN calendar: T2 (Mon)=0, T3=1, T4=2, T5=3, T6=4, T7=5, CN (Sun)=6
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Previous month total days
    const prevMonthDaysCount = new Date(selectedYear, selectedMonth - 1, 0).getDate();

    const cells: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      events: EventItem[];
    }[] = [];

    // Previous month filler days (matching screenshot grayed-out dates e.g. 28, 29, 30)
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    for (let i = offset - 1; i >= 0; i--) {
      const d = prevMonthDaysCount - i;
      const dStr = d < 10 ? `0${d}` : `${d}`;
      const mStr = prevMonth < 10 ? `0${prevMonth}` : `${prevMonth}`;
      const dateStr = `${prevYear}-${mStr}-${dStr}`;
      const events = filteredEvents.filter(e => e.dateStr === dateStr);
      cells.push({ day: d, dateStr, isCurrentMonth: false, events });
    }

    // Current month days
    const currMonthStr = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `${selectedYear}-${currMonthStr}-${dayStr}`;
      const events = filteredEvents.filter(e => e.dateStr === dateStr);
      cells.push({ day, dateStr, isCurrentMonth: true, events });
    }

    // Next month filler days to complete grid (up to 35 cells)
    const totalCellsNeeded = cells.length > 35 ? 42 : 35;
    const nextDaysNeeded = totalCellsNeeded - cells.length;
    const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    for (let day = 1; day <= nextDaysNeeded; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const mStr = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
      const dateStr = `${nextYear}-${mStr}-${dayStr}`;
      const events = filteredEvents.filter(e => e.dateStr === dateStr);
      cells.push({ day, dateStr, isCurrentMonth: false, events });
    }

    return cells;
  }, [selectedYear, selectedMonth, filteredEvents]);

  // All events in the selected month & year matching current timingFilter
  const monthEvents = useMemo(() => {
    const monthStr = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
    const prefix = `${selectedYear}-${monthStr}`;
    return filteredEvents.filter(e => e.dateStr.startsWith(prefix));
  }, [selectedYear, selectedMonth, filteredEvents]);

  // Selected day events (only when user explicitly clicked a day)
  const selectedDayEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return filteredEvents.filter(e => e.dateStr === selectedDateStr);
  }, [selectedDateStr, filteredEvents]);

  // Helper function to get indicator dot color based on 3 statuses:
  // - ongoing (Đang diễn ra): amber-500
  // - upcoming (Sắp diễn ra): emerald-500
  // - past (Đã diễn ra): neutral-400
  const getDayDotClass = (events: EventItem[]) => {
    if (events.length === 0) return null;
    if (events.some(e => e.status === 'ongoing')) return 'bg-amber-500';
    if (events.some(e => e.status === 'upcoming')) return 'bg-emerald-500';
    if (events.some(e => e.status === 'past')) return 'bg-neutral-400';
    return null;
  };

  return (
    <div className="vcf-container py-4 sm:py-6 pb-20 sm:pb-24 space-y-4 sm:space-y-5 md:space-y-6 font-sans">
      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-hairline p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C5: Lịch / Đăng ký sự kiện [Trang chính]" type="page" />
            <SpecBadge label="PRD 4.3 / Module Sự kiện (Calendar + List View)" type="source" />
          </div>
          <span className="text-ink-secondary">
            States: [S-EMPTY], [S-FULL], [S-LOGGED-IN], [S-GUEST]
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-1.5 sm:space-y-2">
        <span className="text-xs font-semibold uppercase bg-red-50 text-brand-primary border border-red-200 px-3 py-1 rounded-full inline-block">
          Hoạt Động & Sự Kiện VCF
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
          Lịch Sự Kiện & Hội Nghị VCF
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary font-sans max-w-2xl">
          Toàn bộ lịch trình các kỳ Summit, Diễn đàn chuyên ngành, Talkshow và sinh hoạt câu lạc bộ
        </p>
      </div>

      {/* KHU VỰC ĐIỀU HƯỚNG & BỘ LỌC: RỘNG HẾT GRID TRÊN MOBILE, NGANG HÀNG TRÊN DESKTOP */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3 pb-2 border-b border-neutral-100">
        {/* 1. TABS: Danh sách & Lịch tháng - Rộng sang bằng grid tối đa trên mobile (grid-cols-2 w-full) */}
        <div className="grid grid-cols-2 w-full md:w-auto md:flex md:items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer select-none w-full md:w-auto ${
              viewMode === 'list'
                ? 'border-brand-primary text-brand-primary bg-white shadow-2xs font-bold'
                : 'border-neutral-200 text-neutral-600 bg-white hover:border-neutral-300 hover:text-neutral-900'
            }`}
          >
            <List className="w-4 h-4 shrink-0" />
            <span>Danh sách</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer select-none w-full md:w-auto ${
              viewMode === 'calendar'
                ? 'border-brand-primary text-brand-primary bg-white shadow-2xs font-bold'
                : 'border-neutral-200 text-neutral-600 bg-white hover:border-neutral-300 hover:text-neutral-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span>Lịch tháng</span>
          </button>
        </div>

        {/* 2. BỘ LỌC TRẠNG THÁI: Tất cả / Sắp diễn ra / Đang diễn ra / Đã kết thúc */}
        <div className="grid grid-cols-2 xs:grid-cols-4 w-full md:w-auto md:flex md:items-center gap-1.5 sm:gap-2 py-0.5">
          <button
            type="button"
            onClick={() => setTimingFilter('all')}
            className={`min-h-[36px] flex items-center justify-center px-1 sm:px-3 text-center text-[11px] xs:text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer w-full md:w-auto truncate ${
              timingFilter === 'all'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Tất cả ({MOCK_EVENTS.length})
          </button>

          <button
            type="button"
            onClick={() => setTimingFilter('upcoming')}
            className={`min-h-[36px] flex items-center justify-center px-1 sm:px-3 text-center text-[11px] xs:text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer w-full md:w-auto truncate ${
              timingFilter === 'upcoming'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Sắp diễn ra ({upcomingEvents.length})
          </button>

          <button
            type="button"
            onClick={() => setTimingFilter('ongoing')}
            className={`min-h-[36px] flex items-center justify-center px-1 sm:px-3 text-center text-[11px] xs:text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer w-full md:w-auto truncate ${
              timingFilter === 'ongoing'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Đang diễn ra ({ongoingEvents.length})
          </button>

          <button
            type="button"
            onClick={() => setTimingFilter('past')}
            className={`min-h-[36px] flex items-center justify-center px-1 sm:px-3 text-center text-[11px] xs:text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer w-full md:w-auto truncate ${
              timingFilter === 'past'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Đã kết thúc ({pastEvents.length})
          </button>
        </div>
      </div>

      {/* STATE DISPLAY: LOADING OR EMPTY */}
      {isLoading ? (
        <SkeletonLoader variant="event" count={3} />
      ) : isEmptySimulated || filteredEvents.length === 0 ? (
        <div className="border border-hairline bg-white rounded-lg p-10 text-center space-y-3 shadow-xs">
          <div className="font-semibold text-base text-ink">[S-EMPTY] Không có sự kiện nào phù hợp</div>
          <p className="text-xs text-ink-secondary max-w-md mx-auto">
            Không tìm thấy sự kiện nào trong bộ lọc đã chọn.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setTimingFilter('all');
              }}
            >
              Xem tất cả sự kiện
            </CustomButton>
          </div>
        </div>
      ) : viewMode === 'calendar' ? (
        /* CALENDAR VIEW - 2-COLUMN LAYOUT ON DESKTOP (~38% LEFT, ~62% RIGHT) & STACKED ON MOBILE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI: LỊCH THÁNG (~38% to 42%) - STICKY KHI SCROLL */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-20 self-start bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            {/* Month Navigation: < Tháng M, YYYY > */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Tháng trước"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <h3 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                Tháng {selectedMonth}, {selectedYear}
              </h3>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Tháng sau"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of Week Header: T2, T3, T4, T5, T6, T7, CN */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-neutral-600 py-1">
              <div>T2</div>
              <div>T3</div>
              <div>T4</div>
              <div>T5</div>
              <div>T6</div>
              <div>T7</div>
              <div>CN</div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 sm:gap-y-2.5 gap-x-1 text-center">
              {calendarDays.map((cell) => {
                const isSelected = selectedDateStr === cell.dateStr;
                const isToday = cell.dateStr === TODAY_STR;
                const dotClass = getDayDotClass(cell.events);

                if (!cell.isCurrentMonth) {
                  return (
                    <button
                      key={cell.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDateStr(cell.dateStr);
                        // Navigate to that month if clicked
                        const parts = cell.dateStr.split('-');
                        if (parts.length === 3) {
                          setSelectedYear(parseInt(parts[0], 10));
                          setSelectedMonth(parseInt(parts[1], 10));
                        }
                      }}
                      className="h-10 w-full flex flex-col items-center justify-center p-0 text-neutral-300 font-medium text-xs sm:text-sm cursor-pointer hover:text-neutral-500 transition-colors"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        {cell.day}
                      </span>
                      <span className="h-1.5 flex items-center justify-center mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 opacity-0" />
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => {
                      // Clicking selected day again toggles back to unselected
                      if (selectedDateStr === cell.dateStr) {
                        setSelectedDateStr(null);
                      } else {
                        setSelectedDateStr(cell.dateStr);
                      }
                    }}
                    className="h-10 w-full flex flex-col items-center justify-center p-0 cursor-pointer select-none group relative"
                    title={isToday ? `${cell.day} (Hôm nay)` : `${cell.day}`}
                  >
                    <span
                      className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm rounded-full transition-all ${
                        isSelected
                          ? 'bg-brand-primary text-white font-bold shadow-xs'
                          : isToday
                          ? 'bg-neutral-200 text-neutral-900 font-bold border border-neutral-300'
                          : 'text-neutral-800 font-medium group-hover:bg-neutral-100'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {/* Indicator Dot: 3 statuses demo (ongoing: amber, upcoming: emerald, past: neutral) */}
                    <span className="h-1.5 flex items-center justify-center mt-0.5">
                      {dotClass ? (
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CHÚ THÍCH (LEGEND): Sắp diễn ra, Đang diễn ra, Đã diễn ra */}
            <div className="flex items-center justify-start flex-wrap gap-x-3.5 sm:gap-x-4 gap-y-2 pt-3.5 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Sắp diễn ra</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Đang diễn ra</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
                <span>Đã diễn ra</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ SỰ KIỆN THEO NGÀY ĐƯỢC CHỌN HOẶC TOÀN BỘ THÁNG (~58% to 62%) */}
          <div className="w-full lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[440px]">
            <div>
              {/* Header: Tiêu đề chính to rõ ràng, hiển thị ngày đã chọn hoặc Toàn bộ tháng */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5 gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                      {selectedDateStr ? formatWeekdayAndDate(selectedDateStr) : `Sự kiện Tháng ${selectedMonth}, ${selectedYear}`}
                    </h3>
                    {selectedDateStr && (
                      <button
                        type="button"
                        onClick={() => setSelectedDateStr(null)}
                        className="text-xs font-semibold text-brand-primary hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full border border-red-200 transition-colors cursor-pointer"
                      >
                        ✕ Xem cả tháng
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    {selectedDateStr
                      ? `Danh sách sự kiện diễn ra trong ngày`
                      : 'Tất cả sự kiện trong tháng • Bấm một ngày trên lịch để lọc'}
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full shrink-0">
                  {selectedDateStr
                    ? `${selectedDayEvents.length} sự kiện`
                    : `${monthEvents.length} sự kiện`}
                </span>
              </div>

              {/* Danh sách sự kiện: Ngày được chọn HOẶC Toàn bộ tháng */}
              {selectedDateStr ? (
                /* Khi ĐÃ chọn một ngày cụ thể */
                selectedDayEvents.length === 0 ? (
                  <div className="py-12 sm:py-16 px-4 text-center my-auto flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-neutral-800 mb-1">
                      Không có sự kiện trong ngày này.
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-4">
                      Hãy chọn ngày khác trên lịch để xem danh sách sự kiện.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedDateStr(null)}
                      className="text-xs sm:text-sm font-semibold text-brand-primary hover:underline cursor-pointer"
                    >
                      Xem tất cả sự kiện trong tháng ({monthEvents.length}) →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {selectedDayEvents.map(evt => {
                      const isSummit = evt.activityId === 'ceo-summit';
                      const isTalkshow = evt.activityId === 'ceo-talk' || evt.activityName?.toLowerCase().includes('talk');
                      const times = evt.timeStr.split(/[-–]/).map(t => t.trim());
                      const timeDisplay = times.length >= 2 ? `${times[0]} – ${times[1]}` : evt.timeStr;
                      const isUpcoming = evt.status === 'upcoming';
                      const isOngoing = evt.status === 'ongoing';
                      const dateFormatted = evt.dateStr.slice(8, 10) + '/' + evt.dateStr.slice(5, 7);

                      return (
                        <div
                          key={evt.id}
                          onClick={() => handleGoToEventDetail(evt)}
                          className="group cursor-pointer hover:bg-neutral-50/90 p-3 sm:p-4 -mx-2 sm:-mx-3 rounded-xl transition-all flex items-center justify-between gap-3.5 sm:gap-5 border-b border-neutral-100 last:border-b-0 pb-4 last:pb-0"
                        >
                          {/* 1. Thumbnail chỉ hiển thị ở Desktop */}
                          <div className="hidden md:block w-36 lg:w-44 h-24 lg:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200/80 relative">
                            <WireframeImage
                              label={evt.imagePlaceholder}
                              imageUrl={evt.imageUrl}
                              aspectRatio="16:9"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* 2. Thông tin sự kiện */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Badge hoạt động + Trạng thái */}
                            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                              <span
                                className={`font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded tracking-wide uppercase ${
                                  isSummit
                                    ? 'bg-red-50 text-brand-primary'
                                    : isTalkshow
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-neutral-100 text-neutral-700'
                                }`}
                              >
                                {evt.activityName || 'SỰ KIỆN'}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                  isOngoing
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200/70'
                                    : isUpcoming
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200/70'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isOngoing ? 'bg-amber-500' : isUpcoming ? 'bg-emerald-500' : 'bg-neutral-400'
                                  }`}
                                />
                                <span>{isOngoing ? 'Đang diễn ra' : isUpcoming ? 'Sắp diễn ra' : 'Đã diễn ra'}</span>
                              </span>
                            </div>

                            {/* Tiêu đề chính to rõ ràng, hiển thị đầy đủ KHÔNG bị cắt ngắn '....' */}
                            <h4 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug">
                              {evt.title}
                            </h4>

                            {/* Thời gian sự kiện: Đặt dưới tiêu đề chính */}
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-900">
                              <Clock className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                              <span>{dateFormatted} • {timeDisplay}</span>
                            </div>
                          </div>

                          {/* 3. Chevron mũi tên */}
                          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all shrink-0 ml-1 sm:ml-2 self-center" />
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Khi CHƯA chọn ngày: Hiển thị tất cả sự kiện trong tháng */
                monthEvents.length === 0 ? (
                  <div className="py-12 sm:py-16 px-4 text-center my-auto flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-neutral-800 mb-1">
                      Không có sự kiện nào trong Tháng {selectedMonth}/{selectedYear}.
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-500 max-w-sm">
                      Thử đổi bộ lọc trạng thái hoặc chuyển sang tháng khác.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {monthEvents.map(evt => {
                      const isSummit = evt.activityId === 'ceo-summit';
                      const isTalkshow = evt.activityId === 'ceo-talk' || evt.activityName?.toLowerCase().includes('talk');
                      const times = evt.timeStr.split(/[-–]/).map(t => t.trim());
                      const timeDisplay = times.length >= 2 ? `${times[0]} – ${times[1]}` : evt.timeStr;
                      const isUpcoming = evt.status === 'upcoming';
                      const isOngoing = evt.status === 'ongoing';
                      const dateFormatted = evt.dateStr.slice(8, 10) + '/' + evt.dateStr.slice(5, 7);

                      return (
                        <div
                          key={evt.id}
                          onClick={() => handleGoToEventDetail(evt)}
                          className="group cursor-pointer hover:bg-neutral-50/90 p-3 sm:p-4 -mx-2 sm:-mx-3 rounded-xl transition-all flex items-center justify-between gap-3.5 sm:gap-5 border-b border-neutral-100 last:border-b-0 pb-4 last:pb-0"
                        >
                          {/* 1. Thumbnail chỉ hiển thị ở Desktop */}
                          <div className="hidden md:block w-36 lg:w-44 h-24 lg:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200/80 relative">
                            <WireframeImage
                              label={evt.imagePlaceholder}
                              imageUrl={evt.imageUrl}
                              aspectRatio="16:9"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* 2. Thông tin sự kiện */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Badge hoạt động + Trạng thái */}
                            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                              <span
                                className={`font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded tracking-wide uppercase ${
                                  isSummit
                                    ? 'bg-red-50 text-brand-primary'
                                    : isTalkshow
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-neutral-100 text-neutral-700'
                                }`}
                              >
                                {evt.activityName || 'SỰ KIỆN'}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                  isOngoing
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200/70'
                                    : isUpcoming
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200/70'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isOngoing ? 'bg-amber-500' : isUpcoming ? 'bg-emerald-500' : 'bg-neutral-400'
                                  }`}
                                />
                                <span>{isOngoing ? 'Đang diễn ra' : isUpcoming ? 'Sắp diễn ra' : 'Đã diễn ra'}</span>
                              </span>
                            </div>

                            {/* Tiêu đề chính to rõ ràng, hiển thị đầy đủ KHÔNG bị cắt ngắn '....' */}
                            <h4 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug">
                              {evt.title}
                            </h4>

                            {/* Thời gian sự kiện: Đặt dưới tiêu đề chính */}
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-900">
                              <Clock className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                              <span>{dateFormatted} • {timeDisplay}</span>
                            </div>
                          </div>

                          {/* 3. Chevron mũi tên */}
                          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all shrink-0 ml-1 sm:ml-2 self-center" />
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4 sm:space-y-5">
          {/* Section Header for Upcoming Events (when timing is 'all' or 'upcoming') */}
          {(timingFilter === 'all' || timingFilter === 'upcoming') && upcomingEvents.length > 0 && (
            <div className="flex items-center justify-between pb-2 border-b-2 border-brand-primary">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-brand-primary shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-ink uppercase tracking-tight">
                  SỰ KIỆN SẮP DIỄN RA ({upcomingEvents.length})
                </h2>
              </div>
              <span className="text-xs text-ink-secondary hidden sm:inline font-medium">
                Đang mở cổng tiếp nhận đăng ký đại biểu
              </span>
            </div>
          )}

          {/* Section Header when timing is 'past' */}
          {timingFilter === 'past' && pastEvents.length > 0 && (
            <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-neutral-800 uppercase tracking-tight">
                  SỰ KIỆN ĐÃ DIỄN RA ({pastEvents.length})
                </h2>
              </div>
            </div>
          )}

          {/* List of Events */}
          <div className="space-y-4 sm:space-y-5">
            {filteredEvents.map((evt, index) => {
              const isFullEffective = evt.isFull || simulatedState === 'S-FULL';
              const regItem = registeredEvents.find(r => r.eventId === evt.id && r.status !== 'cancelled');
              const isPast = evt.status === 'past';

              // Check if we need to insert the "Past Events" separator header when timingFilter === 'all'
              const showPastHeader = timingFilter === 'all' && isPast && (index === 0 || filteredEvents[index - 1]?.status === 'upcoming');

              return (
                <React.Fragment key={evt.id}>
                  {showPastHeader && (
                    <div className="pt-4 sm:pt-6">
                      <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400 shrink-0" />
                          <h2 className="text-base sm:text-lg font-bold text-neutral-800 uppercase tracking-tight">
                            SỰ KIỆN ĐÃ DIỄN RA ({pastEvents.length})
                          </h2>
                        </div>
                        <span className="text-xs text-ink-secondary hidden sm:inline font-medium">
                          Xem báo cáo đúc kết & tài liệu hội nghị
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    onClick={() => handleGoToEventDetail(evt)}
                    className={`border bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md ${
                      isPast
                        ? 'border-hairline hover:border-neutral-400 bg-parchment/40 opacity-95'
                        : 'border-hairline hover:border-brand-primary'
                    }`}
                  >
                    {/* 1. Image Container (~35% on Desktop, full width on Mobile) */}
                    <div className="w-full md:w-[36%] lg:w-[35%] shrink-0 relative overflow-hidden bg-neutral-100 flex flex-col">
                      <div className="relative w-full h-48 sm:h-52 md:h-full min-h-[190px] md:min-h-[220px]">
                        <WireframeImage
                          label={evt.imagePlaceholder}
                          imageUrl={evt.imageUrl}
                          aspectRatio="16:9"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Date Badge Overlay (Top Left of image) */}
                        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs rounded-xl py-2 px-2.5 shadow-md border border-black/5 text-center min-w-[62px] sm:min-w-[66px] select-none">
                          <span className="text-[10px] sm:text-[11px] font-bold text-brand-primary uppercase tracking-wider leading-none block">
                            {parseDateBlock(evt.dateStr).monthText}
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight my-0.5 block tracking-tight">
                            {parseDateBlock(evt.dateStr).day}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-medium text-neutral-500 leading-none block">
                            {evt.timeStr?.split(' - ')[0]?.split(' – ')[0] || '08:00'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Content Area (~65% on Desktop, 100% on Mobile) */}
                    <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-3">
                        {/* Row 1: Badges (Category + Status + [Desktop] Số chỗ còn lại) */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded-md border ${
                            isPast
                              ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                              : 'bg-red-50 text-brand-primary border-red-200'
                          }`}>
                            {evt.activityName}
                          </span>

                          {isPast ? (
                            <span className="text-[11px] sm:text-xs font-semibold text-neutral-600 bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-md">
                              Đã diễn ra
                            </span>
                          ) : (
                            <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              Sắp diễn ra
                            </span>
                          )}

                          {/* Desktop: Số chỗ còn lại nằm ngay hàng badge theo spec */}
                          {!isPast && (
                            <div className="hidden md:flex items-center">
                              {isFullEffective ? (
                                <span className="text-[11px] sm:text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                                  Hết chỗ
                                </span>
                              ) : (
                                <span className="text-[11px] sm:text-xs font-semibold text-brand-primary bg-red-50 border border-red-200/80 px-2.5 py-1 rounded-md flex items-center gap-1">
                                  <span>🔥</span>
                                  <span>Chỉ còn {evt.availableSeats} chỗ</span>
                                </span>
                              )}
                            </div>
                          )}

                          {regItem?.status === 'pending_approval' && (
                            <span className="text-[11px] sm:text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Đang chờ duyệt
                            </span>
                          )}
                          {regItem?.status === 'confirmed' && (
                            <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Đã xác nhận
                            </span>
                          )}
                          {regItem?.status === 'waitlisted' && (
                            <span className="text-[11px] sm:text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                              Danh sách chờ
                            </span>
                          )}
                        </div>

                        {/* Row 2: Title */}
                        <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold leading-snug tracking-tight transition-colors ${
                          isPast
                            ? 'text-neutral-800 group-hover:text-ink'
                            : 'text-ink group-hover:text-brand-primary'
                        }`}>
                          {evt.title}
                        </h3>

                        {/* Row 3: Meta details (Ngày giờ → Địa điểm → Diễn giả) */}
                        <div className="space-y-1.5 text-xs sm:text-sm text-neutral-600">
                          {/* Ngày giờ */}
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-neutral-500 shrink-0" />
                            <span className="leading-tight">{formatWeekdayAndDate(evt.dateStr)} • {evt.timeStr}</span>
                          </div>

                          {/* Địa điểm */}
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1 leading-tight">{evt.location}</span>
                          </div>

                          {/* Diễn giả */}
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-neutral-500 shrink-0" />
                            <span className="leading-tight">
                              {evt.speakers[0]?.name || 'Ban Cố Vấn VLGM'}
                              {evt.speakers.length > 1 && (
                                <span className="text-neutral-500"> (+{evt.speakers.length - 1} khách mời)</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Mobile Box "Chỉ còn 42 chỗ" */}
                      {!isPast && (
                        <div className="md:hidden mt-1">
                          {isFullEffective ? (
                            <div className="bg-neutral-100 border border-neutral-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-600">
                              <span className="flex items-center gap-2">
                                <span>⚠️</span>
                                <span>Đã hết vé tham dự trực tiếp</span>
                              </span>
                              <ChevronRight className="w-4 h-4 text-neutral-400" />
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-red-50 to-orange-50/50 border border-red-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-brand-primary">
                              <span className="flex items-center gap-2">
                                <span>🔥</span>
                                <span>Chỉ còn {evt.availableSeats} chỗ</span>
                              </span>
                              <ChevronRight className="w-4 h-4 text-brand-primary" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Row 5: CTA Row */}
                      <div className="pt-2 md:pt-3 md:border-t md:border-neutral-100 flex flex-col md:flex-row md:items-center md:justify-end">
                        <div className="w-full md:w-auto">
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
                            size="md"
                            fullWidth
                            className="font-semibold text-sm md:w-auto md:px-6 md:py-2.5 justify-center shadow-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoToEventDetail(evt);
                            }}
                          >
                            {isPast ? (
                              'Xem kỷ yếu & Chi tiết'
                            ) : regItem?.status === 'confirmed' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                Xem thông tin tham dự
                              </>
                            ) : regItem?.status === 'pending_approval' ? (
                              'Đang chờ duyệt'
                            ) : regItem?.status === 'waitlisted' ? (
                              'Xem chi tiết'
                            ) : isFullEffective ? (
                              'Đăng ký danh sách chờ'
                            ) : (
                              'Đăng ký ngay'
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
