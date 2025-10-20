'use client';

import HeaderPC from '@/common/components/layouts/Header/HeaderPC';
import HeaderMo from '@/common/components/layouts/Header/HeaderMo';
import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  'use memo'; // React 컴파일러 최적화 적용

  const pathname = usePathname();

  // useSyncExternalStore로 스크롤 상태를 서버와 클라이언트에서 동기화 (플리커 방지)
  const scrollY = useSyncExternalStore(
    // 구독 함수 - 스크롤 이벤트 리스너 등록
    (callback) => {
      window.addEventListener('scroll', callback);
      return () => window.removeEventListener('scroll', callback);
    },
    // 클라이언트에서 현재 스크롤 위치 반환
    () => window.scrollY,
    // 서버사이드에서 초기값 반환 (0으로 설정)
    () => 0
  );

  // 스크롤 상태 계산
  const isScrolled = pathname !== '/' || scrollY > 200;

  return (
    <>
      <HeaderPC isScrolled={isScrolled} />
      <HeaderMo isScrolled={isScrolled} />
    </>
  );
}
