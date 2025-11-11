'use client';

import React, { memo, useState, useEffect } from 'react';
import BulletinContentSkeleton from '@/app/worship/bulletin/components/BulletinContentSkeleton';
import BulletinHeaderSkeleton from '@/app/worship/bulletin/components/BulletinHeaderSkeleton';
import { getClientSeason } from '@/common/utils/season';
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
  const [backgroundImage, setBackgroundImage] = useState(
    `/images/bulletin/winter.jpg`
  );

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
      <div 
        className={b.content}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BulletinHeaderSkeleton />
      </div>
    );
  }

  const formattedDate = formatDate(displayBulletin.date);

  return (
    <div 
      className={b.content}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={b.latest}>
        <div className={b.latest__title}>
          <span className={b.latest__dateMain}>{formattedDate.date}</span>
          {formattedDate.weekInfo && (
            <span className={b.latest__dateWeek}>{formattedDate.weekInfo}</span>
          )}
        </div>
        <h2 className={b.latest__titleText}>주일 오전 예배</h2>
        <h3 className={b.latest__bulletinTitle}>{displayBulletin.title}</h3>

        <div className={b.latest__sections}>
          <div className={b.latest__section}>
            <p className={b.latest__sectionTitle}>본문 말씀:</p>
            <p className={b.latest__summary}>{displayBulletin.summary}</p>
          </div>

          <div className={b.latest__section}>
            <p className={b.latest__sectionTitle}>해피니스 찬양대:</p>
            <p className={b.latest__praise}>{displayBulletin.praise}</p>
          </div>
        </div>

        {/* 선택된 주보의 본문 내용 */}
        {selectedBulletin && (
          <>
            {contentLoading ? (
              <BulletinContentSkeleton />
            ) : (
              <div className={b.latest__content}>
                <h2 className="sr-only">
                  {selectedBulletin &&
                  latestBulletin &&
                  selectedBulletin.slug === latestBulletin.slug
                    ? '이번 주 주보'
                    : '주보 내용'}
                </h2>
                <div className={`${mdx.mdxContent} ${b.latest__contentBody}`}>
                  <div dangerouslySetInnerHTML={{ __html: bulletinContent }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default BulletinContent;
