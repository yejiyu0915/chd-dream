'use client';

import React from 'react';
import n from '@/app/info/news/NewsList.module.scss';
import NewsListDisplay from '@/app/info/news/components/NewsListDisplay';
import { NewsItem } from '@/lib/notion';

interface NewsListClientProps {
  initialNewsData: NewsItem[];
}

export default function NewsListClient({ initialNewsData }: NewsListClientProps) {
  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const newsData = initialNewsData;

  return (
    <section className={n.newsListMain}>
      <div className={n.newsListInner}>
        <NewsListDisplay newsData={newsData} isLoading={false} isError={false} error={null} />
      </div>
    </section>
  );
}
