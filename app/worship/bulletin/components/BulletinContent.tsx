'use client';

import React, { memo, useState, useEffect } from 'react';
import BulletinContentSkeleton from '@/app/worship/bulletin/components/BulletinContentSkeleton';
import BulletinHeaderSkeleton from '@/app/worship/bulletin/components/BulletinHeaderSkeleton';
import { getClientSeason } from '@/common/utils/season';
import { motion } from 'framer-motion';
import b from '@/app/worship/bulletin/Bulletin.module.scss';
import mdx from '@/common/styles/mdx/MdxContent.module.scss';

interface BulletinItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  praise: string;
  slug: string;
  content?: string;
  thumbnail?: string;
}

interface BulletinContentProps {
  selectedBulletin: BulletinItem | null;
  latestBulletin: BulletinItem | null;
  bulletinContent: string;
  contentLoading: boolean;
  loadingStep: string;
  formatDate: (dateString: string) => {
    date: string;
    weekInfo: string;
  };
}

const BulletinContent = memo(function BulletinContent({
  selectedBulletin,
  latestBulletin,
  bulletinContent,
  contentLoading,
  loadingStep,
  formatDate,
}: BulletinContentProps) {
  const displayBulletin = selectedBulletin || latestBulletin;

  // 계절별 배경 이미지 자동 설정 (개발자 도구에서 data-season 변경 시 반응)
  const [backgroundImage, setBackgroundImage] = useState(`/images/bulletin/winter.jpg`);

  useEffect(() => {
    const season = getClientSeason();
    setBackgroundImage(`/images/bulletin/${season}.jpg`);

    // data-season 속성 변경 감지 (개발자 도구에서 테스트용)
    const observer = new MutationObserver(() => {
      const newSeason = getClientSeason();
      setBackgroundImage(`/images/bulletin/${newSeason}.jpg`);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-season'],
    });

    return () => observer.disconnect();
  }, []);

  // 데이터가 없을 때도 영역을 유지하여 CLS 방지
  if (!displayBulletin) {
    return (
      <div className={b.content} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <BulletinHeaderSkeleton />
      </div>
    );
  }

  const formattedDate = formatDate(displayBulletin.date);

  // 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.1,
      },
    }),
  };

  return (
    <div className={b.content} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={b.latest}>
        {/* 날짜 */}
        <motion.div
          className={b.latest__title}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <span className={b.latest__dateMain}>{formattedDate.date}</span>
          {formattedDate.weekInfo && (
            <span className={b.latest__dateWeek}>{formattedDate.weekInfo}</span>
          )}
        </motion.div>

        {/* 주일 오전 예배 */}
        <motion.h2
          className={b.latest__titleText}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          주일 오전 예배
        </motion.h2>

        {/* 주보 제목 */}
        <motion.h3
          className={b.latest__bulletinTitle}
          custom={2}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          {displayBulletin.title}
        </motion.h3>

        {/* 본문 말씀 & 찬양대 섹션 */}
        <motion.div
          className={b.latest__sections}
          custom={3}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className={b.latest__section}>
            <p className={b.latest__sectionTitle}>본문 말씀:</p>
            <p className={b.latest__summary}>{displayBulletin.summary}</p>
          </div>

          <div className={b.latest__section}>
            <p className={b.latest__sectionTitle}>해피니스 찬양대:</p>
            <p className={b.latest__praise}>{displayBulletin.praise}</p>
          </div>
        </motion.div>

        {/* 선택된 주보의 본문 내용 */}
        {selectedBulletin && (
          <>
            {contentLoading ? (
              <BulletinContentSkeleton />
            ) : (
              <motion.div
                className={b.latest__content}
                custom={4}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <h2 className="sr-only">
                  {selectedBulletin &&
                  latestBulletin &&
                  selectedBulletin.slug === latestBulletin.slug
                    ? '이번 주 주보'
                    : '주보 내용'}
                </h2>
                <div className={`${mdx.mdxContent} ${b.latest__contentBody}`}>
                  {/* 
                    보안: rehype-sanitize로 이미 서버에서 정제된 HTML이지만,
                    추가 보안을 위해 특정 태그/속성만 허용하는 것을 권장합니다.
                    현재는 Notion CMS를 신뢰하는 구조이므로 dangerouslySetInnerHTML 사용
                  */}
                  <div dangerouslySetInnerHTML={{ __html: bulletinContent }} />
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default BulletinContent;
