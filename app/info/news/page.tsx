'use client';

import React, { useEffect } from 'react';
import { usePageTitle } from '@/app/info/utils/title-context';
import n from '@/app/info/news/NewsList.module.scss'; // NewsList.module.scss 사용
import NewsListDisplay from '@/app/info/news/components/NewsListDisplay'; // NewsListDisplay 컴포넌트 임포트
import { NewsItem } from '@/lib/notion'; // NewsItem 인터페이스 임포트
import { useQuery } from '@tanstack/react-query'; // useQuery 임포트

// 임시 뉴스 아이템 타입 (API 연결 전 디자인용)

// 임시 데이터 (디자인 목적으로만 사용)

export default function NewsListPage() {
  const { setPageTitle } = usePageTitle();
  // setPageTitle은 클라이언트 훅이므로 useEffect 내에서 호출
  useEffect(() => {
    setPageTitle('NEWS');
  }, [setPageTitle]);

  // 클라이언트에서 useQuery로 데이터 가져오기 (서버에서 prefetch된 데이터를 사용)
  const {
    data: newsData,
    isLoading,
    isError,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ['news-list'],
    queryFn: async () => {
      const response = await fetch('/api/news-list'); // 뉴스 리스트 전용 API 사용
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 0, // 캐시 사용하지 않음 - 항상 최신 데이터 가져오기
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    refetchOnWindowFocus: true, // 창 포커스 시 데이터 새로고침
    refetchOnMount: true, // 컴포넌트 마운트 시 데이터 새로고침
    refetchInterval: 1000 * 60 * 2, // 2분마다 자동 새로고침
  });

  return (
    <section className={n.newsListMain}>
      <div className={n.newsListInner}>
        <NewsListDisplay
          newsData={newsData}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </section>
  );
}
