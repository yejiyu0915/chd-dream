import React, { useMemo, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScheduleItem } from '@/lib/notion';
import { formatTimeInfo } from '@/app/info/schedule/types/utils';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/info/schedule/Schedule.module.scss';
import {
  FETCH_ERROR_SCHEDULE,
  userFacingFetchError,
} from '@/common/utils/userFacingFetchError';

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
 * 수동 최적화 적용 (복잡한 데이터 처리)
 */
function ScheduleListView({
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
  // 아코디언 상태 관리 (lazy initialization)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(() => new Set(['ongoing']));

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
      // 상시 일정(ongoing)인 경우 항상 표시
      if (event.ongoing) {
        return true;
      }

      const eventStartDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;

      // 일정이 기간과 겹치는지 확인
      return eventStartDate <= dateRange.endDate && eventEndDate >= dateRange.startDate;
    });

    // 이전 기간부터 시작된 일정과 기간 내 시작된 일정 분리
    const ongoingEvents: ScheduleItem[] = [];
    const periodEvents: ScheduleItem[] = [];

    filteredData.forEach((event) => {
      // 상시 일정(ongoing)인 경우 항상 "진행 중인 일정" 섹션에 표시
      if (event.ongoing) {
        ongoingEvents.push(event);
        return;
      }

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

  // 모두 펼치기 함수
  const expandAll = () => {
    const allDateKeys = new Set<string>(ongoingEvents.length > 0 ? ['ongoing'] : []);
    groupedScheduleData.forEach(({ date }) => {
      allDateKeys.add(date.toISOString().split('T')[0]);
    });
    setExpandedDates(allDateKeys);
  };

  // 모두 닫기 함수
  const collapseAll = () => {
    setExpandedDates(new Set<string>());
  };

  // 모든 항목이 펼쳐져 있는지 확인
  const allExpanded = useMemo(() => {
    const allDateKeys = new Set<string>(ongoingEvents.length > 0 ? ['ongoing'] : []);
    groupedScheduleData.forEach(({ date }) => {
      allDateKeys.add(date.toISOString().split('T')[0]);
    });
    return allDateKeys.size > 0 && Array.from(allDateKeys).every((key) => expandedDates.has(key));
  }, [expandedDates, groupedScheduleData, ongoingEvents.length]);

  // 기간 내 일정들의 날짜 키들을 오늘 날짜 기준으로 펼침/접힘 상태 설정
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 00:00:00으로 설정

    setExpandedDates((prev) => {
      const newSet = new Set(prev);

      // ongoing 일정은 항상 펼침 상태 유지
      if (ongoingEvents.length > 0) {
        newSet.add('ongoing');
      }

      // 기간 내 일정들의 날짜별로 오늘 기준 펼침/접힘 상태 결정
      groupedScheduleData.forEach(({ date }) => {
        const dateKey = date.toISOString().split('T')[0];
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);

        // 오늘 또는 미래 날짜는 펼침, 과거 날짜는 접힘
        if (dateOnly >= today) {
          newSet.add(dateKey); // 오늘 또는 미래: 펼침
        } else {
          newSet.delete(dateKey); // 과거: 접힘
        }
      });

      return newSet;
    });
  }, [groupedScheduleData, ongoingEvents.length]);

  // 애니메이션 variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25, // 0.5초에서 0.25초로 단축
        ease: [0.4, 0, 0.2, 1] as const, // 더 자연스러운 ease-in-out 느낌
        delay: index * 0.05, // 각 섹션마다 0.05초 간격으로 단축 (0.1초에서)
      },
    }),
  };

  const eventVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2, // 0.4초에서 0.2초로 단축
        ease: [0.4, 0, 0.2, 1] as const, // 더 자연스러운 ease-in-out 느낌
        delay: index * 0.02, // 각 이벤트마다 0.02초 간격으로 단축 (0.05초에서)
      },
    }),
  };

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
        <div className={s.errorState} role="alert">
          <p>{userFacingFetchError(FETCH_ERROR_SCHEDULE, error ?? null)}</p>
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
          총 <strong>{ongoingEvents.length + groupedScheduleData.length}일</strong>의 일정
          <span className="only-pc">이 있습니다</span>
          {ongoingEvents.length > 0 && (
            <>
              {' '}
              (진행 중: <strong>{ongoingEvents.length}개</strong>)
            </>
          )}
        </p>
        <div className={s.scheduleListToggleButtons}>
          <button type="button" className={s.scheduleListToggleAll} onClick={expandAll}>
            <span className={s.toggleIcon}>+</span>
            OPEN<span className="sr-only">(모든 일정 펼치기)</span>
          </button>
          <button type="button" className={s.scheduleListToggleAll} onClick={collapseAll}>
            <span className={s.toggleIcon}>-</span>
            CLOSE<span className="sr-only">(모든 일정 닫기)</span>
          </button>
        </div>
      </div>

      {ongoingEvents.length === 0 && groupedScheduleData.length === 0 ? (
        <div className={s.emptyState}>
          <p>선택한 기간에 일정이 없습니다.</p>
          <p className={s.emptyState__next}>
            기간을 바꿔 보시거나{' '}
            <Link href="/worship/timetable">예배 시간표</Link>에서 정기 집회를 확인해 보세요.
          </p>
        </div>
      ) : (
        <div className={s.scheduleList}>
          {/* 진행 중인 일정 섹션 */}
          {ongoingEvents.length > 0 && (
            <motion.div
              className={s.scheduleListDay}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '50px' }}
              variants={sectionVariants}
            >
              <button
                type="button"
                className={s.scheduleListDayHeader}
                onClick={() => toggleDate('ongoing')}
                aria-expanded={expandedDates.has('ongoing')}
              >
                <div className={s.scheduleListDayDate}>진행 중인 일정</div>
                <div className={s.scheduleListDayCount}>{ongoingEvents.length}개</div>
                <div className={s.accordionIcon}>
                  <Icon
                    name={expandedDates.has('ongoing') ? 'arrow-down' : 'arrow-up'}
                    aria-hidden="true"
                  />
                </div>
                <span className="sr-only">{expandedDates.has('ongoing') ? '접기' : '펼치기'}</span>
              </button>
              {expandedDates.has('ongoing') && (
                <div className={s.scheduleListEvents}>
                  {ongoingEvents.map((event, eventIndex) => {
                    const timeInfo = formatTimeInfo(event);
                    const dDayLabel = getDDayLabel(event);
                    const isOngoing = event.ongoing;
                    return (
                      <motion.div
                        key={event.id}
                        className={`${s.scheduleListEvent} ${event.important ? s.important : ''} ${s.ongoingEvent}`}
                        custom={eventIndex}
                        initial="hidden"
                        animate="visible"
                        variants={eventVariants}
                      >
                        <div className={s.scheduleListEventContent}>
                          <div className={s.scheduleListEventHeader}>
                            <div className={s.scheduleListEventTitle}>{event.title}</div>
                            <div className={s.scheduleListEventLabels}>
                              {isOngoing && (
                                <span className={s.scheduleListEventOngoing}>진행중</span>
                              )}
                              {dDayLabel && (
                                <span className={s.scheduleListEventDDay}>{dDayLabel}</span>
                              )}
                            </div>
                          </div>
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
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* 기간 내 일정 섹션 */}
          {groupedScheduleData.map(({ date, events }, sectionIndex) => {
            const dateKey = date.toISOString().split('T')[0];
            const isExpanded = expandedDates.has(dateKey);

            return (
              <motion.div
                key={date.toISOString()}
                className={s.scheduleListDay}
                custom={sectionIndex + (ongoingEvents.length > 0 ? 1 : 0)}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: '50px' }}
                variants={sectionVariants}
              >
                <button
                  type="button"
                  className={s.scheduleListDayHeader}
                  onClick={() => toggleDate(dateKey)}
                  aria-expanded={isExpanded}
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
                    <Icon name={isExpanded ? 'arrow-down' : 'arrow-up'} aria-hidden="true" />
                  </div>
                  <span className="sr-only">{isExpanded ? '접기' : '펼치기'}</span>
                </button>
                {isExpanded && (
                  <div className={s.scheduleListEvents}>
                    {events.map((event, eventIndex) => {
                      const timeInfo = formatTimeInfo(event);
                      const dDayLabel = getDDayLabel(event);
                      const isOngoing = event.ongoing;
                      return (
                        <motion.div
                          key={event.id}
                          className={`${s.scheduleListEvent} ${event.important ? s.important : ''}`}
                          custom={eventIndex}
                          initial="hidden"
                          animate="visible"
                          variants={eventVariants}
                        >
                          <div className={s.scheduleListEventContent}>
                            <div className={s.scheduleListEventHeader}>
                              <div className={s.scheduleListEventTitle}>{event.title}</div>
                              <div className={s.scheduleListEventLabels}>
                                {isOngoing && (
                                  <span className={s.scheduleListEventOngoing}>진행중</span>
                                )}
                                {dDayLabel && (
                                  <span className={s.scheduleListEventDDay}>{dDayLabel}</span>
                                )}
                              </div>
                            </div>
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
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// React.memo로 컴포넌트 메모이제이션 (수동 최적화)
export default memo(ScheduleListView, (prevProps, nextProps) => {
  // scheduleData 배열이 동일한지 확인
  if (prevProps.scheduleData !== nextProps.scheduleData) {
    if (prevProps.scheduleData.length !== nextProps.scheduleData.length) {
      return false;
    }
    const prevIds = prevProps.scheduleData.map((item) => item.id).join(',');
    const nextIds = nextProps.scheduleData.map((item) => item.id).join(',');
    return prevIds === nextIds;
  }
  // currentDate가 동일한지 확인
  if (prevProps.currentDate.getTime() !== nextProps.currentDate.getTime()) {
    return false;
  }
  // period가 동일한지 확인
  if (prevProps.period !== nextProps.period) {
    return false;
  }
  // 함수들이 동일한지 확인
  if (
    prevProps.onPreviousPeriod !== nextProps.onPreviousPeriod ||
    prevProps.onNextPeriod !== nextProps.onNextPeriod ||
    prevProps.onGoToToday !== nextProps.onGoToToday
  ) {
    return false;
  }
  return true;
});
