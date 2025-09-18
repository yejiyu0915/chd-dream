'use client';

import React from 'react';
import Link from 'next/link';
import Spinner from '@/common/components/utils/Spinner';
import n from '@/app/info/news/NewsList.module.scss'; // NewsList.module.scss 사용
import { NewsItem } from '@/lib/notion'; // NewsItem 인터페이스 임포트
import Button from '@/common/components/utils/Button'; // Button 컴포넌트 임포트

// 임시 뉴스 아이템 타입 (page.tsx에서 정의된 NewsItem과 일치)
interface NewsListDisplayProps {
  newsData: NewsItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// const MOBILE_BREAKPOINT = 768; // 모바일 기준 (px) - 제거

export default function NewsListDisplay({
  newsData,
  isLoading,
  isError,
  error,
}: NewsListDisplayProps) {
  // const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false); // 제거
  // React.useEffect(() => { // 제거
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
  //   };
  //   checkMobile(); // 클라이언트에서 마운트될 때 한 번 실행
  //   window.addEventListener('resize', checkMobile);
  //   return () => {
  //     window.removeEventListener('resize', checkMobile);
  //   };
  // }, []); // 제거

  // 서버 렌더링 시에는 항상 PC 기본값을 사용하고, 클라이언트에서 isMobile 상태에 따라 동적으로 결정
  const initialDisplayCount = 8; // 초기에 보여줄 뉴스 개수 (모바일/PC 통일)
  const loadMoreCount = 8; // 더보기 버튼 클릭 시 추가로 로드할 뉴스 개수 (모바일/PC 통일)

  const [displayLimit, setDisplayLimit] = React.useState(initialDisplayCount);

  // isMobile 값 또는 initialDisplayCount 값 변경 시 displayLimit 초기화 - 제거
  // React.useEffect(() => {
  //   setDisplayLimit(initialDisplayCount); // 모바일/PC 전환 시 초기화
  // }, [initialDisplayCount]); // isMobile 대신 initialDisplayCount를 의존성으로

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + loadMoreCount);
  };

  if (isLoading) {
    return (
      <div className={n.newsList}>
        <div className={n.loadingState}>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    let errorMessage = '뉴스 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={n.newsList}>
        <div className={n.error}>{errorMessage}</div>
      </div>
    );
  }

  const displayedNews = newsData ? newsData.slice(0, displayLimit) : [];
  const hasMore = newsData && displayedNews.length < newsData.length;

  return (
    <div className={n.newsList}>
      {' '}
      {/* cLogList 대신 newsList 클래스 사용 */}
      <div className={`detail-inner`}>
        {newsData && newsData.length > 0 ? (
          <>
            <ul className={n.list}>
              {' '}
              {/* 리스트 뷰로 고정, c.list--${_viewMode} 대신 n.list 사용 */}
              {displayedNews.map((item, _index) => (
                <li key={item.id} className={n.list__item}>
                  <Link href={item.link || '#'} className={n.list__link}>
                    <span className={n.list__index}>
                      {newsData.length - newsData.indexOf(item)}
                    </span>{' '}
                    {/* 순번 표시 (원본 newsData 배열에서의 인덱스 사용) */}
                    <div className={n.list__content}>
                      <h3 className={n.list__title}>{item.title}</h3>
                      <span className={n.list__date}>{item.date}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {hasMore && (
              <div className="load-more-wrapper">
                <Button onClick={handleLoadMore} className="load-more-button" icon="arrow-down">
                  더보기
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className={n.emptyMessage}>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
