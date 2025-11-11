'use client';

import React from 'react';

// React Query 완전 제거 - 더 이상 필요 없음
// Next.js 16의 서버 컴포넌트와 캐싱으로 충분
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
