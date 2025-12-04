'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import type { GroupDataType } from '@/app/about/group/data/groupData';
import g from '@/app/about/group/Group.module.scss';

interface GroupNavProps {
  data: GroupDataType[];
}

// 요소가 컨테이너 내의 시작 부분에 정렬되어 있는지 확인하는 헬퍼 함수
const isElementAlignedToStart = (element: HTMLElement, container: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const tolerance = 1; // 픽셀 단위 허용 오차
  return Math.abs(elementRect.left - containerRect.left) <= tolerance;
};

export default function GroupNav({ data }: GroupNavProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLUListElement>(null);

  // 활성화된 항목을 맨 왼쪽으로 스크롤 (모바일에서만)
  useEffect(() => {
    if (scrollRef.current && window.innerWidth <= 768) {
      const activeElement = scrollRef.current.querySelector(`a.${g.active}`) as HTMLElement;
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
  }, [pathname]);

  // 내비게이션 컨테이너 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // 각 항목 간 딜레이
        delayChildren: 0.1, // 첫 항목 시작 딜레이
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
      className={g.nav}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={g.nav__wrapper}>
        <ul ref={scrollRef} className={g.nav__list}>
          {data.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.li
                key={item.id}
                className={g.nav__item}
                variants={itemVariants}
              >
                <Link
                  href={item.path}
                  className={`${g.nav__button} ${isActive ? g.active : ''}`}
                >
                  {item.title}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}
