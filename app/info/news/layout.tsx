import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getNewsPosts } from '@/lib/notion';
import React from 'react';

interface NewsLayoutProps {
  children: React.ReactNode;
}

export default async function NewsLayout({ children }: NewsLayoutProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['news-list'],
    queryFn: () => getNewsPosts('NOTION_NEWS_ID'),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
