'use client';

import React from 'react';
import Spinner from '@/common/components/utils/Spinner';
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

export default function BulletinContent({
  selectedBulletin,
  latestBulletin,
  bulletinContent,
  contentLoading,
  loadingStep,
  formatDate,
}: BulletinContentProps) {
  const displayBulletin = selectedBulletin || latestBulletin;

  if (!displayBulletin) {
    return null;
  }

  const formattedDate = formatDate(displayBulletin.date);

  return (
    <div className={b.content}>
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
          <div className={b.latest__content}>
            <h2 className={b.latest__contentTitle}>
              {selectedBulletin && latestBulletin && selectedBulletin.slug === latestBulletin.slug
                ? '이번 주 주보'
                : '주보 내용'}
            </h2>
            {contentLoading ? (
              <div className={b.latest__contentLoading}>
                <Spinner />
                <span>{loadingStep || '내용을 불러오는 중...'}</span>
              </div>
            ) : (
              <div className={`${mdx.mdxContent} ${b.latest__contentBody}`}>
                <div dangerouslySetInnerHTML={{ __html: bulletinContent }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
