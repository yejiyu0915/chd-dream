'use client';

import { useState } from 'react';
import styles from '@/app/dashboard/Dashboard.module.scss';

// 미팅 기록 타입 정의
interface MeetingRecord {
  id: string;
  date: string;
  title: string;
  participants: string;
  summary: string;
  actionItems: string[];
}

export default function MeetingRecords() {
  // 각 미팅의 아코디언 상태 관리
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(new Set());

  // 미팅 기록 데이터
  const meetings: MeetingRecord[] = [
    {
      id: '1',
      date: '2025-08-24',
      title: '프로젝트 킥오프 미팅',
      participants: '유예지, 김하은(전도사)',
      summary: '프로젝트 범위 및 일정 논의, SB 0.1 버전 논의',
      actionItems: ['팀 꾸리기', '자료 수급 요청', 'Notion 계정 생성 요청'],
    },
    {
      id: '2',
      date: '2025-09-21',
      title: '컨텐츠 회의(예정)',
      participants: '유예지, 김하은(전도사), 김하은, 민지원, 김수현',
      summary: '홈페이지 컨텐츠 논의',
      actionItems: [],
    },
  ];

  // 개별 미팅 아코디언 토글 함수
  const toggleMeetingAccordion = (meetingId: string) => {
    const newExpanded = new Set(expandedMeetings);
    if (newExpanded.has(meetingId)) {
      newExpanded.delete(meetingId);
    } else {
      newExpanded.add(meetingId);
    }
    setExpandedMeetings(newExpanded);
  };

  return (
    <section className={styles.section}>
      <h2>회의 기록</h2>
      <div className={styles.meetingGrid}>
        {meetings.map((meeting) => {
          const isExpanded = expandedMeetings.has(meeting.id);
          return (
            <div key={meeting.id} className={styles.meetingCard}>
              <div
                className={styles.meetingCardHeader}
                onClick={() => toggleMeetingAccordion(meeting.id)}
              >
                <div className={styles.meetingHeader}>
                  <span className={styles.meetingDate}>{meeting.date}</span>
                  <h3>{meeting.title}</h3>
                </div>
                <span
                  className={`${styles.meetingAccordionIcon} ${isExpanded ? styles.expanded : ''}`}
                >
                  ▼
                </span>
              </div>

              <div className={`${styles.meetingCardContent} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.meetingContent}>
                  <p>
                    <strong>참석자:</strong> {meeting.participants}
                  </p>
                  <p>
                    <strong>요약:</strong> {meeting.summary}
                  </p>
                  <div className={styles.actionItems}>
                    <strong>핵심 Task:</strong>
                    <ul>
                      {meeting.actionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
