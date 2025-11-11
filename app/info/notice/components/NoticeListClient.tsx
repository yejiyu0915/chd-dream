'use client';

import React from 'react';
import n from '@/app/info/notice/NoticeList.module.scss';
import NoticeListDisplay from '@/app/info/notice/components/NoticeListDisplay';
import { NoticeItem } from '@/lib/notion';

interface NoticeListClientProps {
  initialNoticeData: NoticeItem[];
}

export default function NoticeListClient({ initialNoticeData }: NoticeListClientProps) {
  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const noticeData = initialNoticeData;

  return (
    <section className={n.noticeListMain}>
      <div className={n.noticeListInner}>
        <NoticeListDisplay
          noticeData={noticeData}
          isLoading={false}
          isError={false}
          error={null}
        />
      </div>
    </section>
  );
}
