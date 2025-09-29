import React from 'react';
import s from '@/app/info/schedule/Schedule.module.scss';
import Icon from '@/common/components/utils/Icons';

interface ScheduleViewModeFilterProps {
  viewMode: 'calendar' | 'list';
  onViewModeChange: (mode: 'calendar' | 'list') => void;
}

/**
 * 일정 뷰모드 필터 컴포넌트
 * 캘린더 뷰와 리스트 뷰 간 전환
 */
export default function ScheduleViewModeFilter({
  viewMode,
  onViewModeChange,
}: ScheduleViewModeFilterProps) {
  return (
    <div className={s.viewModeFilter}>
      <button
        type="button"
        onClick={() => onViewModeChange('calendar')}
        className={`${s.viewModeFilter__button} ${viewMode === 'calendar' ? s.active : ''}`}
      >
        <Icon name="sort-grid" />
        <span className="sr-only">캘린더 뷰</span>
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange('list')}
        className={`${s.viewModeFilter__button} ${viewMode === 'list' ? s.active : ''}`}
      >
        <Icon name="sort-list" />
        <span className="sr-only">리스트 뷰</span>
      </button>
    </div>
  );
}
