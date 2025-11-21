'use client';

import type { SermonDataType } from '@/app/worship/sermon/data/sermonData';
import Icon from '@/common/components/utils/Icons';
import { motion } from 'framer-motion';
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

  // 모바일 네비게이션 클릭 핸들러
  const handleNavClick = (id: string) => {
    onSelect?.(id);
  };

  // 애니메이션 variants
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const bodyVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.15,
      },
    },
  };

  return (
    <>
      <div className={s.content}>
        {/* 헤더 - 제목과 담임목사 */}
        <motion.div
          className={s.content__header}
          key={data.id} // 설교 변경 시 애니메이션 재실행
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <h2 className={s.content__title}>{data.title}</h2>
          <p className={s.content__speaker}>담임목사: 김영구</p>
        </motion.div>

        {/* 본문 내용 */}
        <motion.div
          className={s.content__body}
          key={`${data.id}-body`} // 설교 변경 시 애니메이션 재실행
          initial="hidden"
          animate="visible"
          variants={bodyVariants}
        >
          {/* 각 설교 컴포넌트 렌더링 */}
          <ContentComponent />
        </motion.div>
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
