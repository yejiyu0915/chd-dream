'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

// Provider 컴포넌트
export function ScheduleProvider({ children }: ScheduleProviderProps) {
  // 날짜 상태 - 서버/클라이언트 모두 동일한 초기값 (고정된 날짜 사용)
  // useEffect에서 실제 오늘 날짜로 업데이트
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 0, 1)); // 임시 고정값
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 0, 1)); // 임시 고정값
  
  // 클라이언트에서만 실제 오늘 날짜로 업데이트
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);
  
  // 뷰 상태
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [period, setPeriod] = useState<Period>('1month');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);

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
    // React의 state batching을 활용하여 동시에 업데이트 (setTimeout 제거)
    setSelectedDate(todayDateOnly);
    setIsMobilePanelOpen(true);
  };

  // 이전 기간으로 이동
  const goToPreviousPeriod = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
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
      return newDate;
    });
  };

  // 다음 기간으로 이동
  const goToNextPeriod = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
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
      return newDate;
    });
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

