'use client';

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

  // 모바일 네비게이션 클릭 시 최상단으로 스크롤하는 핸들러
  const handleNavClick = (id: string) => {
    // 먼저 스크롤을 최상단으로 이동 (리렌더링 전에 실행)
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 0.6,
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    // 스크롤 후 설교 변경 (약간의 딜레이를 주어 충돌 방지)
    setTimeout(() => {
      onSelect?.(id);
    }, 50);
  };

  return (
    <>
      <div className={s.content}>
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
