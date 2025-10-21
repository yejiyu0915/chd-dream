'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import { usePageTitle, PageTitleProvider } from '@/app/worship/utils/title-context';
import worship from './worshipLayout.module.scss';
import { pageMeta } from '@/common/data/list'; // pageMeta 임포트

interface WorshipLayoutProps {
  children: React.ReactNode;
}

function WorshipLayoutContent({ children }: WorshipLayoutProps) {
  const pathname = usePathname();
  const { currentPageTitle } = usePageTitle();

  // /worship/<category>/<slug> 패턴을 확인하여 상세 페이지인지 여부를 판단
  const isWorshipDetailPage = /\/worship\/[^/]+\/[^/]+/.test(pathname);

  // 현재 경로에 맞는 페이지 설명을 pageMeta에서 가져오기
  const currentPathSegments = pathname.split('/').filter(Boolean);
  const baseWorshipPath = '/worship';
  let matchedPath = baseWorshipPath;
  if (currentPathSegments.length >= 2 && currentPathSegments[0] === 'worship') {
    // /worship/bulletin와 같은 기본 경로 매칭
    matchedPath = `/${currentPathSegments[0]}/${currentPathSegments[1]}`;
  }

  const pageDescription =
    pageMeta[matchedPath]?.description ||
    pageMeta['/worship']?.description ||
    '교회의 예배와 관련된 정보를 제공합니다.';

  // 스크롤 상단 이동 (페이지 이동 시)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className={worship.worshipLayout}>
      <div className={worship.titleSection}>
        <Breadcrumbs
          className={isWorshipDetailPage ? worship.detailBreadcrumbs : worship.breadcrumbs}
          isDetail={isWorshipDetailPage}
        />
        {!isWorshipDetailPage && (
          <div className={`${worship.inner} inner`}>
            <div className={worship.title}>
              <h1 className={worship.pageTitle}>{currentPageTitle}</h1>
              <p className={worship.pageDesc}>{pageDescription}</p>
            </div>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}

export default function WorshipLayout({ children }: WorshipLayoutProps) {
  return (
    <PageTitleProvider>
      <WorshipLayoutContent>{children}</WorshipLayoutContent>
    </PageTitleProvider>
  );
}
