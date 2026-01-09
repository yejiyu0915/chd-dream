import { useMemo } from 'react';
import { ScheduleItem } from '@/lib/notion';
import { CalendarDay, SpanningEvent } from '@/app/info/schedule/types/types';
import { useHolidayInfo } from '@/app/info/schedule/types/hooks';

/**
 * 캘린더 데이터를 생성하는 커스텀 훅
 */
export function useScheduleCalendar(currentDate: Date, scheduleData: ScheduleItem[]) {
  const { getHolidayInfo } = useHolidayInfo();

  // 현재 월의 캘린더 데이터 생성
  const calendarData = useMemo(() => {
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

        // 상시 일정(ongoing)인 경우 시작일에만 dot 표시
        if (event.ongoing) {
          for (let i = 0; i < days.length; i++) {
            const dayDate = days[i].date;
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

            // 시작일과 일치하는 날짜에만 dot 표시
            if (dayDateOnly.getTime() === eventStartDateOnly.getTime()) {
              days[i].events.push(event);
              break; // 시작일만 표시하므로 한 번만 추가하고 종료
            }
          }
          return; // ongoing 일정은 여기서 처리 완료
        }

        // 일반 일정 처리 (기존 로직)
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

  return calendarData;
}

/**
 * 선택된 날짜의 일정을 가져오는 헬퍼 함수
 */
export function getSelectedDateEvents(
  selectedDate: Date,
  scheduleData: ScheduleItem[]
): ScheduleItem[] {
  if (!scheduleData) return [];

  const selectedDateOnly = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const events: ScheduleItem[] = [];

  scheduleData.forEach((event) => {
    // 상시 일정(ongoing)인 경우 시작일 이후 모든 날짜에 표시
    if (event.ongoing && event.startDate) {
      const eventStartDate = new Date(event.startDate);
      const eventStartDateOnly = new Date(
        eventStartDate.getFullYear(),
        eventStartDate.getMonth(),
        eventStartDate.getDate()
      );

      // 선택된 날짜가 시작일 이후인 경우 표시
      if (selectedDateOnly >= eventStartDateOnly) {
        events.push(event);
      }
      return; // ongoing 일정은 여기서 처리 완료
    }

    // 일반 일정 처리
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
}
