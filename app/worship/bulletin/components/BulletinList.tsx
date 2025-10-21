'use client';

import React from 'react';
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
}

export default function BulletinList({
  loading,
  currentItems,
  selectedBulletin,
  totalPages,
  currentPage,
  onBulletinClick,
  onPageChange,
  formatDate,
}: BulletinListProps) {
  return (
    <div className={b.items}>
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
                  onClick={() => onBulletinClick(item)}
                >
                  <div className={b.item__info}>
                    <div className={b.item__date}>
                      <span className={b.item__dateMain}>{formattedDate.date}</span>
                      {formattedDate.weekInfo && (
                        <span className={b.item__dateWeek}>{formattedDate.weekInfo}</span>
                      )}
                    </div>
                    <h3 className={b.item__title}>{item.title}</h3>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className={b.items__controls}>
              <button
                className={b.control__prev}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>

              <div className={b.control__pages}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`${b.control__page} ${currentPage === page ? b.control__pageActive : ''}`}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className={b.control__next}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
