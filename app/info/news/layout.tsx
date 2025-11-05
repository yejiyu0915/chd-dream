import React from 'react';

interface NewsLayoutProps {
  children: React.ReactNode;
}

// layout을 단순화 - prefetch 제거 (page.tsx에서 직접 데이터 가져오기)
export default function NewsLayout({ children }: NewsLayoutProps) {
  return <>{children}</>;
}
