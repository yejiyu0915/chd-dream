'use client';

import React, { memo } from 'react';
import { ScheduleItem } from '@/lib/notion';
import { ScheduleProvider } from '@/app/info/schedule/context/ScheduleContext';
import { useScheduleContext } from '@/app/info/schedule/context/ScheduleContext';
import ScheduleCalendarView from '@/app/info/schedule/components/ScheduleCalendarView';
import ScheduleViewModeFilter from '@/app/info/schedule/components/ScheduleViewModeFilter';
import SchedulePeriodFilter from '@/app/info/schedule/components/SchedulePeriodFilter';
import s from '@/app/info/schedule/Schedule.module.scss';

interface ScheduleClientWrapperProps {
  initialScheduleData: ScheduleItem[];
  searchParams: { view?: string; date?: string; period?: string; start?: string };
}

// 필터 컴포넌트 (Context 사용) - 수동 최적화
const ScheduleFilters = memo(function ScheduleFilters() {
  const { viewMode, period, setViewMode, setPeriod } = useScheduleContext();

  return (
    <div className={s.filterGroup}>
      <ScheduleViewModeFilter viewMode={viewMode} onViewModeChange={setViewMode} />
      {viewMode === 'list' && <SchedulePeriodFilter period={period} onPeriodChange={setPeriod} />}
    </div>
  );
});

// 메인 일정 컨텐츠 (서버에서 받은 데이터만 사용) - 수동 최적화
const ScheduleContent = memo(function ScheduleContent({
  scheduleData,
}: {
  scheduleData: ScheduleItem[];
}) {
  return (
    <>
      <ScheduleFilters />
      <ScheduleCalendarView scheduleData={scheduleData} />
    </>
  );
});

// 클라이언트 래퍼 (Provider 포함)
export default function ScheduleClientWrapper({
  initialScheduleData,
  searchParams,
}: ScheduleClientWrapperProps) {
  return (
    <ScheduleProvider searchParams={searchParams}>
      <ScheduleContent scheduleData={initialScheduleData} />
    </ScheduleProvider>
  );
}
