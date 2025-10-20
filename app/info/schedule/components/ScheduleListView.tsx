import React, { useMemo, useState, useEffect } from 'react';
import { ScheduleItem } from '@/lib/notion';
import { formatTimeInfo } from '@/app/info/schedule/types/utils';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/info/schedule/Schedule.module.scss';

interface ScheduleListViewProps {
  scheduleData: ScheduleItem[];
  currentDate: Date;
  period: '1month' | '3months' | '6months' | '1year';
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
}

/**
 * 일정 리스트 뷰 컴포넌트
 * 일정이 있는 날짜만 표시하고 날짜별로 그룹화
 */
export default function ScheduleListView({
  scheduleData,
  currentDate,
  period,
  isLoading,
  isError,
  error,
  onPreviousMonth: _onPreviousMonth,
  onNextMonth: _onNextMonth,
  onGoToToday,
  onPreviousPeriod,
  onNextPeriod,
}: ScheduleListViewProps) {
  'use memo'; // React 컴파일러 최적화 적용

  // 아코디언 상태 관리 (기본적으로 모든 섹션 펼침)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set(['ongoing']));

  // 날짜 토글 함수
  const toggleDate = (dateKey: string) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  // 기간에 따른 날짜 범위 계산 (의미있는 구간으로)
  const dateRange = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case '1month':
        // 현재 월
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0); // 다음 달 0일 = 이번 달 마지막 날
        break;

      case '3months': {
        // 분기 (Q1: 1-3월, Q2: 4-6월, Q3: 7-9월, Q4: 10-12월)
        const quarter = Math.floor(month / 3);
        const quarterStartMonth = quarter * 3;
        startDate = new Date(year, quarterStartMonth, 1);
        endDate = new Date(year, quarterStartMonth + 3, 0);
        break;
      }

      case '6months': {
        // 반기 (상반기: 1-6월, 하반기: 7-12월)
        const halfYear = month < 6 ? 0 : 6; // 상반기(0) 또는 하반기(6)
        startDate = new Date(year, halfYear, 1);
        endDate = new Date(year, halfYear + 6, 0);
        break;
      }

      case '1year':
        // 전체 연도
        startDate = new Date(year, 0, 1); // 1월 1일
        endDate = new Date(year, 11, 31); // 12월 31일
        break;

      default:
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }, [currentDate, period]);

  // 기간 내의 일정 필터링 및 그룹화
  const { ongoingEvents, groupedScheduleData } = useMemo(() => {
    if (!scheduleData) return { ongoingEvents: [], groupedScheduleData: [] };

    // 기간과 겹치는 모든 일정 찾기
    const filteredData = scheduleData.filter((event) => {
      const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;

      // 일정이 기간과 겹치는지 확인
      return eventStartDate <= dateRange.endDate && eventEndDate >= dateRange.startDate;
    });

    // 이전 기간부터 시작된 일정과 기간 내 시작된 일정 분리
    const ongoingEvents: ScheduleItem[] = [];
    const periodEvents: ScheduleItem[] = [];

    filteredData.forEach((event) => {
      const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);

      if (eventStartDate < dateRange.startDate) {
        // 이전 기간부터 시작된 일정
        ongoingEvents.push(event);
      } else {
        // 기간 내 시작된 일정
        periodEvents.push(event);
      }
    });

    // 기간 내 일정을 날짜별로 그룹화
    const grouped = periodEvents.reduce(
      (acc, event) => {
        const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
        const dateKey = eventStartDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      },
      {} as Record<string, ScheduleItem[]>
    );

    // 날짜순으로 정렬
    const sortedGroupedData = Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, events]) => ({
        date: new Date(date),
        events: events.sort((a, b) => {
          const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return timeA - timeB;
        }),
      }));

    return {
      ongoingEvents: ongoingEvents.sort((a, b) => {
        const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return timeA - timeB;
      }),
      groupedScheduleData: sortedGroupedData,
    };
  }, [scheduleData, dateRange]);

  // 기간 내 일정들의 날짜 키들을 기본적으로 펼침 상태로 설정
  useEffect(() => {
    if (groupedScheduleData.length > 0) {
      const dateKeys = groupedScheduleData.map(({ date }) => date.toISOString().split('T')[0]);
      setExpandedDates((prev) => {
        const newSet = new Set(prev);
        dateKeys.forEach((key) => newSet.add(key));
        return newSet;
      });
    }
  }, [groupedScheduleData]);

  if (isLoading) {
    return (
      <div className={s.scheduleListContainer}>
        <div className={s.loadingState}>일정을 불러오는 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={s.scheduleListContainer}>
        <div className={s.errorState}>
          <p>일정을 불러오는데 실패했습니다.</p>
          <p>{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.scheduleListContainer}>
      <div className={s.calendarHeader}>
        <h2 className={s.calendarTitle}>리스트로 보기</h2>
        <div className={s.calendarNavigation}>
          <button className={s.navButton} onClick={onPreviousPeriod} aria-label="이전 기간">
            ←
          </button>
          <div
            className={s.currentMonth}
            dangerouslySetInnerHTML={{
              __html: (() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                switch (period) {
                  case '1month':
                    return currentDate.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                    });

                  case '3months': {
                    const quarter = Math.floor(month / 3) + 1;
                    const quarterStartMonth = Math.floor(month / 3) * 3;
                    const quarterEndMonth = quarterStartMonth + 2;
                    return `${year}년 Q${quarter}<span class="only-pc">분기 (${quarterStartMonth + 1}월~${quarterEndMonth + 1}월)</span>`;
                  }

                  case '6months': {
                    const halfYear = month < 6 ? '상' : '하';
                    const halfYearRange = month < 6 ? '1월~6월' : '7월~12월';
                    return `${year}년 ${halfYear}<span class="only-pc">반기 (${halfYearRange})</span>`;
                  }

                  case '1year':
                    return `${year}년`;

                  default:
                    return currentDate.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                    });
                }
              })(),
            }}
          />
          <button className={s.navButton} onClick={onNextPeriod} aria-label="다음 기간">
            →
          </button>
          <button className={s.navButton} onClick={onGoToToday} aria-label="오늘">
            오늘
          </button>
        </div>
      </div>

      <div className={s.scheduleListInfo}>
        <p className={s.scheduleListSubtitle}>
          총 <strong>{ongoingEvents.length + groupedScheduleData.length}일</strong>의 일정이
          있습니다
          {ongoingEvents.length > 0 && (
            <>
              {' '}
              (진행 중: <strong>{ongoingEvents.length}개</strong>)
            </>
          )}
        </p>
      </div>

      {ongoingEvents.length === 0 && groupedScheduleData.length === 0 ? (
        <div className={s.emptyState}>
          <p>선택한 기간에 일정이 없습니다.</p>
        </div>
      ) : (
        <div className={s.scheduleList}>
          {/* 진행 중인 일정 섹션 */}
          {ongoingEvents.length > 0 && (
            <div className={s.scheduleListDay}>
              <div
                className={s.scheduleListDayHeader}
                onClick={() => toggleDate('ongoing')}
                style={{ cursor: 'pointer' }}
              >
                <div className={s.scheduleListDayDate}>진행 중인 일정</div>
                <div className={s.scheduleListDayCount}>{ongoingEvents.length}개</div>
                <div className={s.accordionIcon}>
                  <Icon name={expandedDates.has('ongoing') ? 'arrow-down' : 'arrow-up'} />
                </div>
              </div>
              {expandedDates.has('ongoing') && (
                <div className={s.scheduleListEvents}>
                  {ongoingEvents.map((event) => {
                    const timeInfo = formatTimeInfo(event);
                    return (
                      <div
                        key={event.id}
                        className={`${s.scheduleListEvent} ${event.important ? s.important : ''} ${s.ongoingEvent}`}
                      >
                        <div className={s.scheduleListEventContent}>
                          <div className={s.scheduleListEventTitle}>{event.title}</div>
                          {timeInfo && <div className={s.scheduleListEventTime}>{timeInfo}</div>}
                          {event.location && (
                            <div className={s.scheduleListEventLocation}>📍 {event.location}</div>
                          )}
                          {event.tags && event.tags.length > 0 && (
                            <div className={s.scheduleListEventTags}>
                              {event.tags.map((tag, index) => (
                                <span key={index} className={s.scheduleListEventTag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 기간 내 일정 섹션 */}
          {groupedScheduleData.map(({ date, events }) => {
            const dateKey = date.toISOString().split('T')[0];
            const isExpanded = expandedDates.has(dateKey);

            return (
              <div key={date.toISOString()} className={s.scheduleListDay}>
                <div
                  className={s.scheduleListDayHeader}
                  onClick={() => toggleDate(dateKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={s.scheduleListDayDate}>
                    {date.toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                    {(() => {
                      const today = new Date();
                      const isToday =
                        date.getFullYear() === today.getFullYear() &&
                        date.getMonth() === today.getMonth() &&
                        date.getDate() === today.getDate();
                      return isToday ? ' (오늘)' : '';
                    })()}
                  </div>
                  <div className={s.scheduleListDayCount}>{events.length}개 일정</div>
                  <div className={s.accordionIcon}>
                    <Icon name={isExpanded ? 'arrow-down' : 'arrow-up'} />
                  </div>
                </div>
                {isExpanded && (
                  <div className={s.scheduleListEvents}>
                    {events.map((event) => {
                      const timeInfo = formatTimeInfo(event);
                      return (
                        <div
                          key={event.id}
                          className={`${s.scheduleListEvent} ${event.important ? s.important : ''}`}
                        >
                          <div className={s.scheduleListEventContent}>
                            <div className={s.scheduleListEventTitle}>{event.title}</div>
                            {timeInfo && <div className={s.scheduleListEventTime}>{timeInfo}</div>}
                            {event.location && (
                              <div className={s.scheduleListEventLocation}>📍 {event.location}</div>
                            )}
                            {event.tags && event.tags.length > 0 && (
                              <div className={s.scheduleListEventTags}>
                                {event.tags.map((tag, index) => (
                                  <span key={index} className={s.scheduleListEventTag}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
