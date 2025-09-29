import React from 'react';
import s from '@/app/info/schedule/Schedule.module.scss';

interface CalendarHeaderProps {
  monthYear: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

/**
 * 캘린더 헤더 컴포넌트
 * 월/년 표시 및 네비게이션 버튼들을 포함
 */
export default function CalendarHeader({
  monthYear,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
}: CalendarHeaderProps) {
  return (
    <div className={s.calendarHeader}>
      <h2 className={s.calendarTitle}>캘린더로 보기</h2>
      <div className={s.calendarNavigation}>
        <button className={s.navButton} onClick={onPreviousMonth} aria-label="이전 달">
          ←
        </button>
        <div className={s.currentMonth}>{monthYear}</div>
        <button className={s.navButton} onClick={onNextMonth} aria-label="다음 달">
          →
        </button>
        <button className={s.navButton} onClick={onGoToToday} aria-label="오늘">
          오늘
        </button>
      </div>
    </div>
  );
}
