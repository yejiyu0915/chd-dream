import React from 'react';
import type { Metadata } from 'next';
import SectionLayout from '@/common/components/layouts/SectionLayout';

interface LocationLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: '오시는길',
  description: '행복으로가는교회 위치 안내. 인천 남동구 문화로 227. 지하철, 버스 이용 안내',
  openGraph: {
    title: '오시는길 | 행복으로가는교회',
    description: '행복으로가는교회 위치 안내. 인천 남동구 문화로 227',
  },
};

/**
 * Location 섹션 레이아웃 (Server Component)
 * 페이지 메타 정보는 list.ts에서 자동으로 가져옵니다.
 * SectionLayout은 Client Component이지만, layout은 Server Component로 유지
 */
export default function LocationLayout({ children }: LocationLayoutProps) {
  return <SectionLayout sectionName="location">{children}</SectionLayout>;
}
