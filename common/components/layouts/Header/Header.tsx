'use client';

import HeaderPC from '@/common/components/layouts/Header/HeaderPC';
import HeaderMo from '@/common/components/layouts/Header/HeaderMo';
import { useSyncExternalStore, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  'use memo'; // React 컴파일러 최적화 적용

  const pathname = usePathname();
  const prevPathnameRef = useRef<string>(pathname);

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

  // pathname 변경 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    // pathname이 실제로 변경되었을 때만 스크롤 초기화
    if (prevPathnameRef.current !== pathname) {
      // 약간의 딜레이를 두어 페이지 전환이 완료된 후 스크롤 초기화
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant', // 즉시 이동 (애니메이션 없음)
        });
      });
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  // 스크롤 상태 계산
  const isScrolled = pathname !== '/' || scrollY > 200;

  return (
    <>
      <HeaderPC isScrolled={isScrolled} />
      <HeaderMo isScrolled={isScrolled} />
    </>
  );
}
