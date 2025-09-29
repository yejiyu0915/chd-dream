import { ScheduleItem } from '@/lib/notion';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleItem[];
  spanningEvents: SpanningEvent[];
  holidayInfo: {
    isHoliday: boolean;
    name: string;
    type: string;
  };
}

export interface SpanningEvent {
  event: ScheduleItem;
  startDay: number;
  endDay: number;
  isFirstDay: boolean;
  isLastDay: boolean;
}

export const DAYS_OF_WEEK = ['주일', '월', '화', '수', '목', '금', '토'] as const;
