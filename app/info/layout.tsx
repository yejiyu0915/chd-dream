'use client';

// import Link from 'next/link'; // Link 임포트 제거
import { usePathname } from 'next/navigation';
import c from './infoLayout.module.scss';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs'; // Breadcrumbs 컴포넌트 임포트
import { PageTitleProvider, usePageTitle } from './title-context'; // PageTitleProvider 및 usePageTitle 임포트

interface InfoLayoutProps {
  children: React.ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  return (
    <PageTitleProvider>
      {' '}
      {/* PageTitleProvider로 children 감싸기 */}
      <InfoLayoutContent>{children}</InfoLayoutContent>
    </PageTitleProvider>
  );
}

function InfoLayoutContent({ children }: InfoLayoutProps) {
  const pathname = usePathname();
  const { currentPageTitle } = usePageTitle(); // Context에서 currentPageTitle 가져오기

  // C-log 상세 페이지 여부 확인
  const isCLogDetailPage = /\/info\/c-log\/[^/]+$/.test(pathname);

  return (
    <main className={c.infoLayout}>
      {!isCLogDetailPage && (
        <div className={c.titleSection}>
          <Breadcrumbs /> {/* Breadcrumbs 컴포넌트 사용 */}
          <div className={`${c.inner} inner`}>
            <div className={c.title}>
              <h1 className={c.pageTitle}>{currentPageTitle}</h1>
              <p className={c.pageDesc}>교회의 다양한 이야기를 소개합니다.</p>
            </div>
          </div>
        </div>
      )}
      {children}
    </main>
  );
}
