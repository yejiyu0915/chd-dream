'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import info from '@/app/info/infoLayout.module.scss'; // info 레이아웃 스타일 재사용
import l from '@/app/location/Location.module.scss'; // 배경 오버라이드용
import { pageMeta } from '@/common/data/list';
import Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    lenis?: Lenis | null;
  }
}

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

  // 스크롤 상단 이동 (페이지 이동 시) - lenis와 충돌 방지
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        window.lenis &&
        typeof window.lenis.scrollTo === 'function'
      ) {
        window.lenis.scrollTo(0, { duration: 0.7 }); // Lenis 스크롤 사용 (부드러운 이동)
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 일반 스크롤 사용 시 부드럽게 이동
      }
    }, 300); // 300ms 딜레이

    return () => clearTimeout(timer);
  }, [pathname]);

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
