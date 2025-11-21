'use client';

import type { GroupDataType } from '@/app/about/group/data/groupData';
import { motion } from 'framer-motion';
import g from '@/app/about/group/Group.module.scss';

interface GroupContentProps {
  data: GroupDataType;
  prevGroup: GroupDataType | null; // 이전 교구
  nextGroup: GroupDataType | null; // 다음 교구
  onSelect?: (id: string) => void; // 교구 선택 핸들러
}

export default function GroupContent({
  data,
  prevGroup,
  nextGroup,
  onSelect,
}: GroupContentProps) {
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
      <div className={g.content}>
        {/* 헤더 - 제목 */}
        <motion.h2
          className={g.content__header}
          key={data.id} // 교구 변경 시 애니메이션 재실행
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          {data.title}
        </motion.h2>

        {/* 본문 내용 */}
        <motion.div
          className={g.content__body}
          key={`${data.id}-body`} // 교구 변경 시 애니메이션 재실행
          initial="hidden"
          animate="visible"
          variants={bodyVariants}
        >
          {/* 각 교구 컴포넌트 렌더링 */}
          <ContentComponent />
        </motion.div>
      </div>

      {/* 모바일 하단 네비게이션 */}
      <div className={g.mobileNav}>
        {prevGroup ? (
          <button
            type="button"
            className={g.mobileNav__button}
            onClick={() => handleNavClick(prevGroup.id)}
          >
            이전: <span className={g.mobileNav__title}>{prevGroup.title}</span>
          </button>
        ) : (
          <div className={g.mobileNav__empty}></div>
        )}
        {nextGroup ? (
          <button
            type="button"
            className={g.mobileNav__button}
            onClick={() => handleNavClick(nextGroup.id)}
          >
            다음: <span className={g.mobileNav__title}>{nextGroup.title}</span>
          </button>
        ) : (
          <div className={g.mobileNav__empty}></div>
        )}
      </div>
    </>
  );
}

