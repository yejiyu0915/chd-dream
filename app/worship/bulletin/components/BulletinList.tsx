'use client';

import React, { memo } from 'react';
import Spinner from '@/common/components/utils/Spinner';
import b from '@/app/worship/bulletin/Bulletin.module.scss';

interface BulletinItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  praise: string;
  slug: string;
  content?: string;
  thumbnail?: string;
}

interface BulletinListProps {
  loading: boolean;
  currentItems: BulletinItem[];
  selectedBulletin: BulletinItem | null;
  totalPages: number;
  currentPage: number;
  onBulletinClick: (item: BulletinItem) => void;
  onPageChange: (page: number) => void;
  formatDate: (dateString: string) => {
    date: string;
    weekInfo: string;
  };
  // 필터 관련 props
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onFilterApply: () => void;
  availableYears: string[];
  availableMonths: string[];
}

const BulletinList = memo(function BulletinList({
  loading,
  currentItems,
  selectedBulletin,
  totalPages,
  currentPage,
  onBulletinClick,
  onPageChange,
  formatDate,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onFilterApply,
  availableYears,
  availableMonths,
}: BulletinListProps) {
  // 페이지네이션 그룹 크기 (테스트용으로 쉽게 변경 가능)
  const PAGINATION_GROUP_SIZE = 3; // 테스트용: 3개씩 그룹화
  return (
    <div className={b.items}>
      {/* 필터 섹션 */}
      <div className={b.items__filters}>
        <div className={b.filter__group}>
          <label htmlFor="year-filter" className="sr-only">
            연도
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className={b.filter__select}
          >
            <option value="all">연도 전체</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        </div>

        <div className={b.filter__group}>
          <label htmlFor="month-filter" className="sr-only">
            월
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className={b.filter__select}
          >
            <option value="all">월 전체</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}월
              </option>
            ))}
          </select>
        </div>

        <button className={b.filter__apply} onClick={onFilterApply}>
          이동
        </button>
      </div>

      {loading ? (
        <div className={b.loading}>
          <Spinner />
          <span>로딩 중...</span>
        </div>
      ) : (
        <>
          <ul className={b.items__list}>
            {currentItems.map((item) => {
              const formattedDate = formatDate(item.date);
              return (
                <li
                  key={item.id}
                  className={`${b.items__item} ${selectedBulletin?.id === item.id ? b.items__itemActive : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => onBulletinClick(item)}
                    className={b.item__info}
                    tabIndex={0}
                  >
                    <div className={b.item__date}>
                      <span className={b.item__dateMain}>{formattedDate.date}</span>
                      {formattedDate.weekInfo && (
                        <span className={b.item__dateWeek}>{formattedDate.weekInfo}</span>
                      )}
                    </div>
                    <h3 className={b.item__title}>{item.title}</h3>
                  </button>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className={b.items__controls}>
              {/* 이전 그룹 버튼 (그룹 크기만큼 이동) */}
              <button
                className={b.control__prev}
                onClick={() => onPageChange(Math.max(1, currentPage - PAGINATION_GROUP_SIZE))}
                disabled={currentPage <= PAGINATION_GROUP_SIZE}
              >
                이전
              </button>

              <div className={b.control__pages}>
                {(() => {
                  const currentGroup = Math.ceil(currentPage / PAGINATION_GROUP_SIZE);
                  const startPage = (currentGroup - 1) * PAGINATION_GROUP_SIZE + 1;
                  const endPage = Math.min(startPage + PAGINATION_GROUP_SIZE - 1, totalPages);

                  const pages = [];

                  // 현재 그룹의 페이지들
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`${b.control__page} ${currentPage === i ? b.control__pageActive : ''}`}
                        onClick={() => onPageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }

                  // 다음 그룹이 있으면 ... 표시
                  if (endPage < totalPages) {
                    pages.push(
                      <button
                        key="ellipsis"
                        className={b.control__page}
                        onClick={() => onPageChange(Math.min(endPage + 1, totalPages))}
                      >
                        ...
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* 다음 그룹 버튼 (그룹 크기만큼 이동) */}
              <button
                className={b.control__next}
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + PAGINATION_GROUP_SIZE))
                }
                disabled={currentPage >= totalPages - PAGINATION_GROUP_SIZE + 1}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default BulletinList;
