'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import c from './infoLayout.module.scss';

interface InfoLayoutProps {
  children: React.ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // 각 경로 세그먼트에 대한 표시 이름 정의 (옵션)
  const breadcrumbNames: { [key: string]: string } = {
    info: '교회 소식',
    'c-log': 'C-Log',
    // 다른 경로에 대한 이름 추가
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = breadcrumbNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { name, href };
    }),
  ];

  // 페이지 타이틀을 동적으로 결정하는 로직 (예: 마지막 브레드크럼 아이템)
  const currentPageTitle =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1].name : 'Home';

  return (
    <main className={c.infoLayout}>
      <div className={c.titleSection}>
        <nav className="breadcrumb" aria-label="breadcrumb">
          <ol className="breadcrumb__list">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="breadcrumb__item">
                {index === breadcrumbs.length - 1 ? (
                  <span className="breadcrumb__active">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="breadcrumb__link">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={`${c.inner} inner`}>
          <div className={c.title}>
            <h1 className={c.pageTitle}>{currentPageTitle}</h1>
            <p className={c.pageDesc}>교회의 다양한 이야기를 소개합니다.</p>
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}
