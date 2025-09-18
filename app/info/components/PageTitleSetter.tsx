'use client';

import { useEffect } from 'react';
import { usePageTitle } from '@/app/info/utils/title-context';
import Lenis from '@studio-freight/lenis'; // Lenis 타입 임포트 (window.lenis 사용을 위해)

declare global {
  interface Window {
    lenis?: Lenis | null; // Lenis 인스턴스를 window 객체에 접근 가능하도록 선언 (null도 허용)
  }
}

interface PageTitleSetterProps {
  title: string;
}

export default function PageTitleSetter({ title }: PageTitleSetterProps) {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle(title);

    // 페이지 마운트 시 스크롤을 최상단으로 부드럽게 이동 (0.1초 딜레이 추가)
    const timer = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        window.lenis &&
        typeof window.lenis.scrollTo === 'function'
      ) {
        window.lenis.scrollTo(0, { duration: 0.7 }); // Lenis 스크롤 사용 (부드러운 이동을 위해 duration 0.7초로 조정)
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 일반 스크롤 사용 시 부드럽게 이동
      }
    }, 300); // 0.1초 (100ms) 딜레이

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [setPageTitle, title]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고, 제목 설정 역할만 수행합니다.
}
