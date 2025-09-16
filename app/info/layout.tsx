'use client';

// import Link from 'next/link'; // Link 임포트 제거
import { usePathname } from 'next/navigation';
import c from '@/app/info/infoLayout.module.scss';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs'; // Breadcrumbs 컴포넌트 임포트
import { PageTitleProvider, usePageTitle } from '@/app/info/utils/title-context'; // PageTitleProvider 및 usePageTitle 임포트 (경로 변경 반영)
import l from '@/common/styles/mdx/MdxLayout.module.scss'; // MdxLayout.module.scss 임포트
import { Suspense } from 'react'; // Suspense만 임포트, useEffect 제거
import Spinner from '@/common/components/utils/Spinner'; // Spinner 컴포넌트 임포트

interface InfoLayoutProps {
  children: React.ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  return (
    <PageTitleProvider>
      {' '}
      {/* PageTitleProvider로 children 감싸기 */}
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner size="lg" /> {/* Spinner 컴포넌트 사용 */}
          </div>
        }
      >
        {' '}
        {/* Suspense로 감싸기 */}
        <InfoLayoutContent>{children}</InfoLayoutContent>
      </Suspense>
    </PageTitleProvider>
  );
}

function InfoLayoutContent({ children }: InfoLayoutProps) {
  const pathname = usePathname();
  const { currentPageTitle } = usePageTitle(); // Context에서 currentPageTitle 가져오기

  // 경로 변경 시 스크롤을 페이지 상단으로 이동 (providers.tsx에서 전역적으로 처리되므로 여기서는 제거)
  // useEffect(() => {
  //   // 이 로직은 이제 providers.tsx에서 전역적으로 처리되므로 여기서는 제거하거나 주석 처리
  //   // window.scrollTo(0, 0);
  // }, [pathname]);

  // C-log 상세 페이지 여부 확인
  const isCLogDetailPage = /\/info\/c-log\/[^/]+$/.test(pathname);

  return (
    <main className={c.infoLayout}>
      {' '}
      {/* id 제거 */}
      <div className={c.titleSection}>
        <Breadcrumbs className={isCLogDetailPage ? l.detailBreadcrumbs : c.breadcrumbs} />{' '}
        {/* Breadcrumbs 컴포넌트 사용 */}
        {!isCLogDetailPage && (
          <div className={`${c.inner} inner`}>
            <div className={c.title}>
              <h1 className={c.pageTitle}>{currentPageTitle}</h1>
              <p className={c.pageDesc}>교회의 다양한 이야기를 소개합니다.</p>
            </div>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
