import { ScheduleItem } from '@/lib/notion';

/**
 * 시간 정보 포맷팅 함수
 * 일정의 시작일/종료일과 시간 정보를 한국어 형식으로 포맷팅
 */
export const formatTimeInfo = (event: ScheduleItem): string => {
  // 원본 데이터에서 시간이 실제로 설정되었는지 확인하는 헬퍼 함수
  const hasActualTime = (dateString: string): boolean => {
    return dateString.includes('T');
  };

  // 상시 일정인 경우 (ongoing이 true이고 endDate가 없는 경우)
  if (event.ongoing && event.startDate && !event.endDate) {
    const startDate = new Date(event.startDate);
    const startDateStr = startDate
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '')
      .replace(/\s/g, ''); // 띄어쓰기 제거

    const startHasTime = hasActualTime(event.startDate);
    if (startHasTime) {
      const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return ` ${startDateStr}(${startTimeStr}) ~`;
    } else {
      return ` ${startDateStr} ~`;
    }
  }

  if (event.startDate && event.endDate) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const startDateStr = startDate
      .toLocaleDateString('ko-KR', {
        month: 'numeric',
        day: 'numeric',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '')
      .replace(/\s/g, ''); // 띄어쓰기 제거

    const endDateStr = endDate
      .toLocaleDateString('ko-KR', {
        month: 'numeric',
        day: 'numeric',
      })
      .replace(/\./g, '/')
      .replace(/\/$/, '')
      .replace(/\s/g, ''); // 띄어쓰기 제거

    const startHasTime = hasActualTime(event.startDate);
    const endHasTime = hasActualTime(event.endDate);

    // 같은 날짜인 경우
    if (startDateStr === endDateStr) {
      if (startHasTime && endHasTime) {
        const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const endTimeStr = endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr}(${startTimeStr}~${endTimeStr})`;
      } else {
        return ` ${startDateStr}`;
      }
    } else {
      // 다른 날짜인 경우
      if (startHasTime && endHasTime) {
        const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const endTimeStr = endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr}(${startTimeStr}) → ${endDateStr}(${endTimeStr})`;
      } else if (startHasTime) {
        const startTimeStr = startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr}(${startTimeStr}) → ${endDateStr}`;
      } else if (endHasTime) {
        const endTimeStr = endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return ` ${startDateStr} → ${endDateStr}(${endTimeStr})`;
      } else {
        return ` ${startDateStr} → ${endDateStr}`;
      }
    }
  } else if (event.startDate) {
    const startDate = new Date(event.startDate);

    if (hasActualTime(event.startDate)) {
      const timeStr = startDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      // 단일 일정이고 시간이 설정된 경우 시간만 표시
      return ` ${timeStr}`;
    } else {
      // 단일 날짜이고 시간도 없는 경우 날짜 표시 생략
      return '';
    }
  } else if (event.time) {
    return ` ${event.time}`;
  }

  return '';
};
