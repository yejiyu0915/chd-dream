'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePageTitle } from '@/app/info/utils/title-context';
import s from '@/app/info/schedule/Schedule.module.scss';
import ScheduleLoading from '@/app/info/schedule/loading';

// 코드 스플리팅: ScheduleCalendar를 필요할 때만 로드
// dynamic import 자체가 Suspense를 내부적으로 처리하므로 추가 Suspense 불필요
const ScheduleCalendar = dynamic(() => import('@/app/info/schedule/components/ScheduleCalendar'), {
  loading: () => <ScheduleLoading />,
  ssr: false, // 클라이언트에서만 렌더링
});

export default function SchedulePage() {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('일정');
  }, [setPageTitle]);

  return (
    <section className={s.scheduleMain}>
      <div className={`detail-inner`}>
        <ScheduleCalendar />
      </div>
    </section>
  );
}
