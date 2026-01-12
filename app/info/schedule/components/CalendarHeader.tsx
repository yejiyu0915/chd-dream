import React, { memo } from 'react';
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
 * 수동 최적화 적용
 */
function CalendarHeader({
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

// React.memo로 컴포넌트 메모이제이션 (수동 최적화)
export default memo(CalendarHeader, (prevProps, nextProps) => {
  // monthYear가 동일한지 확인
  if (prevProps.monthYear !== nextProps.monthYear) {
    return false; // 리렌더링 필요
  }
  // 함수들이 동일한지 확인
  if (
    prevProps.onPreviousMonth !== nextProps.onPreviousMonth ||
    prevProps.onNextMonth !== nextProps.onNextMonth ||
    prevProps.onGoToToday !== nextProps.onGoToToday
  ) {
    return false; // 리렌더링 필요
  }
  return true; // props가 동일하면 리렌더링 불필요
});
