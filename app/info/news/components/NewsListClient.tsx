'use client';

import React from 'react';
import n from '@/app/info/news/NewsList.module.scss';
import NewsListDisplay from '@/app/info/news/components/NewsListDisplay';
import { NewsItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';

interface NewsListClientProps {
  initialNewsData: NewsItem[];
}

export default function NewsListClient({ initialNewsData }: NewsListClientProps) {
  // 서버에서 받은 데이터를 initialData로 사용
  const {
    data: newsData,
    isLoading,
    isError,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ['news-list'],
    queryFn: async () => {
      const response = await fetch('/api/news-list');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    initialData: initialNewsData, // 서버에서 받은 데이터를 초기값으로 사용 (즉시 렌더링)
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (재fetch 방지)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
