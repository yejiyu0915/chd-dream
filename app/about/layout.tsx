'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import { usePageTitle, PageTitleProvider } from '@/app/about/utils/title-context';
import about from '@/app/about/aboutLayout.module.scss';
import { pageMeta } from '@/common/data/list';
import Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    lenis?: Lenis | null;
  }
}

interface AboutLayoutProps {
  children: React.ReactNode;
}

function AboutLayoutContent({ children }: AboutLayoutProps) {
  const pathname = usePathname();
  const { currentPageTitle } = usePageTitle();

  // /about/<category>/<slug> 패턴을 확인하여 상세 페이지인지 여부를 판단
  const isAboutDetailPage = /\/about\/[^/]+\/[^/]+/.test(pathname);

  // 현재 경로에 맞는 페이지 설명을 pageMeta에서 가져오기
  const currentPathSegments = pathname.split('/').filter(Boolean);
  const baseAboutPath = '/about';
  let matchedPath = baseAboutPath;
  if (currentPathSegments.length >= 2 && currentPathSegments[0] === 'about') {
    // /about/history와 같은 기본 경로 매칭
    matchedPath = `/${currentPathSegments[0]}/${currentPathSegments[1]}`;
  }

  const pageDescription =
    pageMeta[matchedPath]?.description ||
    pageMeta['/about']?.description ||
    '행복으로가는교회를 소개합니다.';

  // 스크롤 상단 이동 (페이지 이동 시) - lenis와 충돌 방지
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        window.lenis &&
        typeof window.lenis.scrollTo === 'function'
      ) {
        window.lenis.scrollTo(0, { duration: 0.7 });
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <main className={about.aboutLayout}>
      <div className={about.titleSection}>
        <Breadcrumbs
          className={isAboutDetailPage ? about.detailBreadcrumbs : about.breadcrumbs}
          isDetail={isAboutDetailPage}
        />
        {!isAboutDetailPage && (
          <div className={`${about.inner} inner`}>
            <div className={about.title}>
              <h1 className={about.pageTitle}>{currentPageTitle}</h1>
              <p className={about.pageDesc}>{pageDescription}</p>
            </div>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <PageTitleProvider>
      <AboutLayoutContent>{children}</AboutLayoutContent>
    </PageTitleProvider>
  );
}
