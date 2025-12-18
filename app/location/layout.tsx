import React from 'react';
import SectionLayout from '@/common/components/layouts/SectionLayout';
import { generatePageMetadata } from '@/common/data/metadata';

interface LocationLayoutProps {
  children: React.ReactNode;
}

// generatePageMetadata를 사용하여 일관된 메타데이터 생성
export const metadata = generatePageMetadata('/location');

/**
 * Location 섹션 레이아웃 (Server Component)
 * 페이지 메타 정보는 list.ts에서 자동으로 가져옵니다.
 * SectionLayout은 Client Component이지만, layout은 Server Component로 유지
 */
export default function LocationLayout({ children }: LocationLayoutProps) {
  return <SectionLayout sectionName="location">{children}</SectionLayout>;
}
