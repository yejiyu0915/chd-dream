'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScheduleItem } from '@/lib/notion';
import Holidays from 'date-holidays';
import s from '../Schedule.module.scss';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleItem[];
  spanningEvents: SpanningEvent[];
  holidayInfo: {
    isHoliday: boolean;
    name: string;
    type: string;
  };
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
        month: 'numeric',
        day: 'numeric',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '')
      .replace(/\s/g, ''); // 띄어쓰기 제거

    const endDateStr = endDate
      .toLocaleDateString('ko-KR', {
        month: 'numeric',
        day: 'numeric',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '')
      .replace(/\s/g, ''); // 띄어쓰기 제거

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
        month: 'numeric',
        day: 'numeric',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '')
      .replace(/\s/g, ''); // 띄어쓰기 제거

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  // 연속 일정의 높이값을 캐시하는 Map
  const heightCache = useRef<Map<string, number>>(new Map());

  // 한국 공휴일 인스턴스 생성
  const holidays = new Holidays('KR');

  // 공휴일 확인 함수
  const getHolidayInfo = (date: Date) => {
    const holidayInfo = holidays.isHoliday(date);
    if (holidayInfo) {
      return {
        isHoliday: true,
        name: holidayInfo.name,
        type: holidayInfo.type,
      };
    }
    return { isHoliday: false, name: '', type: '' };
  };

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

  // 연속 일정의 높이를 동기화하는 함수
  const syncSpanningEventHeights = () => {
    if (!scheduleData) return;
    console.log('Syncing spanning event heights, window width:', window.innerWidth);

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
    spanningEventGroups.forEach((elements, groupKey) => {
      if (elements.length > 1) {
        let targetHeight: number;

        // 캐시에서 높이값 확인
        if (heightCache.current.has(groupKey)) {
          // 캐시된 높이값 사용
          targetHeight = heightCache.current.get(groupKey)!;
          console.log('Using cached height for', groupKey, ':', targetHeight);
        } else {
          // 첫 번째 요소의 높이를 측정하고 캐시에 저장
          const firstElement = elements[0];
          targetHeight = Math.ceil(firstElement.offsetHeight);
          heightCache.current.set(groupKey, targetHeight);
          console.log('Setting new height for', groupKey, ':', targetHeight);
        }

        // 모든 요소에 캐시된 높이값 적용
        elements.forEach((element) => {
          element.style.height = `${targetHeight}px`;
        });
      }
    });
  };

  // 컴포넌트 마운트 및 데이터 변경 시 높이 동기화
  useEffect(() => {
    if (scheduleData && scheduleData.length > 0) {
      // DOM이 업데이트된 후 실행 (지연 시간 단축)
      setTimeout(syncSpanningEventHeights, 50);
    }
  }, [scheduleData, currentDate]);

  // PC에서 높이 동기화를 위한 추가 useEffect
  useEffect(() => {
    if (scheduleData && scheduleData.length > 0 && window.innerWidth > 768) {
      // PC에서는 더 긴 지연 시간으로 높이 동기화
      setTimeout(syncSpanningEventHeights, 100);
    }
  }, [scheduleData, currentDate]);

  // 날짜 클릭 핸들러 (모바일에서만 동작)
  const handleDateClick = (date: Date) => {
    if (window.innerWidth <= 768) {
      console.log('Setting selected date:', date);
      setSelectedDate(date);
      setIsMobilePanelOpen(true);
    }
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
            } ${day.isToday ? s.today : ''} ${day.date.getDay() === 0 ? s.sunday : ''} ${
              day.holidayInfo.isHoliday ? s.holiday : ''
            } ${selectedDate && day.date.getTime() === selectedDate.getTime() ? s.selected : ''}`}
            data-selected={selectedDate && day.date.getTime() === selectedDate.getTime()}
            onClick={() => handleDateClick(day.date)}
            style={{ cursor: window.innerWidth <= 768 ? 'pointer' : 'default' }}
          >
            <div className={s.dayNumber}>
              {day.date.getDate()}
              {day.isToday && <span className={s.todayLabel}> (오늘)</span>}
              {/* {day.holidayInfo.isHoliday && (
                <span className={s.holidayLabel} title={day.holidayInfo.name}>
                  {day.holidayInfo.name}
                </span>
              )} */}
            </div>

            {/* 연속된 일정 (Spanning Events) */}
            {day.spanningEvents.length > 0 && (
              <div className={s.spanningEventList}>
                {day.spanningEvents.map((spanningEvent, index) => {
                  const { event, isFirstDay, isLastDay } = spanningEvent;
                  const timeInfo = formatTimeInfo(event);

                  const groupKey = `${event.title}-${new Date(event.startDate!).getTime()}-${new Date(event.endDate!).getTime()}`;

                  return (
                    <div
                      key={`${event.id}-${index}`}
                      className={`${s.spanningEvent} ${
                        isFirstDay ? s.spanningEventStart : ''
                      } ${isLastDay ? s.spanningEventEnd : ''} ${
                        event.important ? s.important : ''
                      }`}
                      title={`${event.title}${timeInfo}${event.location ? ` - ${event.location}` : ''}`}
                      data-spanning-event={groupKey}
                    >
                      {isFirstDay && (
                        <>
                          <span className={s.eventTitle}>{event.title}</span>
                          {timeInfo && <span className={s.eventTime}>{timeInfo}</span>}
                          {event.tags && event.tags.length > 0 && (
                            <div className={s.eventTags}>
                              {event.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span key={tagIndex} className={s.eventTag}>
                                  {tag}
                                </span>
                              ))}
                              {event.tags.length > 2 && (
                                <span className={s.eventTag}>+{event.tags.length - 2}</span>
                              )}
                            </div>
                          )}
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
                      className={`${s.eventItem} ${event.important ? s.important : ''}`}
                      title={`${event.title}${timeInfo}${event.location ? ` - ${event.location}` : ''}`}
                    >
                      <span className={s.eventTitle}>{event.title}</span>
                      {timeInfo && <span className={s.eventTime}>{timeInfo}</span>}
                      {event.tags && event.tags.length > 0 && (
                        <div className={s.eventTags}>
                          {event.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className={s.eventTag}>
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 2 && (
                            <span className={s.eventTag}>+{event.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {day.events.length > 3 && (
                  <div className={s.eventItem}>+{day.events.length - 3}개 더</div>
                )}
              </div>
            )}

            {/* 모바일에서 일정 개수 표시용 동그라미 */}
            <div className={s.eventDotsContainer}>
              {/* 연속 일정 동그라미 */}
              {day.spanningEvents.map((spanningEvent, index) => (
                <div
                  key={`spanning-${spanningEvent.event.id}-${index}`}
                  className={`${s.eventDot} ${spanningEvent.event.important ? s.important : ''}`}
                />
              ))}
              {/* 단일 일정 동그라미 */}
              {day.events.map((event, index) => (
                <div
                  key={`single-${event.id}-${index}`}
                  className={`${s.eventDot} ${event.important ? s.important : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 모바일 일정 상세 패널 */}
      {isMobilePanelOpen && selectedDate && (
        <div className={s.mobileEventPanel}>
          <div className={s.mobileEventPanelHeader}>
            <div className={s.mobileEventPanelTitle}>
              {selectedDate.toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </div>
          </div>
          <div className={s.mobileEventList}>
            {getSelectedDateEvents().map((event) => {
              const timeInfo = formatTimeInfo(event);
              return (
                <div
                  key={event.id}
                  className={`${s.mobileEventItem} ${event.important ? s.important : ''}`}
                >
                  <div className={s.mobileEventItemTitle}>{event.title}</div>
                  {timeInfo && <div className={s.mobileEventItemTime}>{timeInfo}</div>}
                  {event.location && (
                    <div className={s.mobileEventItemTime}>📍 {event.location}</div>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <div className={s.mobileEventItemTags}>
                      {event.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className={s.mobileEventItemTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {getSelectedDateEvents().length === 0 && (
              <div className={s.mobileEventItem}>
                <div className={s.mobileEventItemTitle}>일정이 없습니다</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
