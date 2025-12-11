import React from 'react';
import { getScheduleData } from '@/lib/notion';
import ScheduleClientWrapper from '@/app/info/schedule/components/ScheduleClientWrapper';
import s from '@/app/info/schedule/Schedule.module.scss';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/schedule');

// 페이지를 동적 렌더링으로 강제 설정
export const dynamic = 'force-dynamic';

// 서버 컴포넌트 - 데이터를 서버에서 미리 fetch
export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string; period?: string; start?: string }>;
}) {
  // searchParams를 await로 받기 (Next.js 16 권장 방식)
  const params = await searchParams;

  // 서버에서 일정 데이터를 가져옴
  const scheduleData = await getScheduleData();

  return (
    <section className={s.scheduleMain}>
      <div className={`detail-inner`}>
        {/* 클라이언트 컴포넌트로 데이터와 searchParams 전달 */}
        <ScheduleClientWrapper initialScheduleData={scheduleData} searchParams={params} />
      </div>
    </section>
  );
}
