'use client';

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
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

const BulletinContent = memo(
  function BulletinContent({
    selectedBulletin,
    latestBulletin,
    bulletinContent,
    contentLoading,
    loadingStep,
    formatDate,
  }: BulletinContentProps) {
    const displayBulletin = selectedBulletin || latestBulletin;
    const contentBodyRef = useRef<HTMLDivElement>(null);

    // 포맷된 날짜를 메모이제이션 (복잡한 계산이므로 수동 최적화)
    const formattedDate = useMemo(() => {
      if (!displayBulletin) return { date: '', weekInfo: '' };
      return formatDate(displayBulletin.date);
    }, [displayBulletin, formatDate]);

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

    // 애니메이션 variants (메모이제이션)
    const itemVariants = useMemo(
      () => ({
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
      }),
      []
    );

    // 선택된 주보 ID를 key로 사용하여 컨텐츠만 교체 (레이아웃은 유지)
    const contentKey = useMemo(
      () => selectedBulletin?.id || latestBulletin?.id || 'default',
      [selectedBulletin?.id, latestBulletin?.id]
    );

    return (
      <div className={b.content} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={b.latest}>
          {/* 레이아웃 고정 영역 - 애니메이션은 초기 마운트 시에만 실행 */}
          <div className={b.latest__header}>
            {/* 날짜 */}
            <motion.div
              className={b.latest__title}
              custom={0}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              key={`date-${contentKey}`}
            >
              <span className={b.latest__dateMain}>{formattedDate.date}</span>
              {formattedDate.weekInfo && (
                <span className={b.latest__dateWeek}>{formattedDate.weekInfo}</span>
              )}
            </motion.div>

            {/* 11시 오전 예배 */}
            <motion.h2
              className={b.latest__titleText}
              custom={1}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              key={`title-${contentKey}`}
            >
              11시 오전 예배
            </motion.h2>

            {/* 주보 제목 */}
            <motion.h3
              className={b.latest__bulletinTitle}
              custom={2}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              key={`bulletin-title-${contentKey}`}
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
              key={`sections-${contentKey}`}
            >
              <div className={b.latest__section}>
                <p className={b.latest__sectionTitle}>본문 말씀:</p>
                <p className={b.latest__summary}>{displayBulletin.summary}</p>
              </div>

              <div className={b.latest__section}>
                <p className={b.latest__sectionTitle}>해피니스 성가대:</p>
                <p className={b.latest__praise}>{displayBulletin.praise}</p>
              </div>
            </motion.div>
          </div>

          {/* 컨텐츠 영역만 교체 - key를 사용하여 부드러운 전환 */}
          {selectedBulletin && (
            <div className={b.latest__contentWrapper} key={`content-wrapper-${contentKey}`}>
              {contentLoading ? (
                <BulletinContentSkeleton />
              ) : (
                <motion.div
                  className={b.latest__content}
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  key={`content-${contentKey}`}
                >
                  <h2 className="sr-only">
                    {selectedBulletin &&
                    latestBulletin &&
                    selectedBulletin.slug === latestBulletin.slug
                      ? '이번 주 주보'
                      : '주보 내용'}
                  </h2>
                  <div
                    ref={contentBodyRef}
                    className={`${mdx.mdxContent} ${b.latest__contentBody}`}
                  >
                    {/* 
                    보안: rehype-sanitize로 이미 서버에서 정제된 HTML이지만,
                    추가 보안을 위해 특정 태그/속성만 허용하는 것을 권장합니다.
                    현재는 Notion CMS를 신뢰하는 구조이므로 dangerouslySetInnerHTML 사용
                  */}
                    <div dangerouslySetInnerHTML={{ __html: bulletinContent }} />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
  // 수동 비교 함수 - 복잡한 props이므로 명시적 최적화
  (prevProps, nextProps) => {
    // selectedBulletin이 변경되었는지 확인
    if (prevProps.selectedBulletin?.id !== nextProps.selectedBulletin?.id) {
      return false; // 리렌더링 필요
    }

    // latestBulletin이 변경되었는지 확인
    if (prevProps.latestBulletin?.id !== nextProps.latestBulletin?.id) {
      return false; // 리렌더링 필요
    }

    // bulletinContent가 변경되었는지 확인
    if (prevProps.bulletinContent !== nextProps.bulletinContent) {
      return false; // 리렌더링 필요
    }

    // contentLoading이 변경되었는지 확인
    if (prevProps.contentLoading !== nextProps.contentLoading) {
      return false; // 리렌더링 필요
    }

    // loadingStep이 변경되었는지 확인
    if (prevProps.loadingStep !== nextProps.loadingStep) {
      return false; // 리렌더링 필요
    }

    // 모든 props가 동일하면 리렌더링 불필요
    return true;
  }
);

export default BulletinContent;
