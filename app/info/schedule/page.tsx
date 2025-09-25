'use client';

import React, { useEffect } from 'react';
import { usePageTitle } from '@/app/info/utils/title-context';
import s from './Schedule.module.scss';
import ScheduleCalendar from './components/ScheduleCalendar';

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
