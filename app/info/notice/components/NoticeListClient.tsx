'use client';

import React from 'react';
import n from '@/app/info/notice/NoticeList.module.scss';
import NoticeListDisplay from '@/app/info/notice/components/NoticeListDisplay';
import { NoticeItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';

interface NoticeListClientProps {
  initialNoticeData: NoticeItem[];
}

export default function NoticeListClient({ initialNoticeData }: NoticeListClientProps) {
  // 서버에서 받은 데이터를 initialData로 사용
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
    initialData: initialNoticeData, // 서버에서 받은 데이터를 초기값으로 사용 (즉시 렌더링)
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (재fetch 방지)
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
