'use client';

import { useEffect, useState } from 'react';
import Icon from './Icons';

export default function TopButton() {
  // Top 버튼 표시 여부 상태
  const [isVisible, setIsVisible] = useState(false);
  // Footer 도달 여부 상태
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      // 스크롤 위치가 300px 이상이면 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Footer 감지 로직
  useEffect(() => {
    // footer 요소 선택
    const footer = document.querySelector('footer');

    if (!footer) return;

    // IntersectionObserver로 footer가 화면에 보이는지 감지
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // footer가 화면에 보이면 버튼 숨김, 아니면 표시
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      {
        // 화면의 하단에서 감지 (10% 정도 여유)
        rootMargin: '0px 0px -10% 0px',
        threshold: 0,
      }
    );

    observer.observe(footer);

    // cleanup: observer 해제
    return () => {
      observer.disconnect();
    };
  }, []);

  // 최상단으로 스크롤하는 핸들러
  const scrollToTop = () => {
    // Lenis 라이브러리가 있으면 부드러운 스크롤 사용
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 0.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Lenis가 없으면 기본 스크롤 사용
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 버튼 표시 조건: 스크롤이 300px 이상이고, footer가 보이지 않을 때
  const shouldShowButton = isVisible && !isFooterVisible;

  return (
    <button
      className={`top-button ${shouldShowButton ? 'top-button--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
    >
      <Icon name="arrow-top" />
    </button>
  );
}
