'use client';

import { useRef } from 'react';
import type { SermonDataType } from '@/app/worship/sermon/data/sermonData';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/worship/sermon/Sermon.module.scss';

interface SermonContentProps {
  data: SermonDataType;
  prevSermon: SermonDataType | null; // 이전 설교
  nextSermon: SermonDataType | null; // 다음 설교
  onSelect?: (id: string) => void; // 설교 선택 핸들러 (클라이언트 컴포넌트에서 사용)
}

export default function SermonContent({
  data,
  prevSermon,
  nextSermon,
  onSelect,
}: SermonContentProps) {
  const ContentComponent = data.component; // 동적 컴포넌트 할당
  const contentRef = useRef<HTMLDivElement>(null); // content 영역 참조

  // 모바일 네비게이션 클릭 시 상단으로 스크롤하는 핸들러
  const handleNavClick = (id: string) => {
    // 먼저 설교 변경
    onSelect?.(id);

    // 약간의 딜레이 후 스크롤 (컨텐츠 렌더링 대기)
    setTimeout(() => {
      // Lenis 라이브러리가 있으면 부드러운 스크롤 사용
      if (window.lenis && contentRef.current) {
        window.lenis.scrollTo(contentRef.current, {
          duration: 1.2,
          offset: -100, // 헤더 높이만큼 여유 공간
        });
      } else if (contentRef.current) {
        // Lenis가 없으면 기본 스크롤 사용
        const headerOffset = 100;
        const elementPosition = contentRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <>
      <div className={s.content} ref={contentRef}>
        <div className={s.content__header}>
          <h2 className={s.content__title}>{data.title}</h2>
          <p className={s.content__speaker}>담임목사: 김영구</p>
        </div>
        <div className={s.content__body}>
          {/* 각 설교 컴포넌트 렌더링 */}
          <ContentComponent />
        </div>
      </div>

      {/* 모바일 하단 네비게이션 */}
      <div className={s.mobileNav}>
        {prevSermon ? (
          <button
            type="button"
            className={s.mobileNav__button}
            onClick={() => handleNavClick(prevSermon.id)}
          >
            <Icon name="arrow-up" />
            이전글: <span className={s.mobileNav__title}>{prevSermon.title}</span>
          </button>
        ) : (
          <div className={s.mobileNav__empty}></div>
        )}
        {nextSermon ? (
          <button
            type="button"
            className={s.mobileNav__button}
            onClick={() => handleNavClick(nextSermon.id)}
          >
            <Icon name="arrow-down" />
            다음글: <span className={s.mobileNav__title}>{nextSermon.title}</span>
          </button>
        ) : (
          <div className={s.mobileNav__empty}></div>
        )}
      </div>
    </>
  );
}
