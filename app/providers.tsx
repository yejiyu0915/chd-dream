//! client

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
// import { usePathname } from 'next/navigation'; // usePathname 제거 (주석 해제)
import SmoothScroll from '@/common/components/utils/SmoothScroll'; // SmoothScroll 컴포넌트 임포트
import Lenis from '@studio-freight/lenis'; // Lenis 타입 임포트

declare global {
  interface Window {
    lenis?: Lenis | null; // Lenis 인스턴스를 window 객체에 접근 가능하도록 선언 (null도 허용)
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  // 경로 변경 시 스크롤을 페이지 최상단으로 이동 로직 제거 (페이지별 처리)
  // const pathname = usePathname();
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('Pathname changed to:', pathname, ' - Attempting to scroll to top.');
  //   if (window.lenis && typeof window.lenis.scrollTo === 'function') {
  //     // 특정 ID를 가진 요소로 스크롤 (예: info-main-content)
  //     window.lenis.scrollTo('#info-main-content', { duration: 0, immediate: true });
  //   } else {
  //     window.scrollTo(0, 0); // 일반 스크롤 사용
  //   }
  // }, [pathname]);

  // Lenis 인스턴스를 설정하는 함수
  const setLenisInstance = (lenisInstance: Lenis | null) => {
    window.lenis = lenisInstance; // window.lenis에 Lenis 인스턴스 할당
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll setLenisInstance={setLenisInstance}>{children}</SmoothScroll>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
