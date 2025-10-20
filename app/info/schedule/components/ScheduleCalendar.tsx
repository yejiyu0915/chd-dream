'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ScheduleItem } from '@/lib/notion';
import { CalendarDay, SpanningEvent } from '@/app/info/schedule/types/types';
import { useHolidayInfo, useScheduleData } from '@/app/info/schedule/types/hooks';
import CalendarHeader from '@/app/info/schedule/components/CalendarHeader';
import CalendarGrid from '@/app/info/schedule/components/CalendarGrid';
import EventPanel from './EventPanel';
import ScheduleViewModeFilter from '@/app/info/schedule/components/ScheduleViewModeFilter';
import SchedulePeriodFilter from '@/app/info/schedule/components/SchedulePeriodFilter';
import ScheduleListView from '@/app/info/schedule/components/ScheduleListView';
import s from '@/app/info/schedule/Schedule.module.scss';

// 고정 px 값 사용 - 리사이즈 시 재계산으로 안정성 확보

export default function ScheduleCalendar() {
  'use memo'; // React 컴파일러 최적화 적용

  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [period, setPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('1month');

  // 캐시 제거 - 리사이즈할 때마다 재계산으로 안정성 확보

  // 커스텀 훅 사용
  const { getHolidayInfo } = useHolidayInfo();
  const { data: scheduleData, isLoading, isError, error, refetch } = useScheduleData();

  // 연속 일정의 높이를 동기화하는 함수 (고정 px 기반)
  const syncSpanningEventHeights = useCallback(() => {
    if (!scheduleData || typeof window === 'undefined') return;

    // 모든 연속 일정을 찾아서 그룹화
    const spanningEventGroups = new Map<string, HTMLElement[]>();

    scheduleData.forEach((event) => {
      if (event.startDate && event.endDate) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        // 같은 연속 일정인지 확인 (같은 제목과 날짜 범위)
        const groupKey = `${event.title}-${startDate.getTime()}-${endDate.getTime()}`;

        // DOM에서 해당 연속 일정 요소들을 찾기
        const elements = document.querySelectorAll(`[data-spanning-event="${groupKey}"]`);
        if (elements.length > 0) {
          spanningEventGroups.set(groupKey, Array.from(elements) as HTMLElement[]);
        }
      }
    });

    // 각 그룹의 높이를 동기화
    spanningEventGroups.forEach((elements, _groupKey) => {
      if (elements.length > 1) {
        // 모든 요소의 높이를 먼저 초기화
        elements.forEach((element) => {
          element.style.height = '';
        });

        // 첫 번째 요소의 정확한 높이를 측정 (소수점 포함)
        const firstElement = elements[0];
        const targetHeightPx = firstElement.getBoundingClientRect().height;

        // 모든 요소를 첫 번째 요소 높이에 맞춰서 동기화
        elements.forEach((element) => {
          element.style.height = `${targetHeightPx}px`;
        });
      }
    });
  }, [scheduleData]);

  // 컴포넌트 마운트 및 데이터 변경 시 높이 동기화
  useEffect(() => {
    if (scheduleData && scheduleData.length > 0) {
      // DOM이 업데이트된 후 실행 (지연 시간 단축)
      setTimeout(syncSpanningEventHeights, 50);
    }
  }, [scheduleData, currentDate, syncSpanningEventHeights]);

  // 뷰포트 크기 변경 시 높이 재계산 (디바운싱 적용)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      // 디바운싱: 100ms 후에 실행
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (scheduleData && scheduleData.length > 0) {
          syncSpanningEventHeights();
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [scheduleData, syncSpanningEventHeights]);

  // 뷰 모드 변경 시 spanning event 높이 재동기화
  useEffect(() => {
    if (scheduleData && scheduleData.length > 0 && viewMode === 'calendar') {
      // 캘린더 뷰로 전환될 때 높이 동기화
      setTimeout(syncSpanningEventHeights, 100);
    }
  }, [viewMode, scheduleData, syncSpanningEventHeights]);

  // 클라이언트에서만 초기화 (SSR hydration 에러 방지)
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setIsMobilePanelOpen(true);
  }, []);

  // 날짜 클릭 핸들러 (모바일과 PC 모두에서 동작)
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsMobilePanelOpen(true);
  };

  // 선택된 날짜의 일정 가져오기
  const getSelectedDateEvents = () => {
    if (!selectedDate || !scheduleData) return [];

    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const events: ScheduleItem[] = [];

    scheduleData.forEach((event) => {
      if (event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);
        const eventStartDateOnly = new Date(
          eventStartDate.getFullYear(),
          eventStartDate.getMonth(),
          eventStartDate.getDate()
        );
        const eventEndDateOnly = new Date(
          eventEndDate.getFullYear(),
          eventEndDate.getMonth(),
          eventEndDate.getDate()
        );

        if (selectedDateOnly >= eventStartDateOnly && selectedDateOnly <= eventEndDateOnly) {
          events.push(event);
        }
      } else if (event.startDate) {
        const eventStartDate = new Date(event.startDate);
        const eventStartDateOnly = new Date(
          eventStartDate.getFullYear(),
          eventStartDate.getMonth(),
          eventStartDate.getDate()
        );

        if (selectedDateOnly.getTime() === eventStartDateOnly.getTime()) {
          events.push(event);
        }
      }
    });

    return events;
  };

  // 현재 월의 캘린더 데이터 생성
  const calendarData = useMemo(() => {
    if (!currentDate) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 이번 달 첫째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 캘린더 시작일 (이번 달 첫째 날이 속한 주의 일요일)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // 캘린더 종료일 (이번 달 마지막 날이 속한 주의 토요일)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 먼저 모든 날짜 셀 생성
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayDate = new Date(date);
      const isCurrentMonth = dayDate.getMonth() === month;
      const isToday = dayDate.getTime() === today.getTime();

      const holidayInfo = getHolidayInfo(dayDate);

      days.push({
        date: dayDate,
        isCurrentMonth,
        isToday,
        events: [],
        spanningEvents: [],
        holidayInfo,
      });
    }

    // 일정 데이터 처리
    if (scheduleData) {
      scheduleData.forEach((event) => {
        const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
        const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;

        // 캘린더 범위 내에서 이벤트가 겹치는 날짜들 찾기
        const eventDays: number[] = [];
        for (let i = 0; i < days.length; i++) {
          const dayDate = days[i].date;

          // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
          const dayDateOnly = new Date(
            dayDate.getFullYear(),
            dayDate.getMonth(),
            dayDate.getDate()
          );
          const eventStartDateOnly = new Date(
            eventStartDate.getFullYear(),
            eventStartDate.getMonth(),
            eventStartDate.getDate()
          );
          const eventEndDateOnly = new Date(
            eventEndDate.getFullYear(),
            eventEndDate.getMonth(),
            eventEndDate.getDate()
          );

          if (dayDateOnly >= eventStartDateOnly && dayDateOnly <= eventEndDateOnly) {
            eventDays.push(i);
          }
        }

        if (eventDays.length > 0) {
          // 단일 날짜 이벤트
          if (eventDays.length === 1) {
            const dayIndex = eventDays[0];
            days[dayIndex].events.push(event);
          } else {
            // 다중 날짜 이벤트 (연속 바)
            eventDays.forEach((dayIndex, index) => {
              const spanningEvent: SpanningEvent = {
                event,
                startDay: eventDays[0],
                endDay: eventDays[eventDays.length - 1],
                isFirstDay: index === 0,
                isLastDay: index === eventDays.length - 1,
              };
              days[dayIndex].spanningEvents.push(spanningEvent);
            });
          }
        }
      });
    }

    return days;
  }, [currentDate, scheduleData, getHolidayInfo]);

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate((prev) =>
      prev ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) : new Date()
    );
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate((prev) =>
      prev ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) : new Date()
    );
  };

  // 오늘로 이동
  const goToToday = () => {
    const today = new Date();
    // 시간 부분을 제거하고 날짜만 사용
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    setCurrentDate(todayDateOnly);
    // currentDate 변경 후 selectedDate 설정
    setTimeout(() => {
      setSelectedDate(todayDateOnly);
      setIsMobilePanelOpen(true);
    }, 0);
  };

  // 이전 기간으로 이동 (기간에 따라 다르게)
  const goToPreviousPeriod = () => {
    setCurrentDate((prev) => {
      if (!prev) return new Date();
      const newDate = new Date(prev);
      switch (period) {
        case '1month':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case '3months':
          newDate.setMonth(newDate.getMonth() - 3);
          break;
        case '6months':
          newDate.setMonth(newDate.getMonth() - 6);
          break;
        case '1year':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
      }
      return newDate;
    });
  };

  // 다음 기간으로 이동 (기간에 따라 다르게)
  const goToNextPeriod = () => {
    setCurrentDate((prev) => {
      if (!prev) return new Date();
      const newDate = new Date(prev);
      switch (period) {
        case '1month':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case '3months':
          newDate.setMonth(newDate.getMonth() + 3);
          break;
        case '6months':
          newDate.setMonth(newDate.getMonth() + 6);
          break;
        case '1year':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }
      return newDate;
    });
  };

  // 월/년 표시
  const monthYear =
    currentDate?.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    }) || '';

  if (isLoading || !currentDate) {
    return (
      <div className={s.calendarContainer}>
        <div className={s.loadingState}>일정을 불러오는 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={s.calendarContainer}>
        <div className={s.errorState}>
          <p>일정을 불러오는데 실패했습니다.</p>
          <p>{error?.message}</p>
          <button className={s.retryButton} onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.calendarContainer}>
      {/* 필터 그룹 */}
      <div className={s.filterGroup}>
        <ScheduleViewModeFilter viewMode={viewMode} onViewModeChange={setViewMode} />
        {viewMode === 'list' && <SchedulePeriodFilter period={period} onPeriodChange={setPeriod} />}
      </div>

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

            {/* 일정 상세 패널 */}
            {isMobilePanelOpen && selectedDate && (
              <EventPanel selectedDate={selectedDate} events={getSelectedDateEvents()} />
            )}
          </div>
        </>
      ) : (
        <ScheduleListView
          scheduleData={scheduleData || []}
          currentDate={currentDate}
          period={period}
          isLoading={isLoading}
          isError={isError}
          error={error}
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
