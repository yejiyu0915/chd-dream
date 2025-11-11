'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getBreadcrumbName } from '@/common/data/list';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  className?: string; // className prop 추가
  isDetail?: boolean; // 상세페이지 여부를 나타내는 prop 추가
}

/**
 * Breadcrumbs 컴포넌트
 * list.ts의 pageMeta 정보를 활용하여 자동으로 breadcrumb 이름을 표시합니다.
 */
export default function Breadcrumbs({ className, isDetail }: BreadcrumbsProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // 각 경로 세그먼트에 대한 breadcrumb 생성
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      // list.ts의 getBreadcrumbName 함수를 사용하여 이름 가져오기
      const name = getBreadcrumbName(segment, href);
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
