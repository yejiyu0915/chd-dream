'use client';

import m from '@/app/main/main.module.scss';
import Intro from '@/app/_main/intro/Intro';
import Sermon from '@/app/_main/sermon/Sermon';
import CLog from '@/app/_main/c-log/CLog';
import QuickLink from '@/app/_main/quick-link/QuickLink';
import Instagram from '@/app/_main/Instagram/Instagram';
import { SermonData } from '@/lib/notion';

interface MainContentInnerProps {
  sermonData: SermonData;
  kvHeight: string;
}

export default function MainContentInner({ sermonData, kvHeight }: MainContentInnerProps) {
  // kvHeight가 'vh' 단위인지 'px' 단위인지 확인하여 0.95를 곱합니다.
  const calculatedPaddingTop = kvHeight.endsWith('vh')
    ? `${parseFloat(kvHeight) * 0.95}vh`
    : `${parseFloat(kvHeight) * 0.95}px`;

  return (
    <div className={m.main__content} style={{ paddingTop: calculatedPaddingTop }}>
      <Sermon sermonData={sermonData} />
      <Intro />
      <CLog />
      <QuickLink />
      <Instagram />
    </div>
  );
}
