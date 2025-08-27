'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Lenis 인스턴스 생성
    const lenis = new Lenis({
      duration: 1.5, // 스크롤 애니메이션 지속 시간
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 이징 함수
      direction: 'vertical', // 세로 스크롤
      gestureDirection: 'vertical', // 제스처 방향
      smooth: true, // 부드러운 스크롤 활성화
      mouseMultiplier: 1, // 마우스 휠 감도
      smoothTouch: false, // 터치 디바이스에서는 비활성화 (성능상)
      touchMultiplier: 2, // 터치 감도
      infinite: false, // 무한 스크롤 비활성화
    });

    // RAF (RequestAnimationFrame) 함수
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // 애니메이션 프레임 시작
    requestAnimationFrame(raf);

    // 컴포넌트 언마운트 시 정리
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
