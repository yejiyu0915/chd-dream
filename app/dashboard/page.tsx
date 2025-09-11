'use client';

import styles from '@/app/dashboard/Dashboard.module.scss';
import MainTask from '@/app/dashboard/components/MainTask';
import SB from '@/app/dashboard/components/SB';
import WorkProgress from '@/app/dashboard/components/WorkProgress';
import MeetingRecords from '@/app/dashboard/components/MeetingRecords';
import ResourceStatus from '@/app/dashboard/components/ResourceStatus';

// Dashboard 페이지에서 header와 footer 숨기기
const hideHeaderFooter = `
  header,footer {
    display: none !important;
  }

  .wrapper {
    padding: 0 !important;
  }
`;

export default function Dashboard() {
  return (
    <>
      <style jsx global>
        {hideHeaderFooter}
      </style>
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>순복음인천초대교회</h1>
            <h2>홈페이지 제작 프로젝트</h2>
            <p>마지막 업데이트: 2025년 9월 11일</p>
          </div>

          <MainTask />
          <SB />
          <WorkProgress />
          <MeetingRecords />
          <ResourceStatus />
        </div>
      </div>
    </>
  );
}
