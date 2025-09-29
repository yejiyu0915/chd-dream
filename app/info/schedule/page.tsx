'use client';

import React, { useEffect } from 'react';
import { usePageTitle } from '@/app/info/utils/title-context';
import s from '@/app/info/schedule/Schedule.module.scss';
import ScheduleCalendar from '@/app/info/schedule/components/ScheduleCalendar';

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
