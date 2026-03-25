import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { ScheduleItem } from '@/lib/notion';
import { formatTimeInfo } from '@/app/info/schedule/types/utils';
import s from '@/app/info/schedule/Schedule.module.scss';

interface EventPanelProps {
  selectedDate: Date;
  events: ScheduleItem[];
}

/**
 * D-day 라벨을 계산하는 헬퍼 함수
 * 미래 일정에만 D-3, D-2, D-1, D-day 표시
 */
function getDDayLabel(event: ScheduleItem): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 일정의 시작일 가져오기
  const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
  eventStartDate.setHours(0, 0, 0, 0);

  // 과거 일정이면 라벨 표시 안 함
  if (eventStartDate < today) {
    return null;
  }

  // 날짜 차이 계산 (밀리초를 일 단위로 변환)
  const diffTime = eventStartDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 당일은 D-day
  if (diffDays === 0) {
    return 'D-day';
  }

  // D-3, D-2, D-1만 표시 (그 이상은 표시 안 함)
  if (diffDays <= 3 && diffDays > 0) {
    return `D-${diffDays}`;
  }

  return null;
}

/**
 * 모바일 일정 상세 패널 컴포넌트
 * 선택된 날짜의 일정들을 상세히 표시
 * 수동 최적화 적용
 */
function EventPanel({ selectedDate, events }: EventPanelProps) {
  // 날짜 포맷팅 (수동 최적화 - useMemo)
  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
    [selectedDate]
  );

  // 오늘 여부 확인 (수동 최적화 - useMemo)
  const isToday = useMemo(() => {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  }, [selectedDate]);

  return (
    <div className={s.eventPanel}>
      <div className={s.eventPanelHeader}>
        <div className={s.eventPanelTitle}>
          {formattedDate}
          {isToday && ' (오늘)'}
        </div>
      </div>
      <div className={s.eventList}>
        {events.map((event) => {
          const timeInfo = formatTimeInfo(event);
          const dDayLabel = getDDayLabel(event);
          const isOngoing = event.ongoing;
          return (
            <div key={event.id} className={`${s.eventItem} ${event.important ? s.important : ''}`}>
              <div className={s.eventItemHeader}>
                <div className={s.eventItemTitle}>{event.title}</div>
                <div className={s.eventItemLabels}>
                  {isOngoing && <span className={s.eventItemOngoing}>진행중</span>}
                  {dDayLabel && <span className={s.eventItemDDay}>{dDayLabel}</span>}
                </div>
              </div>
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
            <div className={`${s.eventItemTitle} ${s.noEventsTitle}`}>
              이 날짜에 등록된 일정이 없습니다
            </div>
            <p className={s.noEventsHint}>
              <Link href="/worship/timetable">예배 시간표</Link>에서 정기 집회를 확인해 보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// React.memo로 컴포넌트 메모이제이션 (수동 최적화)
export default memo(EventPanel, (prevProps, nextProps) => {
  // selectedDate가 동일한지 확인
  if (prevProps.selectedDate.getTime() !== nextProps.selectedDate.getTime()) {
    return false; // 리렌더링 필요
  }
  // events 배열이 동일한지 확인
  if (prevProps.events !== nextProps.events) {
    if (prevProps.events.length !== nextProps.events.length) {
      return false; // 리렌더링 필요
    }
    // 배열 내용이 동일한지 확인
    const prevIds = prevProps.events.map((item) => item.id).join(',');
    const nextIds = nextProps.events.map((item) => item.id).join(',');
    return prevIds === nextIds; // ID가 동일하면 리렌더링 불필요
  }
  return true; // props가 동일하면 리렌더링 불필요
});
