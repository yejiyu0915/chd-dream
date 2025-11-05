import React, { Suspense } from 'react';
import { getScheduleData } from '@/lib/notion';
import s from '@/app/info/schedule/Schedule.module.scss';
import ScheduleCalendarClient from '@/app/info/schedule/components/ScheduleCalendarClient';
import ScheduleSkeleton from '@/app/info/schedule/components/ScheduleSkeleton';

// 데이터 로딩 컴포넌트 (Suspense 내부에서 실행)
async function ScheduleContent() {
  // 서버에서 일정 데이터를 가져옴
  const scheduleData = await getScheduleData();

  return (
    <div className={`detail-inner`}>
      <ScheduleCalendarClient initialScheduleData={scheduleData} />
    </div>
  );
}

// 메인 페이지 컴포넌트 (InfoLayout이 자동으로 제목 설정)
export default function SchedulePage() {
  return (
    <section className={s.scheduleMain}>
      {/* Streaming: 데이터 로딩 중 스켈레톤 표시 */}
      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleContent />
      </Suspense>
    </section>
  );
}
