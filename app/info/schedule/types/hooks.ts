import { useCallback, useMemo } from 'react';
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
