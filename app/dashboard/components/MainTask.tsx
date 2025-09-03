'use client';

import styles from '@/app/dashboard/Dashboard.module.scss';

// 주요 Task 타입 정의 (id 제거)
interface MainTask {
  text: string;
  priority: 'high' | 'mid' | 'low';
  dueDate: string;
  progress: 'not-started' | 'in-progress' | 'completed' | 'review';
  completionDate: string;
  openDate: string;
  notes: string;
}

export default function MainTask() {
  // 주요 Task 데이터 (id 제거, 배열 인덱스 기반)
  const mainTasks: MainTask[] = [
    {
      text: '메인 페이지 완성',
      priority: 'high',
      dueDate: '2025-09-24',
      progress: 'in-progress',
      completionDate: '',
      openDate: '2025-10 중순 예정',
      notes: '10월 중순에 전도지 제작, QR 코드로 연결 필요',
    },
    {
      text: 'Notion API 연결',
      priority: 'high',
      dueDate: '2025-09-24',
      progress: 'in-progress',
      completionDate: '',
      openDate: '2026-01-01',
      notes: '캘린더 기능 가능 여부 확인 필요',
    },
    {
      text: '교회 소개 페이지 콘텐츠 수집',
      priority: 'mid',
      dueDate: '2025-09-24',
      progress: 'not-started',
      completionDate: '',
      openDate: '2025-10 중순 예정',
      notes: '10월 중순에 전도지 제작, QR 코드로 연결 필요',
    },
    {
      text: '반응형 디자인 최적화_1차',
      priority: 'mid',
      dueDate: '2025-09-24',
      progress: 'not-started',
      completionDate: '',
      openDate: '2025-10 중순 예정',
      notes: '10월 중순 페이지 우선 적용',
    },
  ];

  // 우선순위에 따른 스타일 클래스 반환
  const getPriorityClass = (priority: MainTask['priority']) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'mid':
        return styles.priorityMid;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  // 우선순위 텍스트 반환
  const getPriorityText = (priority: MainTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'HIGH';
      case 'mid':
        return 'MID';
      case 'low':
        return 'LOW';
      default:
        return '';
    }
  };

  // 진행상황에 따른 스타일 클래스 반환
  const getProgressClass = (progress: MainTask['progress']) => {
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
  const getProgressText = (progress: MainTask['progress']) => {
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
  const isCompletedTask = (task: MainTask) => {
    if (task.progress !== 'completed' || !task.completionDate) {
      return false;
    }
    const completionDate = new Date(task.completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return completionDate <= today;
  };

  return (
    <section className={styles.section}>
      <h2>주요 Task</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Task</th>
              <th>우선 순위</th>
              <th>마감 예정일</th>
              <th>진행사항</th>
              <th>작업완료일</th>
              <th>오픈일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {mainTasks.map((task, index) => {
              const isCompleted = isCompletedTask(task);
              return (
                <tr key={index} className={isCompleted ? styles.completedRow : ''}>
                  <td className={styles.taskNumber}>{index + 1}</td>
                  <td className={styles.taskText}>{task.text}</td>
                  <td>
                    <span className={`${styles.priority} ${getPriorityClass(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                  </td>
                  <td>{task.dueDate}</td>
                  <td>
                    <span className={`${styles.progress} ${getProgressClass(task.progress)}`}>
                      {getProgressText(task.progress)}
                    </span>
                  </td>
                  <td>{task.completionDate || '-'}</td>
                  <td>{task.openDate}</td>
                  <td className={styles.notes}>{task.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
