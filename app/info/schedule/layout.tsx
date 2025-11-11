import React from 'react';

interface ScheduleLayoutProps {
  children: React.ReactNode;
}

// 단순 레이아웃 - 특별한 처리 없음
export default function ScheduleLayout({ children }: ScheduleLayoutProps) {
  return <>{children}</>;
}
