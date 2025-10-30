'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import info from '@/app/info/infoLayout.module.scss'; // info 레이아웃 스타일 재사용
import l from '@/app/location/Location.module.scss'; // 배경 오버라이드용
import { pageMeta } from '@/common/data/list';

interface LocationLayoutProps {
  children: React.ReactNode;
}

export default function LocationLayout({ children }: LocationLayoutProps) {
  const pathname = usePathname();

  // 페이지 메타 정보 가져오기
  const pageInfo = pageMeta[pathname] || {
    title: '오시는 길',
    description: '행복으로가는교회를 찾아오시는 길을 안내합니다.',
  };

  return (
    <main className={`${info.infoLayout} ${l.locationLayout}`}>
      {/* 타이틀 섹션 */}
      <div className={`${info.titleSection} titleSection`}>
        <Breadcrumbs className={info.breadcrumbs} isDetail={false} />
        <div className={`${info.inner} inner`}>
          <div className={info.title}>
            <h1 className={info.pageTitle}>{pageInfo.title}</h1>
            <p className={info.pageDesc}>{pageInfo.description}</p>
          </div>
        </div>
      </div>
      {/* 콘텐츠 */}
      {children}
    </main>
  );
}
