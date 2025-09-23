'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // usePathname 다시 추가

interface BreadcrumbNames {
  [key: string]: string;
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  className?: string; // className prop 추가
  isDetail?: boolean; // 상세페이지 여부를 나타내는 prop 추가
}

export default function Breadcrumbs({ className, isDetail }: BreadcrumbsProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // 각 경로 세그먼트에 대한 표시 이름 정의 (옵션)
  const breadcrumbNames: BreadcrumbNames = {
    info: '교회 소식',
    'c-log': 'C-Log',
    news: '뉴스',
    // 다른 경로에 대한 이름 추가
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = breadcrumbNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { name, href };
    }),
  ];

  // 상세페이지인 경우 detail 클래스 추가
  const breadcrumbClasses = ['breadcrumb', className || '', isDetail ? 'detail' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={breadcrumbClasses} aria-label="breadcrumb">
      <ol className="breadcrumb__list">
        {breadcrumbs.map((crumb, index) =>
          index > 2 ? null : (
            <li key={crumb.href} className="breadcrumb__item">
              {index === breadcrumbs.length - 1 ? (
                <span className="breadcrumb__active">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="breadcrumb__link">
                  {crumb.name}
                </Link>
              )}
            </li>
          )
        )}
      </ol>
    </nav>
  );
}
