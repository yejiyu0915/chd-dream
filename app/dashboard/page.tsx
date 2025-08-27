'use client';

import styles from './Dashboard.module.scss';
import MainTask from './components/MainTask';
import SB from './components/SB';
import WorkProgress from './components/WorkProgress';
import MeetingRecords from './components/MeetingRecords';
import ResourceStatus from './components/ResourceStatus';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>순복음인천초대교회</h1>
          <h2>홈페이지 제작 프로젝트</h2>
          <p>마지막 업데이트: 2025년 8월 27일</p>
        </div>

        <MainTask />
        <SB />
        <WorkProgress />
        <MeetingRecords />
        <ResourceStatus />
      </div>
    </div>
  );
}
