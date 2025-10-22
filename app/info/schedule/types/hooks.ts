import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScheduleItem } from '@/lib/notion';
import Holidays from 'date-holidays';

/**
 * 공휴일 정보를 가져오는 커스텀 훅
 */
export const useHolidayInfo = () => {
  // 한국 공휴일 인스턴스 생성
  const holidays = useMemo(() => new Holidays('KR'), []);

  // 공휴일 확인 함수
  const getHolidayInfo = useCallback(
    (date: Date) => {
      const holidayInfo = holidays.isHoliday(date);
      if (holidayInfo) {
        return {
          isHoliday: true,
          name: holidayInfo.name,
          type: holidayInfo.type,
        };
      }
      return { isHoliday: false, name: '', type: '' };
    },
    [holidays]
  );

  return { getHolidayInfo };
};

/**
 * 일정 데이터를 가져오는 커스텀 훅
 */
export const useScheduleData = () => {
  return useQuery<ScheduleItem[]>({
    queryKey: ['schedule-list'],
    queryFn: async () => {
      const response = await fetch('/api/schedule');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
