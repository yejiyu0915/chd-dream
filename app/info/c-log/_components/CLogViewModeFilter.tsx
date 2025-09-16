import React from 'react';
import c from '@/app/info/c-log/CLogList.module.scss';
import Icon from '@/common/components/utils/Icons'; // Icon 컴포넌트 임포트

interface CLogViewModeFilterProps {
  viewMode: 'grid' | 'list'; // 'grid' 또는 'list' 뷰 모드
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function CLogViewModeFilter({
  viewMode,
  onViewModeChange,
}: CLogViewModeFilterProps) {
  return (
    <div className={c.viewModeFilter}>
      {/* View Mode 버튼 자리 */}
      <button
        type="button"
        onClick={() => onViewModeChange('grid')}
        className={`${c.viewModeFilter__button} ${viewMode === 'grid' ? c.active : ''}`}
      >
        <Icon name="sort-grid" /> {/* Icon 컴포넌트 사용 */}
        <span className="sr-only">그리드 뷰</span>
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange('list')}
        className={`${c.viewModeFilter__button} ${viewMode === 'list' ? c.active : ''}`}
      >
        <Icon name="sort-list" /> {/* Icon 컴포넌트 사용 */}
        <span className="sr-only">리스트 뷰</span>
      </button>
    </div>
  );
}
