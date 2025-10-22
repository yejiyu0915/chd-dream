'use client';

import React, { useEffect } from 'react';
import { usePageTitle } from '@/app/info/utils/title-context';
import n from '@/app/info/notice/NoticeList.module.scss';
import NoticeListDisplay from '@/app/info/notice/components/NoticeListDisplay';
import { NoticeItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';

export default function NoticeListPage() {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('공지사항');
  }, [setPageTitle]);

  const {
    data: noticeData,
    isLoading,
    isError,
    error,
  } = useQuery<NoticeItem[]>({
    queryKey: ['notice-list'],
    queryFn: async () => {
      const response = await fetch('/api/notice-list');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <section className={n.noticeListMain}>
      <div className={n.noticeListInner}>
        <NoticeListDisplay
          noticeData={noticeData}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </section>
  );
}
