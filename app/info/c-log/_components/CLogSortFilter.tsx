import React from 'react';
import c from '@/app/info/c-log/CLogList.module.scss';
import Icon from '@/common/components/utils/Icons'; // Icon 컴포넌트 임포트

interface CLogSortFilterProps {
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}

export default function CLogSortFilter({ sortOrder, onSortChange }: CLogSortFilterProps) {
  return (
    <div className={c.sortFilter}>
      <button
        type="button"
        onClick={() => onSortChange('desc')}
        className={`${c.sortFilter__button} ${sortOrder === 'desc' ? c.active : ''}`}
      >
        <Icon name="sort-desc" /> {/* Icon 컴포넌트 사용 */}
        최신순
      </button>
      <button
        type="button"
        onClick={() => onSortChange('asc')}
        className={`${c.sortFilter__button} ${sortOrder === 'asc' ? c.active : ''}`}
      >
        <Icon name="sort-asc" /> {/* Icon 컴포넌트 사용 */}
        오래된순
      </button>
    </div>
  );
}
