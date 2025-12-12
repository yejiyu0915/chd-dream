'use client';

import React, { memo, useState, useEffect, useRef } from 'react';
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
  const contentBodyRef = useRef<HTMLDivElement>(null);

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

  // 테이블 가로 스크롤을 위한 마우스 휠 이벤트 처리
  useEffect(() => {
    if (!bulletinContent || contentLoading) return;

    // 테이블 래퍼에 마우스 휠 이벤트 리스너 추가하는 함수
    const addWheelHandler = (wrapper: Element) => {
      // 이미 이벤트 리스너가 추가된 요소는 스킵
      if ((wrapper as HTMLElement).dataset.wheelHandler === 'true') return;

      const handleWheel = (e: Event) => {
        const wheelEvent = e as WheelEvent;
        const element = wrapper as HTMLElement;
        const canScrollHorizontally = element.scrollWidth > element.clientWidth;

        // 가로 스크롤이 가능한 경우에만 처리
        if (canScrollHorizontally) {
          // Shift 키를 누르고 있으면 가로 스크롤
          if (wheelEvent.shiftKey) {
            wheelEvent.preventDefault();
            element.scrollLeft += wheelEvent.deltaY;
          } else {
            // Shift 키 없이도 마우스 휠로 가로 스크롤 가능하도록
            // (테이블 영역에 마우스가 있을 때만)
            const rect = element.getBoundingClientRect();
            const isMouseOverTable =
              wheelEvent.clientX >= rect.left &&
              wheelEvent.clientX <= rect.right &&
              wheelEvent.clientY >= rect.top &&
              wheelEvent.clientY <= rect.bottom;

            if (isMouseOverTable) {
              wheelEvent.preventDefault();
              element.scrollLeft += wheelEvent.deltaY;
            }
          }
        }
      };

      wrapper.addEventListener('wheel', handleWheel, { passive: false });
      (wrapper as HTMLElement).dataset.wheelHandler = 'true';
    };

    // 테이블 래퍼 요소들을 찾아서 이벤트 리스너 추가
    const setupTableWheelScroll = () => {
      // 클래스명이 'table-wrapper'를 포함하는 모든 요소 찾기
      const tableWrappers = document.querySelectorAll('[class*="table-wrapper"]');
      tableWrappers.forEach(addWheelHandler);
    };

    // DOM이 업데이트된 후 실행
    const timeoutId = setTimeout(() => {
      setupTableWheelScroll();
    }, 100);

    // MutationObserver로 동적으로 추가되는 테이블도 감지
    const contentBody = contentBodyRef.current;
    if (contentBody) {
      const observer = new MutationObserver(() => {
        setupTableWheelScroll();
      });

      observer.observe(contentBody, {
        childList: true,
        subtree: true,
      });

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [bulletinContent, contentLoading]);

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
                <div ref={contentBodyRef} className={`${mdx.mdxContent} ${b.latest__contentBody}`}>
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
