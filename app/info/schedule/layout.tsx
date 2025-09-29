import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getScheduleData } from '@/lib/notion';
import React from 'react';

interface ScheduleLayoutProps {
  children: React.ReactNode;
}

export default async function ScheduleLayout({ children }: ScheduleLayoutProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['schedule-list'],
    queryFn: () => getScheduleData(),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
