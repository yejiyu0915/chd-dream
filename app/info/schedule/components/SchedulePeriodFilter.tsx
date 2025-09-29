import React from 'react';
import s from '@/app/info/schedule/Schedule.module.scss';

interface SchedulePeriodFilterProps {
  period: '1month' | '3months' | '6months' | '1year';
  onPeriodChange: (period: '1month' | '3months' | '6months' | '1year') => void;
}

/**
 * 일정 기간 필터 컴포넌트
 * 1개월, 3개월, 6개월, 1년 단위 선택
 */
export default function SchedulePeriodFilter({
  period,
  onPeriodChange,
}: SchedulePeriodFilterProps) {
  const periodOptions = [
    { value: '1month', label: '1개월' },
    { value: '3months', label: '3개월' },
    { value: '6months', label: '6개월' },
    { value: '1year', label: '1년' },
  ] as const;

  return (
    <div className={s.periodFilter}>
      {periodOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onPeriodChange(option.value)}
          className={`${s.periodFilter__button} ${period === option.value ? s.active : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
