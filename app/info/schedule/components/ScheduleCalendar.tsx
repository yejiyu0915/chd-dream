'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScheduleItem } from '@/lib/notion';
import s from '../Schedule.module.scss';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleItem[];
  spanningEvents: SpanningEvent[];
}

interface SpanningEvent {
  event: ScheduleItem;
  startDay: number;
  endDay: number;
  isFirstDay: boolean;
  isLastDay: boolean;
}

const DAYS_OF_WEEK = ['주일', '월', '화', '수', '목', '금', '토'];

// 시간 정보 포맷팅 함수
const formatTimeInfo = (event: ScheduleItem): string => {
  // 원본 데이터에서 시간이 실제로 설정되었는지 확인하는 헬퍼 함수
  const hasActualTime = (dateString: string): boolean => {
    return dateString.includes('T');
  };

  if (event.startDate && event.endDate) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const startDateStr = startDate
      .toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '');

    const endDateStr = endDate
      .toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '');

    const startHasTime = hasActualTime(event.startDate);
    const endHasTime = hasActualTime(event.endDate);

    // 같은 날짜인 경우
    if (startDateStr === endDateStr) {
      if (startHasTime && endHasTime) {
        const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const endTimeStr = endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr}(${startTimeStr}~${endTimeStr})`;
      } else {
        return ` ${startDateStr}`;
      }
    } else {
      // 다른 날짜인 경우
      if (startHasTime && endHasTime) {
        const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const endTimeStr = endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr}(${startTimeStr}) → ${endDateStr}(${endTimeStr})`;
      } else if (startHasTime) {
        const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr}(${startTimeStr}) → ${endDateStr}`;
      } else if (endHasTime) {
        const endTimeStr = endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr} → ${endDateStr}(${endTimeStr})`;
      } else {
        return ` ${startDateStr} → ${endDateStr}`;
      }
    }
  } else if (event.startDate) {
    const startDate = new Date(event.startDate);
    const dateStr = startDate
      .toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '');

    if (hasActualTime(event.startDate)) {
      const timeStr = startDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      // 단일 일정이고 시간이 설정된 경우 시간만 표시
      return ` ${timeStr}`;
    } else {
      // 단일 날짜이고 시간도 없는 경우 날짜 표시 생략
      return '';
    }
  } else if (event.time) {
    return ` ${event.time}`;
  }

  return '';
};

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 일정 데이터 가져오기
  const {
    data: scheduleData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ScheduleItem[]>({
    queryKey: ['schedule-list'],
    queryFn: async () => {
      const response = await fetch('/api/schedule');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 0, // 캐시 사용하지 않음 - 항상 최신 데이터 가져오기
    retry: 3,
    refetchOnWindowFocus: true, // 창 포커스 시 데이터 새로고침
    refetchOnMount: true, // 컴포넌트 마운트 시 데이터 새로고침
  });

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

      days.push({
        date: dayDate,
        isCurrentMonth,
        isToday,
        events: [],
        spanningEvents: [],
      });
    }

    // 일정 데이터 처리
    if (scheduleData) {
      console.log('Schedule data:', scheduleData);
      scheduleData.forEach((event) => {
        const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
        const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;

        console.log(`Event: ${event.title}`, {
          startDate: eventStartDate,
          endDate: eventEndDate,
          originalStartDate: event.startDate,
          originalDate: event.date,
        });

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
            console.log(`✅ Event "${event.title}" matches day ${dayDate.toDateString()}`);
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
  }, [currentDate, scheduleData]);

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 월/년 표시
  const monthYear = currentDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });

  if (isLoading) {
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
      {/* 캘린더 헤더 */}
      <div className={s.calendarHeader}>
        <h2 className={s.calendarTitle}>캘린더로 보기</h2>
        <div className={s.calendarNavigation}>
          <button className={s.navButton} onClick={goToPreviousMonth} aria-label="이전 달">
            ←
          </button>
          <div className={s.currentMonth}>{monthYear}</div>
          <button className={s.navButton} onClick={goToNextMonth} aria-label="다음 달">
            →
          </button>
          <button className={s.navButton} onClick={goToToday} aria-label="오늘">
            오늘
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className={s.calendarGrid}>
        {/* 요일 헤더 */}
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day} className={`${s.dayHeader} ${index === 0 ? s.sunday : ''}`}>
            {day}
          </div>
        ))}

        {/* 날짜 셀들 */}
        {calendarData.map((day, index) => (
          <div
            key={index}
            className={`${s.dayCell} ${
              !day.isCurrentMonth ? s.otherMonth : ''
            } ${day.isToday ? s.today : ''} ${day.date.getDay() === 0 ? s.sunday : ''}`}
          >
            <div className={s.dayNumber}>
              {day.date.getDate()}
              {day.isToday && <span className={s.todayLabel}> (오늘)</span>}
            </div>

            {/* 연속된 일정 (Spanning Events) */}
            {day.spanningEvents.length > 0 && (
              <div className={s.spanningEventList}>
                {day.spanningEvents.map((spanningEvent, index) => {
                  const { event, isFirstDay, isLastDay } = spanningEvent;
                  const timeInfo = formatTimeInfo(event);

                  return (
                    <div
                      key={`${event.id}-${index}`}
                      className={`${s.spanningEvent} ${
                        isFirstDay ? s.spanningEventStart : ''
                      } ${isLastDay ? s.spanningEventEnd : ''}`}
                      title={`${event.title}${timeInfo}${event.location ? ` - ${event.location}` : ''}`}
                    >
                      {isFirstDay && (
                        <>
                          {event.title}
                          {timeInfo && <span className={s.eventTime}>{timeInfo}</span>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 단일 날짜 일정 */}
            {day.events.length > 0 && (
              <div className={s.eventList}>
                {day.events.slice(0, 3).map((event) => {
                  const timeInfo = formatTimeInfo(event);

                  return (
                    <div
                      key={event.id}
                      className={s.eventItem}
                      title={`${event.title}${timeInfo}${event.location ? ` - ${event.location}` : ''}`}
                    >
                      {event.title}
                      {timeInfo && <span className={s.eventTime}>{timeInfo}</span>}
                    </div>
                  );
                })}
                {day.events.length > 3 && (
                  <div className={s.eventItem}>+{day.events.length - 3}개 더</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
