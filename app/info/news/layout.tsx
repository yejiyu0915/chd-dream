import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getNewsData } from '@/lib/notion';
import React from 'react';

interface NewsLayoutProps {
  children: React.ReactNode;
}

// 뉴스 상세페이지를 위한 generateStaticParams
export async function generateStaticParams() {
  const newsItems = await getNewsData();
  return newsItems.map((item) => ({
    slug: item.slug,
  }));
}

export default async function NewsLayout({ children }: NewsLayoutProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['news-list'],
    queryFn: () => getNewsData(), // 직접 함수 호출로 성능 개선
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
