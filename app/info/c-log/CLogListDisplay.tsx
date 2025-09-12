'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CLogItem } from '@/lib/notion';
import CLogSkeleton from '@/app/main/c-log/CLogSkeleton';
import c from '@/app/info/c-log/CLogList.module.scss'; // infoLayout.module.scss 사용

interface CLogListDisplayProps {
  cLogData: CLogItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const PC_ITEMS_PER_LOAD = 6; // PC 버전에서 한 번에 불러올 아이템 개수
const MO_ITEMS_PER_LOAD = 4; // 모바일 버전에서 한 번에 불러올 아이템 개수

export default function CLogListDisplay({
  cLogData,
  isLoading,
  isError,
  error,
}: CLogListDisplayProps) {
  const [itemsPerPage, setItemsPerPage] = useState(PC_ITEMS_PER_LOAD);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 모바일 기준 (예: 768px 미만)
        setItemsPerPage(MO_ITEMS_PER_LOAD);
      } else {
        // PC 기준 (예: 768px 이상)
        setItemsPerPage(PC_ITEMS_PER_LOAD);
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // itemsPerPage가 변경될 때 visibleItemCount 초기화 및 cLogData 로드 시점 조정
  useEffect(() => {
    if (cLogData && cLogData.length > 0) {
      setVisibleItemCount(Math.min(itemsPerPage, cLogData.length));
    } else if (cLogData && cLogData.length === 0) {
      setVisibleItemCount(0);
    } else {
      setVisibleItemCount(itemsPerPage); // 데이터가 로드되기 전 초기 값 설정
    }
  }, [itemsPerPage, cLogData]);

  const handleLoadMore = () => {
    setVisibleItemCount((prevCount) => {
      const newCount = prevCount + itemsPerPage;
      return cLogData ? Math.min(newCount, cLogData.length) : newCount;
    });
  };

  const hasMoreItems = cLogData && visibleItemCount < cLogData.length;

  // 디버깅을 위한 console.log 추가 (임시)
  // console.log('CLogListDisplay Debug:', {
  //   cLogDataLength: cLogData?.length,
  //   visibleItemCount,
  //   itemsPerPage,
  //   hasMoreItems,
  // });

  if (isLoading) {
    return (
      <div className={c.cLogListDisplay}>
        <div className={c.inner}>
          {/* <h2>C-log 로딩 중...</h2> */}
          <ul className={c.list}>
            {/* 로딩 시 실제 데이터 개수 대신 itemsPerPage 만큼 스켈레톤 렌더링 */}
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <CLogSkeleton key={index} />
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (isError) {
    let errorMessage = 'C-log 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={c.cLogListDisplay}>
        <div className={c.inner}>
          <p className={c.error}>에러: {errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={c.cLogListDisplay}>
      <div className={`detail-inner`}>
        {cLogData && cLogData.length > 0 ? (
          <>
            <ul className={c.list}>
              {cLogData.slice(0, visibleItemCount).map((item) => (
                <li key={item.id} className={c.list__item}>
                  <Link href={item.link || '#'} className={c.list__link}>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || 'C-log 이미지'}
                        width={500}
                        height={300}
                        className={c.list__image}
                      />
                    )}
                    <div className={c.list__content}>
                      <h3 className={c.list__title}>{item.title}</h3>
                      {item.description && <p>{item.description}</p>}
                      <div className={c.list__info}>
                        {item.category && <span className={c.list__category}>{item.category}</span>}
                        {item.date && <span className={c.list__date}>{item.date}</span>}
                      </div>
                      <div className={c.list__tag}>
                        {item.tags &&
                          item.tags.map((tag) => (
                            <span key={tag} className={c.list__tagItem}>
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {hasMoreItems && (
              <div className={c.loadMoreWrapper}>
                <button type="button" onClick={handleLoadMore} className={c.loadMoreButton}>
                  더보기
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={c.emptyMessage}>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
