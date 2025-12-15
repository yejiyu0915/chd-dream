'use client';

import { useState } from 'react';
import KV from '@/app/main/KV/KV';
import MainContentInner from '@/app/main/MainContentInner';
import { KVSliderItem, BulletinItem, CLogItem, NewsItem } from '@/lib/notion';

interface MainContentWrapperProps {
  kvSliderItems: KVSliderItem[];
  bulletinData: BulletinItem | null;
  cLogData: CLogItem[];
  newsData: NewsItem[];
}

export default function MainContentWrapper({
  kvSliderItems,
  bulletinData,
  cLogData,
  newsData,
}: MainContentWrapperProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const [kvHeight, setKvHeight] = useState('100vh'); // KV 높이 상태

  return (
    <>
      <KV kvSliderItems={kvSliderItems} newsData={newsData} setKvHeightState={setKvHeight} />
      <MainContentInner bulletinData={bulletinData} cLogData={cLogData} kvHeight={kvHeight} />
    </>
  );
}
