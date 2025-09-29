import React from 'react';
import { ScheduleItem } from '@/lib/notion';
import { formatTimeInfo } from '@/app/info/schedule/types/utils';
import s from '@/app/info/schedule/Schedule.module.scss';

interface MobileEventPanelProps {
  selectedDate: Date;
  events: ScheduleItem[];
}

/**
 * 모바일 일정 상세 패널 컴포넌트
 * 선택된 날짜의 일정들을 상세히 표시
 */
export default function MobileEventPanel({ selectedDate, events }: MobileEventPanelProps) {
  return (
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
        {events.map((event) => {
          const timeInfo = formatTimeInfo(event);
          return (
            <div
              key={event.id}
              className={`${s.mobileEventItem} ${event.important ? s.important : ''}`}
            >
              <div className={s.mobileEventItemTitle}>{event.title}</div>
              {timeInfo && <div className={s.mobileEventItemTime}>{timeInfo}</div>}
              {event.location && <div className={s.mobileEventItemTime}>📍 {event.location}</div>}
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
        {events.length === 0 && (
          <div className={s.mobileEventItem}>
            <div className={s.mobileEventItemTitle}>일정이 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );
}
