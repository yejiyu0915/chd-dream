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

  // 초기 데이터 존재 여부 확인
  const hasInitialData = !!initialNewsData && initialNewsData.length > 0;

  // 데이터가 아직 로드되지 않았는지 확인 (undefined인 경우만 로딩으로 간주)
  // 빈 배열([])은 데이터가 로드되었지만 결과가 없는 것으로 간주
  const isInitialLoading = initialNewsData === undefined;

  return (
    <section className={n.newsListMain}>
      <div className={n.newsListInner}>
        <NewsListDisplay
          newsData={newsData}
          isLoading={isInitialLoading}
          isError={false}
          error={null}
          hasInitialData={hasInitialData}
          hasAllData={hasInitialData}
        />
      </div>
    </section>
  );
}
