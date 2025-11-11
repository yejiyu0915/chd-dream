'use client';

import { useEffect, useState } from 'react';
import Icon from './Icons';

export default function TopButton() {
  // Top 버튼 표시 여부 상태
  const [isVisible, setIsVisible] = useState(false);

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

  // 최상단으로 스크롤하는 핸들러
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`top-button ${isVisible ? 'top-button--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
    >
      <Icon name="arrow-top" />
    </button>
  );
}
