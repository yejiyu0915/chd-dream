'use client';
import React from 'react';
import SectionLayout from '@/common/components/layouts/SectionLayout';

interface LocationLayoutProps {
  children: React.ReactNode;
}

/**
 * Location 섹션 레이아웃
 * 페이지 메타 정보는 list.ts에서 자동으로 가져옵니다.
 */
export default function LocationLayout({ children }: LocationLayoutProps) {
  return (
    <SectionLayout sectionName="location">
      {children}
    </SectionLayout>
  );
}
