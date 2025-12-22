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

  // 초기 데이터 존재 여부 확인
  const hasInitialData = !!initialNoticeData && initialNoticeData.length > 0;

  // 데이터가 아직 로드되지 않았는지 확인 (undefined인 경우만 로딩으로 간주)
  // 빈 배열([])은 데이터가 로드되었지만 결과가 없는 것으로 간주
  const isInitialLoading = initialNoticeData === undefined;

  return (
    <section className={n.noticeListMain}>
      <div className={n.noticeListInner}>
        <NoticeListDisplay
          noticeData={noticeData}
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
