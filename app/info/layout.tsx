import React from 'react';
import type { Metadata } from 'next';
import SectionLayout from '@/common/components/layouts/SectionLayout';

interface InfoLayoutProps {
  children: React.ReactNode;
}

// 메타데이터는 각 페이지에서 개별적으로 설정

/**
 * Info 섹션 레이아웃 (Server Component)
 * 페이지 메타 정보는 list.ts에서 자동으로 가져옵니다.
 * SectionLayout은 Client Component이지만, layout은 Server Component로 유지
 */
export default function InfoLayout({ children }: InfoLayoutProps) {
  return <SectionLayout sectionName="info">{children}</SectionLayout>;
}
