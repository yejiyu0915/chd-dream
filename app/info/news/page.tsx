'use client';

import React, { useEffect } from 'react';
import { usePageTitle } from '@/app/info/utils/title-context';
import n from '@/app/info/news/NewsList.module.scss'; // NewsList.module.scss 사용
import NewsListDisplay from './components/NewsListDisplay'; // NewsListDisplay 컴포넌트 임포트
import { NewsItem } from '@/lib/notion'; // NewsItem 인터페이스 임포트
import { useQuery } from '@tanstack/react-query'; // useQuery 임포트

// 임시 뉴스 아이템 타입 (API 연결 전 디자인용)

// 임시 데이터 (디자인 목적으로만 사용)

export default function NewsListPage() {
  const { setPageTitle } = usePageTitle();
  // setPageTitle은 클라이언트 훅이므로 useEffect 내에서 호출
  useEffect(() => {
    setPageTitle('뉴스');
  }, [setPageTitle]);

  // 클라이언트에서 useQuery로 데이터 가져오기 (서버에서 prefetch된 데이터를 사용)
  const {
    data: newsData,
    isLoading,
    isError,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ['news-list'],
    queryFn: () => Promise.resolve([]), // 데이터를 이미 prefetch했으므로 빈 배열을 반환 (실제 호출은 발생하지 않음)
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
