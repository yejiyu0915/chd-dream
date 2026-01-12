'use client';

import React, { useMemo, useCallback, memo } from 'react';
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
 * 수동 최적화 적용 (복잡한 계산이 많아 수동 최적화가 더 효율적)
 */
function ScheduleCalendarView({ scheduleData }: ScheduleCalendarViewProps) {
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

  // 캘린더 데이터 생성 (이미 useMemo로 최적화됨)
  const calendarData = useScheduleCalendar(currentDate, scheduleData);

  // 날짜 클릭 핸들러 (수동 최적화 - useCallback)
  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setIsMobilePanelOpen(true);
    },
    [setSelectedDate, setIsMobilePanelOpen]
  );

  // 선택된 날짜의 일정 가져오기 (수동 최적화 - useMemo)
  const selectedDateEventsList = useMemo(
    () => getSelectedDateEvents(selectedDate, scheduleData),
    [selectedDate, scheduleData]
  );

  // 월/년 표시 (수동 최적화 - useMemo)
  const monthYear = useMemo(
    () =>
      currentDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
      }),
    [currentDate]
  );

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

// React.memo로 컴포넌트 메모이제이션 (수동 최적화)
export default memo(ScheduleCalendarView, (prevProps, nextProps) => {
  // scheduleData 배열이 동일한지 확인
  if (prevProps.scheduleData !== nextProps.scheduleData) {
    if (prevProps.scheduleData.length !== nextProps.scheduleData.length) {
      return false; // 리렌더링 필요
    }
    // 배열 내용이 동일한지 확인
    const prevIds = prevProps.scheduleData.map((item) => item.id).join(',');
    const nextIds = nextProps.scheduleData.map((item) => item.id).join(',');
    return prevIds === nextIds; // ID가 동일하면 리렌더링 불필요
  }
  return true; // props가 동일하면 리렌더링 불필요
});
