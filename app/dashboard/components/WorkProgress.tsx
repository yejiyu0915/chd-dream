'use client';

import styles from '@/app/dashboard/Dashboard.module.scss';

// 작업 항목 타입 정의 (Depth4, 5 제거)
interface WorkItem {
  depth1: string;
  depth2: string;
  depth3: string;
  link: string;
  startDate: string;
  progress: 'not-started' | 'in-progress' | 'completed' | 'review';
  completionDate: string;
  notes: string;
}

export default function WorkProgress() {
  // 작업 항목 데이터 (Depth4, 5 제거)
  const workItems: WorkItem[] = [
    {
      depth1: 'common',
      depth2: 'Header',
      depth3: '',
      link: '/',
      startDate: '2025-08-26',
      progress: 'in-progress',
      completionDate: '',
      notes: '반응형 적용 필요, 각종 링크 수급 필요',
    },
    {
      depth1: '',
      depth2: 'Footer',
      depth3: '',
      link: '/',
      startDate: '2025-08-25',
      progress: 'completed',
      completionDate: '2025-09-11',
      notes: '접근성 체크 필요',
    },
    {
      depth1: '메인',
      depth2: 'KV',
      depth3: '',
      link: '/',
      startDate: '2025-08-26',
      progress: 'completed',
      completionDate: '2025-09-11',
      notes: '접근성 체크 필요',
    },
    {
      depth1: '',
      depth2: '이번 주 말씀',
      depth3: '',
      link: '/',
      startDate: '2025-08-26',
      progress: 'completed',
      completionDate: '2025-09-11',
      notes: '접근성 체크 필요',
    },
    {
      depth1: '',
      depth2: 'Intro',
      depth3: '',
      link: '/',
      startDate: '2025-08-26',
      progress: 'in-progress',
      completionDate: '',
      notes: '컨텐츠 수급 필요, 시나리오 필요',
    },
    {
      depth1: '',
      depth2: 'C-log',
      depth3: '',
      link: '/',
      startDate: '2025-08-26',
      progress: 'completed',
      completionDate: '2025-09-11',
      notes: '접근성 체크 필요',
    },
    {
      depth1: '',
      depth2: 'Quick Link',
      depth3: '',
      link: '/',
      startDate: '-',
      progress: 'completed',
      completionDate: '2025-09-11',
      notes: '접근성 체크 필요',
    },
    {
      depth1: '',
      depth2: 'Instagram',
      depth3: '',
      link: '/',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'Instagram 계정 연동 필요',
    },
    {
      depth1: '교회 소개',
      depth2: '비전',
      depth3: '',
      link: '/about/vision',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '시나리오 필요',
    },
    {
      depth1: '',
      depth2: '담임 목사 소개',
      depth3: '',
      link: '/about/pastor',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '교구 소개',
      depth3: '1 여선교',
      link: '/about/group/1-women',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '2 여선교',
      link: '/about/group/2-women',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '남선교',
      link: '/about/group/men',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '청년부',
      link: '/about/group/youth',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '학생부 + 유아부',
      link: '/about/group/student',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '새가족부',
      link: '/about/group/newfamily',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '섬기는 분들',
      depth3: '찬양단',
      link: '/about/servant/choir',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '식당 봉사',
      link: '/about/servant/kitchen',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '차량 봉사',
      link: '/about/servant/vehicle',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '꽃꽂이 봉사',
      link: '/about/servant/flower',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '컨텐츠 수급 필요',
    },
    {
      depth1: '예배 안내',
      depth2: '예배 시간표',
      depth3: '',
      link: '/worship/schedule',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '',
    },
    {
      depth1: '',
      depth2: '',
      depth3: '말씀과 찬양',
      link: '/worship/sermon',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'CMS 연동 필요',
    },
    {
      depth1: '교회 소식',
      depth2: 'NEWS',
      depth3: '',
      link: '/info/news',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'CMS 연동 필요',
    },
    {
      depth1: '',
      depth2: 'C-log',
      depth3: '',
      link: '/info/c-log',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'CMS 연동 필요',
    },
    {
      depth1: '',
      depth2: '영상',
      depth3: '',
      link: '/info/video',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'Youtube 채널 연동 필요',
    },
    {
      depth1: '',
      depth2: 'SNS',
      depth3: '',
      link: '/info/sns',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'Instagram 계정 연동 필요',
    },
    {
      depth1: '',
      depth2: '일정',
      depth3: '',
      link: '/info/schedule',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'CMS 연동 필요',
    },
    {
      depth1: '',
      depth2: '공지사항',
      depth3: '',
      link: '/info/notice',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: 'CMS 연동 필요',
    },
    {
      depth1: '오시는 길',
      depth2: '',
      depth3: '',
      link: '/location',
      startDate: '-',
      progress: 'not-started',
      completionDate: '',
      notes: '카카오 맵 연동 필요',
    },
  ];

  // 진행상황에 따른 스타일 클래스 반환
  const getProgressClass = (progress: WorkItem['progress']) => {
    switch (progress) {
      case 'not-started':
        return styles.notStarted;
      case 'in-progress':
        return styles.inProgress;
      case 'completed':
        return styles.completed;
      case 'review':
        return styles.review;
      default:
        return '';
    }
  };

  // 진행상황 텍스트 반환
  const getProgressText = (progress: WorkItem['progress']) => {
    switch (progress) {
      case 'not-started':
        return '시작 전';
      case 'in-progress':
        return '진행 중';
      case 'completed':
        return '완료';
      case 'review':
        return '검토 중';
      default:
        return '';
    }
  };

  // 완료된 작업인지 확인하는 함수
  const isCompletedTask = (item: WorkItem) => {
    if (item.progress !== 'completed' || !item.completionDate) {
      return false;
    }

    const completionDate = new Date(item.completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시작

    return completionDate <= today;
  };

  return (
    <section className={styles.section}>
      <h2>작업 진행 현황</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Depth 1</th>
              <th>Depth 2</th>
              <th>Depth 3</th>
              <th>링크</th>
              <th>작업시작일</th>
              <th>진행사항</th>
              <th>작업완료일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((item, index) => {
              const isCompleted = isCompletedTask(item);
              return (
                <tr key={index} className={isCompleted ? styles.completedRow : ''}>
                  <td className={styles.workNumber}>{index + 1}</td>
                  <td className={styles.depth1}>{item.depth1}</td>
                  <td className={styles.depth2}>{item.depth2}</td>
                  <td className={styles.depth3}>{item.depth3}</td>
                  <td className={styles.link}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.link}
                    </a>
                  </td>
                  <td>{item.startDate}</td>
                  <td>
                    <span className={`${styles.progress} ${getProgressClass(item.progress)}`}>
                      {getProgressText(item.progress)}
                    </span>
                  </td>
                  <td>{item.completionDate || '-'}</td>
                  <td className={styles.notes} style={{ whiteSpace: 'pre-wrap' }}>
                    {item.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
