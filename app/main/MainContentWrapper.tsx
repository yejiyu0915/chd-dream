'use client';

import { useState } from 'react';
import KV from '@/app/main/KV/KV';
import MainContentInner from '@/app/main/MainContentInner';
import { KVSliderItem, BulletinItem } from '@/lib/notion';

interface MainContentWrapperProps {
  kvSliderItems: KVSliderItem[];
  bulletinData: BulletinItem;
}

export default function MainContentWrapper({
  kvSliderItems,
  bulletinData,
}: MainContentWrapperProps) {
  const [kvHeight, setKvHeight] = useState('100vh'); // KV 높이 상태

  return (
    <>
      <KV kvSliderItems={kvSliderItems} setKvHeightState={setKvHeight} />
      <MainContentInner bulletinData={bulletinData} kvHeight={kvHeight} />
    </>
  );
}
