'use client';

import styles from '@/app/dashboard/Dashboard.module.scss';

// 자료수급 타입 정의 (id 제거)
interface ResourceStatus {
  resourceName: string;
  priority: 'high' | 'mid' | 'low';
  requiredDate: string;
  status: 'pending' | 'received' | 'reviewed';
  receivedDate: string;
  provider: string;
  notes: string;
}

export default function ResourceStatus() {
  // 자료수급 데이터 (id 제거, 배열 인덱스 기반)
  const resources: ResourceStatus[] = [
    {
      resourceName: '교회 심볼 로고 (고해상도)',
      priority: 'high',
      requiredDate: '2025-08-24',
      status: 'received',
      receivedDate: '2025-08-24',
      provider: '전도사님',
      notes: 'SVG 파일, 2가지 버전, 색상 변경 가능',
    },
    {
      resourceName: '목사님 사진',
      priority: 'high',
      requiredDate: '2025-08-24',
      status: 'received',
      receivedDate: '2025-08-24',
      provider: '전도사님',
      notes: '프로필 사진 1장 제공',
    },
    {
      resourceName: '전도지',
      priority: 'low',
      requiredDate: '2025-08-24',
      status: 'received',
      receivedDate: '2025-08-24',
      provider: '전도사님',
      notes: '11장',
    },
    {
      resourceName: 'Notion 계정',
      priority: 'high',
      requiredDate: '2025-08-24',
      status: 'received',
      receivedDate: '2025-08-24',
      provider: '전도사님',
      notes: 'CMS로 사용',
    },
    {
      resourceName: 'Youtube 채널 계정',
      priority: 'mid',
      requiredDate: '2025-08-28',
      status: 'received',
      receivedDate: '2025-08-28',
      provider: '전도사님',
      notes: 'https://youtube.com/channel/UCMxS1A66oRGM6038-6m52uA',
    },
    {
      resourceName: 'Instagram 계정',
      priority: 'mid',
      requiredDate: '2025-08-28',
      status: 'received',
      receivedDate: '2025-08-28',
      provider: '전도사님',
      notes: 'https://www.instagram.com/chd_dream',
    },
    {
      resourceName: '네이버 밴드(사진용)',
      priority: 'mid',
      requiredDate: '2025-08-28',
      status: 'received',
      receivedDate: '2025-08-28',
      provider: '전도사님',
      notes: '',
    },
    {
      resourceName: '카카오 Map key',
      priority: 'mid',
      requiredDate: '-',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님',
      notes: '오시는 길 용',
    },
    {
      resourceName: 'KV용 사진',
      priority: 'high',
      requiredDate: '2025-08-24',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님',
      notes: '',
    },
    {
      resourceName: '메인 페이지 문구 수급',
      priority: 'high',
      requiredDate: '2025-08-24',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님',
      notes: '',
    },
    {
      resourceName: 'C-log 컨텐츠 수급',
      priority: 'mid',
      requiredDate: '-',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님, 집사님들',
      notes: '',
    },
    {
      resourceName: '비전 페이지 시나리오',
      priority: 'mid',
      requiredDate: '2025-08-24',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님',
      notes: '',
    },
    {
      resourceName: '담임 목사 소개 페이지 컨텐츠',
      priority: 'mid',
      requiredDate: '2025-08-24',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님',
      notes: '',
    },
    {
      resourceName: '교구 소개 페이지 컨텐츠',
      priority: 'mid',
      requiredDate: '2025-08-24',
      status: 'pending',
      receivedDate: '',
      provider: '전도사님',
      notes: '',
    },
  ];

  // 우선순위에 따른 스타일 클래스 반환
  const getPriorityClass = (priority: ResourceStatus['priority']) => {
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
  const getPriorityText = (priority: ResourceStatus['priority']) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'mid':
        return 'Mid';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };

  // 상태에 따른 스타일 클래스 반환
  const getStatusClass = (status: ResourceStatus['status']) => {
    switch (status) {
      case 'pending':
        return styles.pending;
      case 'received':
        return styles.received;
      case 'reviewed':
        return styles.reviewed;
      default:
        return '';
    }
  };

  // 상태 텍스트 반환
  const getStatusText = (status: ResourceStatus['status']) => {
    switch (status) {
      case 'pending':
        return '대기 중';
      case 'received':
        return '수급 완료';
      case 'reviewed':
        return '검토 완료';
      default:
        return '';
    }
  };

  // 완료된 자료인지 확인하는 함수
  const isCompletedResource = (resource: ResourceStatus) => {
    if (resource.status !== 'received' || !resource.receivedDate) {
      return false;
    }
    const receivedDate = new Date(resource.receivedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return receivedDate <= today;
  };

  return (
    <section className={styles.section}>
      <h2>자료수급 현황</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>자료명</th>
              <th>우선 순위</th>
              <th>요청일</th>
              <th>상태</th>
              <th>수급완료일</th>
              <th>제공자</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, index) => {
              const isCompleted = isCompletedResource(resource);
              return (
                <tr key={index} className={isCompleted ? styles.completedRow : ''}>
                  <td className={styles.resourceNumber}>{index + 1}</td>
                  <td className={styles.resourceName}>{resource.resourceName}</td>
                  <td>
                    <span className={`${styles.priority} ${getPriorityClass(resource.priority)}`}>
                      {getPriorityText(resource.priority)}
                    </span>
                  </td>
                  <td>{resource.requiredDate}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(resource.status)}`}>
                      {getStatusText(resource.status)}
                    </span>
                  </td>
                  <td>{resource.receivedDate || '-'}</td>
                  <td>{resource.provider}</td>
                  <td className={styles.notes}>{resource.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
