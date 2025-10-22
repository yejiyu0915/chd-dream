import React from 'react';
import { CalendarDay, DAYS_OF_WEEK } from '@/app/info/schedule/types/types';
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
  'use memo'; // React 컴파일러 최적화 적용

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
          data-debug-selected={selectedDate ? selectedDate.getTime() : 'null'}
          data-debug-day={day.date.getTime()}
          onClick={() => onDateClick(day.date)}
          style={{
            cursor: 'pointer',
          }}
        >
          <div className={s.dayNumber}>
            {index === 0
              ? `${day.date.getMonth() + 1}/${day.date.getDate()}`
              : day.date.getDate() === 1
                ? `${day.date.getMonth() + 1}/${day.date.getDate()}`
                : day.date.getDate()}
            {day.isToday && <span className={s.todayLabel}> (오늘)</span>}
          </div>

          {/* 일정 개수 표시용 동그라미 */}
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
