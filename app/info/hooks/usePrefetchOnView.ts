'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 링크가 뷰포트에 보이면 자동으로 프리패치하는 커스텀 훅
 * 모바일 환경에서 특히 유용함
 */
export function usePrefetchOnView(href: string, options = { threshold: 0.5, rootMargin: '100px' }) {
  const router = useRouter();
  const elementRef = useRef<HTMLElement | null>(null);
  const hasPrefetched = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !href || href === '#' || hasPrefetched.current) return;

    // Intersection Observer로 요소가 뷰포트에 보이는지 감지
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 요소가 화면에 보이고, 아직 프리패치하지 않았다면
          if (entry.isIntersecting && !hasPrefetched.current) {
            router.prefetch(href);
            hasPrefetched.current = true;
            // 한 번 프리패치하면 observer 해제
            observer.disconnect();
          }
        });
      },
      {
        threshold: options.threshold, // 50% 보이면 트리거
        rootMargin: options.rootMargin, // 뷰포트 100px 전부터 감지
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [href, router, options.threshold, options.rootMargin]);

  return elementRef;
}
