'use client';

import React from 'react';
import { ScheduleItem } from '@/lib/notion';
import { useScheduleContext } from '@/app/info/schedule/context/ScheduleContext';
import {
  useScheduleCalendar,
  getSelectedDateEvents,
} from '@/app/info/schedule/hooks/useScheduleCalendar';
import CalendarHeader from '@/app/info/schedule/components/CalendarHeader';
import CalendarGrid from '@/app/info/schedule/components/CalendarGrid';
import EventPanel from '@/app/info/schedule/components/EventPanel';
import ScheduleListView from '@/app/info/schedule/components/ScheduleListView';
import s from '@/app/info/schedule/Schedule.module.scss';

interface ScheduleCalendarViewProps {
  scheduleData: ScheduleItem[];
}

/**
 * 일정 캘린더 뷰 컴포넌트 (UI 렌더링만 담당)
 */
export default function ScheduleCalendarView({ scheduleData }: ScheduleCalendarViewProps) {
  // Context에서 상태와 액션 가져오기
  const {
    currentDate,
    selectedDate,
    viewMode,
    period,
    isMobilePanelOpen,
    setSelectedDate,
    setIsMobilePanelOpen,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToPreviousPeriod,
    goToNextPeriod,
  } = useScheduleContext();

  // 캘린더 데이터 생성
  const calendarData = useScheduleCalendar(currentDate, scheduleData);

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsMobilePanelOpen(true);
  };

  // 선택된 날짜의 일정 가져오기
  const selectedDateEventsList = getSelectedDateEvents(selectedDate, scheduleData);

  // 월/년 표시
  const monthYear = currentDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className={s.calendarContainer} suppressHydrationWarning>
      {viewMode === 'calendar' ? (
        <>
          <CalendarHeader
            monthYear={monthYear}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onGoToToday={goToToday}
          />

          <div className={s.calendarGridWrapper}>
            <CalendarGrid
              calendarData={calendarData}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />

            {isMobilePanelOpen && (
              <EventPanel selectedDate={selectedDate} events={selectedDateEventsList} />
            )}
          </div>
        </>
      ) : (
        <ScheduleListView
          scheduleData={scheduleData || []}
          currentDate={currentDate}
          period={period}
          isLoading={false}
          isError={false}
          error={null}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onGoToToday={goToToday}
          onPreviousPeriod={goToPreviousPeriod}
          onNextPeriod={goToNextPeriod}
        />
      )}
    </div>
  );
}
