'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ScheduleItem } from '@/lib/notion';
import h from '@/common/components/layouts/Header/Header.module.scss';

/**
 * D-day 라벨을 계산하는 헬퍼 함수
 * 미래 일정에만 D-3, D-2, D-1, D-day 표시
 */
function getDDayLabel(event: ScheduleItem): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 일정의 시작일 가져오기
  const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
  eventStartDate.setHours(0, 0, 0, 0);

  // 과거 일정이면 라벨 표시 안 함
  if (eventStartDate < today) {
    return null;
  }

  // 날짜 차이 계산 (밀리초를 일 단위로 변환)
  const diffTime = eventStartDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 당일은 D-day
  if (diffDays === 0) {
    return 'D-day';
  }

  // D-3, D-2, D-1만 표시 (그 이상은 표시 안 함)
  if (diffDays <= 3 && diffDays > 0) {
    return `D-${diffDays}`;
  }

  return null;
}

/**
 * 모바일 헤더 하단 일정 미리보기 컴포넌트
 */
export default function MobileSchedulePreview() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 일정 데이터 가져오기
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/schedule');
        if (!response.ok) {
          throw new Error('일정 데이터를 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        setScheduleData(data || []);
        setError(null);
      } catch (err) {
        console.error('일정 데이터 가져오기 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
        setScheduleData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // 일정 필터링 및 정렬 (최대 2개)
  const topSchedules = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
      return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. 오늘의 일정
    const todayEvents: ScheduleItem[] = [];
    // 2. 진행중인 일정 (ongoing)
    const ongoingEvents: ScheduleItem[] = [];
    // 3. 다가올 미래 일정
    const futureEvents: ScheduleItem[] = [];

    scheduleData.forEach((event) => {
      const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
      eventStartDate.setHours(0, 0, 0, 0);

      // 오늘의 일정
      if (eventStartDate.getTime() === today.getTime()) {
        todayEvents.push(event);
      }
      // 진행중인 일정
      else if (event.ongoing) {
        ongoingEvents.push(event);
      }
      // 미래 일정
      else if (eventStartDate > today) {
        futureEvents.push(event);
      }
    });

    // 우선순위에 따라 정렬
    const result: ScheduleItem[] = [];

    // 1순위: 오늘의 일정
    if (todayEvents.length > 0) {
      result.push(...todayEvents.slice(0, 2 - result.length));
    }

    // 2순위: 진행중인 일정
    if (result.length < 2 && ongoingEvents.length > 0) {
      result.push(...ongoingEvents.slice(0, 2 - result.length));
    }

    // 3순위: 다가올 미래 일정 (가장 가까운 순으로 정렬)
    if (result.length < 2 && futureEvents.length > 0) {
      futureEvents.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : new Date(a.date).getTime();
        const dateB = b.startDate ? new Date(b.startDate).getTime() : new Date(b.date).getTime();
        return dateA - dateB;
      });
      result.push(...futureEvents.slice(0, 2 - result.length));
    }

    return result.slice(0, 2); // 최대 2개만 반환
  }, [scheduleData]);

  if (isLoading) {
    return null; // 로딩 중에는 표시하지 않음
  }

  if (error) {
    return null; // 에러 발생 시 표시하지 않음
  }

  // 일정이 없으면 영역 자체를 렌더링하지 않음
  if (topSchedules.length === 0) {
    return null;
  }

  return (
    <div className={h.mobileSchedulePreview}>
      <div className={h.mobileSchedulePreview__header}>
        <h3 className={h.mobileSchedulePreview__title}>
          <span className="sr-only">최신 일정</span>
        </h3>
      </div>
      <div className={h.mobileSchedulePreview__list}>
        {topSchedules.map((event) => {
          const dDayLabel = getDDayLabel(event);
          const isOngoing = event.ongoing;

          return (
            <Link
              key={event.id}
              href="/info/schedule"
              className={`${h.mobileSchedulePreview__item} ${event.important ? h.important : ''}`}
            >
              <div className={h.mobileSchedulePreview__itemHeader}>
                <div className={h.mobileSchedulePreview__itemTitle}>{event.title}</div>
                <div className={h.mobileSchedulePreview__itemLabels}>
                  {isOngoing && (
                    <span className={h.mobileSchedulePreview__itemOngoing}>진행중</span>
                  )}
                  {dDayLabel && (
                    <span className={h.mobileSchedulePreview__itemDDay}>{dDayLabel}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
