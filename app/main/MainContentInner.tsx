'use client';

import m from '@/app/main/main.module.scss';
import Intro from '@/app/main/intro/Intro';
import Bulletin from '@/app/main/bulletin/Bulletin';
import CLog from '@/app/main/c-log/CLog';
import QuickLink from '@/app/main/quick-link/QuickLink';
import Instagram from '@/app/main/Instagram/Instagram';
import { BulletinItem } from '@/lib/notion';

interface MainContentInnerProps {
  bulletinData: BulletinItem;
  kvHeight: string;
}

export default function MainContentInner({ bulletinData, kvHeight }: MainContentInnerProps) {
  'use memo'; // React 컴파일러 최적화 적용

  // kvHeight가 'vh' 단위인지 'px' 단위인지 확인하여 0.95를 곱합니다.
  const calculatedPaddingTop = kvHeight.endsWith('vh')
    ? `${parseFloat(kvHeight) * 0.95}vh`
    : `${parseFloat(kvHeight) * 0.95}px`;

  return (
    <div className={m.main__content} style={{ paddingTop: calculatedPaddingTop }}>
      <Bulletin />
      <div style={{ backgroundColor: 'var(--bg-page)' }}>
        <Intro />
        <CLog />
        <QuickLink />
        <Instagram />
      </div>
    </div>
  );
}
