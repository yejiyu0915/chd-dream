import React from 'react';
import c from './CLogList.module.scss'; // 동일한 SCSS 모듈 사용

interface CLogCategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  // categoryCounts: Record<string, number>; // 개수 표기 제거로 인한 prop 삭제
}

export default function CLogCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  // categoryCounts, // 개수 표기 제거로 인한 prop 삭제
}: CLogCategoryFilterProps) {
  return (
    <div className={`${c.categoryFilter} detail-inner`}>
      {' '}
      {/* 새로운 categoryFilter 스타일 */}
      <ul className={c.categoryFilter__list}>
        {' '}
        {/* 새로운 categoryFilter__list 스타일 */}
        <li className={c.categoryFilter__item}>
          {' '}
          {/* 새로운 categoryFilter__item 스타일 */}
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`${c.categoryFilter__button} ${!selectedCategory ? c.active : ''}`} // 새로운 categoryFilter__button, active 스타일
          >
            ALL
            {/* <span className={c.tagFilter__count}>({categoryCounts['전체보기'] || 0})</span> */}
          </button>
        </li>
        {categories.map((category) => (
          <li key={category} className={c.categoryFilter__item}>
            <button
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`${c.categoryFilter__button} ${selectedCategory === category ? c.active : ''}`}
            >
              {category}
              {/* <span className={c.tagFilter__count}>({categoryCounts[category] || 0})</span> */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
