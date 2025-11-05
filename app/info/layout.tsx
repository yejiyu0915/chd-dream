'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import { usePageTitle } from '@/app/info/utils/title-context';
import info from '@/app/info/infoLayout.module.scss';
import { pageMeta } from '@/common/data/list'; // pageMeta 임포트

interface InfoLayoutProps {
  children: React.ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  const pathname = usePathname();
  const { currentPageTitle, setPageTitle } = usePageTitle();

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

  // pathname이 변경될 때마다 자동으로 제목 설정 (상세 페이지 제외)
  useEffect(() => {
    if (!isInfoDetailPage) {
      const pageTitle = pageMeta[matchedPath]?.title || 'INFO';
      setPageTitle(pageTitle);
    }
  }, [pathname, isInfoDetailPage, matchedPath, setPageTitle]);

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
