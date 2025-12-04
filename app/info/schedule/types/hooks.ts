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
      // holidayInfo는 배열로 반환될 수 있으므로 첫 번째 항목 사용
      if (holidayInfo && Array.isArray(holidayInfo) && holidayInfo.length > 0) {
        const holiday = holidayInfo[0];
        return {
          isHoliday: true,
          name: holiday.name,
          type: holiday.type,
        };
      }
      return { isHoliday: false, name: '', type: '' };
    },
    [holidays]
  );

  return { getHolidayInfo };
};
