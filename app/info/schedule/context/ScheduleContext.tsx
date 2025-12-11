'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 뷰 모드 타입
export type ViewMode = 'calendar' | 'list';

// 기간 타입
export type Period = '1month' | '3months' | '6months' | '1year';

// Context 상태 타입
interface ScheduleContextState {
  // 날짜 상태
  currentDate: Date;
  selectedDate: Date;

  // 뷰 상태
  viewMode: ViewMode;
  period: Period;
  isMobilePanelOpen: boolean;

  // 액션
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  setPeriod: (period: Period) => void;
  setIsMobilePanelOpen: (open: boolean) => void;

  // 날짜 이동 헬퍼
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  goToPreviousPeriod: () => void;
  goToNextPeriod: () => void;
}

// Context 생성
const ScheduleContext = createContext<ScheduleContextState | undefined>(undefined);

// Provider Props
interface ScheduleProviderProps {
  children: ReactNode;
  searchParams: { view?: string; date?: string; period?: string; start?: string };
}

// 날짜를 URL 파라미터 형식으로 변환 (2025-12-05 → 20251205)
const dateToParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// URL 파라미터를 Date로 변환 (20251205 → Date)
const paramToDate = (param: string): Date | null => {
  const match = param.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0부터 시작
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return null;
};

// Provider 컴포넌트
export function ScheduleProvider({ children, searchParams }: ScheduleProviderProps) {
  const router = useRouter();

  // URL 파라미터에서 값 가져오기 (props로 받은 searchParams 사용)
  const viewParam = (searchParams.view || null) as ViewMode | null;
  const dateParam = searchParams.date || null;
  const periodParam = (searchParams.period || null) as Period | null;
  const startParam = searchParams.start || null; // 리스트뷰 시작 날짜

  const initialViewMode: ViewMode =
    viewParam === 'list' || viewParam === 'calendar' ? viewParam : 'calendar';
  const initialPeriod: Period =
    periodParam === '1month' ||
    periodParam === '3months' ||
    periodParam === '6months' ||
    periodParam === '1year'
      ? periodParam
      : '1month';

  // 날짜 상태 - URL 파라미터에서 날짜 가져오기
  // calendar: dateParam 사용 / list: startParam 사용
  const initialDate =
    viewParam === 'calendar' && dateParam
      ? paramToDate(dateParam)
      : viewParam === 'list' && startParam
        ? paramToDate(startParam)
        : null;

  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date(2024, 0, 1)); // 임시 고정값
  const [selectedDate, setSelectedDateState] = useState<Date>(initialDate || new Date(2024, 0, 1)); // 임시 고정값

  // 클라이언트에서만 실제 오늘 날짜로 업데이트 (URL 파라미터 없을 때만)
  useEffect(() => {
    if (!dateParam && !startParam) {
      const today = new Date();
      setCurrentDate(today);
      setSelectedDateState(today);
    }
  }, [dateParam, startParam]);

  // 뷰 상태 (URL 파라미터 반영)
  const [viewMode, setViewModeState] = useState<ViewMode>(initialViewMode);
  const [period, setPeriodState] = useState<Period>(initialPeriod);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);

  // URL 파라미터 변경 시 viewMode 동기화
  useEffect(() => {
    if (viewParam === 'list' || viewParam === 'calendar') {
      setViewModeState(viewParam);
    }
  }, [viewParam]);

  // URL 파라미터 변경 시 날짜 동기화 (calendar 모드일 때만)
  useEffect(() => {
    if (dateParam && viewMode === 'calendar') {
      const date = paramToDate(dateParam);
      if (date) {
        setSelectedDateState(date);
        setCurrentDate(date); // 해당 월로 이동
      }
    }
  }, [dateParam, viewMode]);

  // URL 파라미터 변경 시 period 동기화 (list 모드일 때만)
  useEffect(() => {
    if (periodParam && viewMode === 'list') {
      const validPeriods: Period[] = ['1month', '3months', '6months', '1year'];
      if (validPeriods.includes(periodParam)) {
        setPeriodState(periodParam);
      }
    }
  }, [periodParam, viewMode]);

  // URL 파라미터 변경 시 시작 날짜 동기화 (list 모드일 때만)
  useEffect(() => {
    if (startParam && viewMode === 'list') {
      const date = paramToDate(startParam);
      if (date) {
        setCurrentDate(date);
      }
    }
  }, [startParam, viewMode]);

  // viewMode 변경 핸들러 (URL 업데이트 포함)
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    // calendar 모드: 날짜 파라미터 유지
    if (mode === 'calendar' && dateParam) {
      router.push(`/info/schedule?view=${mode}&date=${dateParam}`, { scroll: false });
    }
    // list 모드: period + start 파라미터 추가
    else if (mode === 'list') {
      const startString = dateToParam(currentDate);
      router.push(`/info/schedule?view=${mode}&period=${period}&start=${startString}`, {
        scroll: false,
      });
    } else {
      router.push(`/info/schedule?view=${mode}`, { scroll: false });
    }
  };

  // selectedDate 변경 핸들러 (URL 업데이트 포함 - calendar 모드일 때만)
  const setSelectedDate = (date: Date) => {
    setSelectedDateState(date);
    if (viewMode === 'calendar') {
      const dateString = dateToParam(date);
      router.push(`/info/schedule?view=calendar&date=${dateString}`, { scroll: false });
    }
  };

  // period 변경 핸들러 (URL 업데이트 포함 - list 모드일 때만)
  const setPeriod = (newPeriod: Period) => {
    setPeriodState(newPeriod);
    if (viewMode === 'list') {
      const startString = dateToParam(currentDate);
      router.push(`/info/schedule?view=list&period=${newPeriod}&start=${startString}`, {
        scroll: false,
      });
    }
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    setCurrentDate(todayDateOnly);
    setSelectedDateState(todayDateOnly);
    setIsMobilePanelOpen(true);

    // URL 업데이트
    const dateString = dateToParam(todayDateOnly);
    if (viewMode === 'calendar') {
      router.push(`/info/schedule?view=calendar&date=${dateString}`, { scroll: false });
    } else if (viewMode === 'list') {
      router.push(`/info/schedule?view=list&period=${period}&start=${dateString}`, {
        scroll: false,
      });
    }
  };

  // 이전 기간으로 이동
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    switch (period) {
      case '1month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case '3months':
        newDate.setMonth(newDate.getMonth() - 3);
        break;
      case '6months':
        newDate.setMonth(newDate.getMonth() - 6);
        break;
      case '1year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);

    // URL 업데이트 (list 모드일 때만)
    if (viewMode === 'list') {
      const startString = dateToParam(newDate);
      router.push(`/info/schedule?view=list&period=${period}&start=${startString}`, {
        scroll: false,
      });
    }
  };

  // 다음 기간으로 이동
  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (period) {
      case '1month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case '3months':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
      case '6months':
        newDate.setMonth(newDate.getMonth() + 6);
        break;
      case '1year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);

    // URL 업데이트 (list 모드일 때만)
    if (viewMode === 'list') {
      const startString = dateToParam(newDate);
      router.push(`/info/schedule?view=list&period=${period}&start=${startString}`, {
        scroll: false,
      });
    }
  };

  const value: ScheduleContextState = {
    currentDate,
    selectedDate,
    viewMode,
    period,
    isMobilePanelOpen,
    setCurrentDate,
    setSelectedDate,
    setViewMode,
    setPeriod,
    setIsMobilePanelOpen,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToPreviousPeriod,
    goToNextPeriod,
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

// Context Hook
export function useScheduleContext() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
}
