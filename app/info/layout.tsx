'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import { usePageTitle } from '@/app/info/utils/title-context';
import info from './infoLayout.module.scss';
import { pageMeta } from '@/common/data/list'; // pageMeta 임포트

interface InfoLayoutProps {
  children: React.ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  const pathname = usePathname();
  const { currentPageTitle } = usePageTitle();

  // /info/<category>/<slug> 패턴을 확인하여 상세 페이지인지 여부를 판단
  const isInfoDetailPage = /\/info\/[^/]+\/[^/]+/.test(pathname);

  // 현재 경로에 맞는 페이지 설명을 pageMeta에서 가져오기
  const currentPathSegments = pathname.split('/').filter(Boolean);
  const baseInfoPath = '/info';
  let matchedPath = baseInfoPath;
  if (currentPathSegments.length >= 2 && currentPathSegments[0] === 'info') {
    // /info/news 또는 /info/c-log와 같은 기본 경로 매칭
    matchedPath = `/${currentPathSegments[0]}/${currentPathSegments[1]}`;
  }

  const pageDescription =
    pageMeta[matchedPath]?.description ||
    pageMeta['/info']?.description ||
    '교회의 다양한 이야기를 소개합니다.';

  // 스크롤 상단 이동 (페이지 이동 시)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className={info.infoLayout}>
      {' '}
      {/* id 제거 */}
      <div className={info.titleSection}>
        <Breadcrumbs
          className={isInfoDetailPage ? info.detailBreadcrumbs : info.breadcrumbs}
          isDetail={isInfoDetailPage}
        />
        {!isInfoDetailPage && (
          <div className={`${info.inner} inner`}>
            <div className={info.title}>
              <h1 className={info.pageTitle}>{currentPageTitle}</h1>
              <p className={info.pageDesc}>{pageDescription}</p>
            </div>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
