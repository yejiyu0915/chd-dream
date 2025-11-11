import React from 'react';
import { getScheduleData } from '@/lib/notion';
import ScheduleClientWrapper from '@/app/info/schedule/components/ScheduleClientWrapper';
import s from '@/app/info/schedule/Schedule.module.scss';

// 서버 컴포넌트 - 데이터를 서버에서 미리 fetch
export default async function SchedulePage() {
  // 서버에서 일정 데이터를 가져옴
  const scheduleData = await getScheduleData();

  return (
    <section className={s.scheduleMain}>
      <div className={`detail-inner`}>
        {/* 클라이언트 컴포넌트로 데이터 전달 */}
        <ScheduleClientWrapper initialScheduleData={scheduleData} />
      </div>
    </section>
  );
}
