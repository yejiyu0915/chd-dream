'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { categoryOrder } from '../data/servantData';
import s from '../Servant.module.scss';

// 요소가 컨테이너 내의 시작 부분에 정렬되어 있는지 확인하는 헬퍼 함수
const isElementAlignedToStart = (element: HTMLElement, container: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const tolerance = 1; // 픽셀 단위 허용 오차
  return Math.abs(elementRect.left - containerRect.left) <= tolerance;
};

export default function ServantNav() {
  const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollRef = useRef<HTMLUListElement>(null);

  // 각 카테고리 섹션의 가시성 감지
  useEffect(() => {
    const sections = categoryOrder.map((category) => {
      const element = document.getElementById(`category-${category}`);
      return { category, element };
    });

    // Intersection Observer로 현재 보이는 섹션 감지
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.id.replace('category-', '');
            setActiveCategory(category);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // 섹션이 상단 20% 지점에 도달하면 활성화
        threshold: 0,
      }
    );

    sections.forEach(({ element }) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        sections.forEach(({ element }) => {
          if (element) {
            observerRef.current?.unobserve(element);
          }
        });
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 활성화된 항목을 맨 왼쪽으로 스크롤 (모바일)
  useEffect(() => {
    if (scrollRef.current && window.innerWidth <= 768) {
      const activeElement = scrollRef.current.querySelector(`a.${s.active}`) as HTMLElement;
      if (
        activeElement &&
        !isElementAlignedToStart(activeElement, scrollRef.current)
      ) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  }, [activeCategory]);

  // 내비게이션 클릭 핸들러
  const handleNavClick = (category: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(`category-${category}`);
    if (element) {
      // 모바일에서 sticky 내비게이션 높이 계산
      const isMobile = window.innerWidth <= 768;
      let offset = 100; // 기본 헤더 높이 (PC)

      if (isMobile) {
        // 모바일: 헤더 높이 + sticky 내비게이션 높이
        const navElement = document.querySelector(`.${s.nav}`) as HTMLElement;
        const headerElement = document.querySelector('header') as HTMLElement;
        
        if (navElement && headerElement) {
          const headerHeight = headerElement.offsetHeight;
          const navHeight = navElement.offsetHeight;
          offset = headerHeight + navHeight + 20; // 여유 공간 추가
        } else {
          // 요소를 찾지 못한 경우 기본값 사용
          offset = 150; // 모바일 기본값 (헤더 72px + 내비게이션 약 50px + 여유)
        }
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // 내비게이션 컨테이너 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  // 내비게이션 항목 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.nav
      className={s.nav}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={s.nav__wrapper}>
        <ul ref={scrollRef} className={s.nav__list}>
          {categoryOrder.map((category) => {
            const isActive = activeCategory === category;
            return (
              <motion.li
                key={category}
                className={s.nav__item}
                variants={itemVariants}
              >
                <a
                  href={`#category-${category}`}
                  onClick={(e) => handleNavClick(category, e)}
                  className={`${s.nav__button} ${isActive ? s.active : ''}`}
                >
                  {category}
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}

