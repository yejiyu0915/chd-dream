import React from 'react';
import { ScheduleItem } from '@/lib/notion';
import { formatTimeInfo } from '@/app/info/schedule/types/utils';
import s from '@/app/info/schedule/Schedule.module.scss';

interface EventPanelProps {
  selectedDate: Date;
  events: ScheduleItem[];
}

/**
 * 모바일 일정 상세 패널 컴포넌트
 * 선택된 날짜의 일정들을 상세히 표시
 */
export default function EventPanel({ selectedDate, events }: EventPanelProps) {
  return (
    <div className={s.eventPanel}>
      <div className={s.eventPanelHeader}>
        <div className={s.eventPanelTitle}>
          {selectedDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
          {(() => {
            const today = new Date();
            const isToday =
              selectedDate.getFullYear() === today.getFullYear() &&
              selectedDate.getMonth() === today.getMonth() &&
              selectedDate.getDate() === today.getDate();
            return isToday ? ' (오늘)' : '';
          })()}
        </div>
      </div>
      <div className={s.eventList}>
        {events.map((event) => {
          const timeInfo = formatTimeInfo(event);
          return (
            <div key={event.id} className={`${s.eventItem} ${event.important ? s.important : ''}`}>
              <div className={s.eventItemTitle}>{event.title}</div>
              {timeInfo && <div className={s.eventItemTime}>{timeInfo}</div>}
              {event.location && <div className={s.eventItemTime}>📍 {event.location}</div>}
              {event.tags && event.tags.length > 0 && (
                <div className={s.eventItemTags}>
                  {event.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={s.eventItemTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {events.length === 0 && (
          <div className={`${s.eventItem} ${s.noEventsItem}`}>
            <div className={`${s.eventItemTitle} ${s.noEventsTitle}`}>일정이 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );
}
