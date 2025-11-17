'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/common/components/layouts/Breadcrumbs';
import { getPageMeta } from '@/common/data/list';
import { getClientSeason } from '@/common/utils/season';
import { motion } from 'framer-motion';
import s from './SectionLayout.module.scss';

interface SectionLayoutProps {
  children: React.ReactNode;
  sectionName: string; // 'about', 'worship', 'info', 'location' 등
  backgroundImage?: string; // 배경 이미지 경로 (선택적, 미지정시 계절별 자동 경로)
  isLightText?: boolean; // true: 화이트 텍스트(about), false: 블랙 텍스트(기본)
  // 아래 props는 선택적으로 override 가능 (기본값은 list.ts에서 자동으로 가져옴)
  titleOverride?: string; // 페이지 제목을 강제로 설정할 때 사용
  descriptionOverride?: string; // 페이지 설명을 강제로 설정할 때 사용
}

/**
 * 섹션별 공통 레이아웃 컴포넌트
 * about, worship, info, location 등 모든 섹션에서 재사용 가능
 * list.ts의 pageMeta에서 자동으로 title/description을 가져옵니다.
 * 계절별로 배경 이미지가 자동으로 변경됩니다.
 */
export default function SectionLayout({
  children,
  sectionName,
  backgroundImage,
  isLightText = false,
  titleOverride,
  descriptionOverride,
}: SectionLayoutProps) {
  const pathname = usePathname();

  // 계절별 배경 이미지 (서버와 클라이언트 초기값 동일하게 설정)
  const [currentBgImage, setCurrentBgImage] = useState(
    backgroundImage || `/images/title/winter/${sectionName}.jpg`
  );

  // 클라이언트에서 실제 계절 이미지로 업데이트 + data-season 감지
  useEffect(() => {
    if (backgroundImage) return;

    // 실제 계절 이미지로 업데이트
    const season = getClientSeason();
    setCurrentBgImage(`/images/title/${season}/${sectionName}.jpg`);

    // data-season 속성 변경 감지 (개발자 도구에서 테스트용)
    const handleSeasonChange = () => {
      const newSeason = getClientSeason();
      setCurrentBgImage(`/images/title/${newSeason}/${sectionName}.jpg`);
    };

    const observer = new MutationObserver(handleSeasonChange);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-season'],
    });

    // cleanup: observer 연결 해제
    return () => observer.disconnect();
  }, [backgroundImage, sectionName]);

  // /<sectionName>/<category>/<slug> 패턴을 확인하여 상세 페이지인지 여부를 판단
  const isDetailPage = new RegExp(`/${sectionName}/[^/]+/[^/]+`).test(pathname);

  // list.ts의 getPageMeta를 사용하여 페이지 메타 정보 자동 가져오기
  const pageMeta = getPageMeta(pathname);

  // override가 있으면 우선 사용, 없으면 pageMeta에서 가져오기
  const pageTitle = titleOverride || pageMeta?.title || '';
  const pageDescription = descriptionOverride || pageMeta?.description || '';

  // 애니메이션 variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const descVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <main
      id="main-content"
      className={s.sectionLayout}
      style={{ '--bg-image': `url(${currentBgImage})` } as React.CSSProperties}
      data-light-text={isLightText}
      suppressHydrationWarning
    >
      <div className={s.titleSection}>
        <Breadcrumbs
          className={isDetailPage ? s.detailBreadcrumbs : s.breadcrumbs}
          isDetail={isDetailPage}
        />
        {!isDetailPage && (
          <div className={`${s.inner} inner`}>
            <div className={s.title}>
              <motion.h1
                className={s.pageTitle}
                initial="hidden"
                animate="visible"
                variants={titleVariants}
              >
                {pageTitle}
              </motion.h1>
              <motion.p
                className={s.pageDesc}
                initial="hidden"
                animate="visible"
                variants={descVariants}
              >
                {pageDescription}
              </motion.p>
            </div>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
