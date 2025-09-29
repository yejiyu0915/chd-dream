import React from 'react';
import { CalendarDay, DAYS_OF_WEEK } from '../types/types';
import { formatTimeInfo } from '@/app/info/schedule/types/utils';
import s from '@/app/info/schedule/Schedule.module.scss';

interface CalendarGridProps {
  calendarData: CalendarDay[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
}

/**
 * 캘린더 그리드 컴포넌트
 * 요일 헤더와 날짜 셀들을 렌더링
 */
export default function CalendarGrid({
  calendarData,
  selectedDate,
  onDateClick,
}: CalendarGridProps) {
  return (
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
          onClick={() => onDateClick(day.date)}
          style={{
            cursor:
              typeof window !== 'undefined' && window.innerWidth <= 768 ? 'pointer' : 'default',
          }}
        >
          <div className={s.dayNumber}>
            {day.date.getDate()}
            {day.isToday && <span className={s.todayLabel}> (오늘)</span>}
          </div>

          {/* 연속된 일정 (Spanning Events) */}
          {day.spanningEvents.length > 0 && (
            <div className={s.spanningEventList}>
              {day.spanningEvents.map((spanningEvent, eventIndex) => {
                const { event, isFirstDay, isLastDay } = spanningEvent;
                const timeInfo = formatTimeInfo(event);

                const groupKey = `${event.title}-${new Date(event.startDate!).getTime()}-${new Date(event.endDate!).getTime()}`;

                return (
                  <div
                    key={`${event.id}-${eventIndex}`}
                    className={`${s.spanningEvent} ${
                      isFirstDay ? s.spanningEventStart : ''
                    } ${isLastDay ? s.spanningEventEnd : ''} ${event.important ? s.important : ''}`}
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
            {day.spanningEvents.map((spanningEvent, eventIndex) => (
              <div
                key={`spanning-${spanningEvent.event.id}-${eventIndex}`}
                className={`${s.eventDot} ${spanningEvent.event.important ? s.important : ''}`}
              />
            ))}
            {/* 단일 일정 동그라미 */}
            {day.events.map((event, eventIndex) => (
              <div
                key={`single-${event.id}-${eventIndex}`}
                className={`${s.eventDot} ${event.important ? s.important : ''}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
