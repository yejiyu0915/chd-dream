'use client';

import { useState } from 'react';
import KV from '@/app/_main/KV/KV';
import MainContentInner from '@/app/_main/MainContentInner';
import { KVSliderItem, SermonData } from '@/lib/notion';

interface MainContentWrapperProps {
  kvSliderItems: KVSliderItem[];
  sermonData: SermonData;
}

export default function MainContentWrapper({ kvSliderItems, sermonData }: MainContentWrapperProps) {
  const [kvHeight, setKvHeight] = useState('100vh'); // KV 높이 상태

  return (
    <>
      <KV kvSliderItems={kvSliderItems} setKvHeightState={setKvHeight} />
      <MainContentInner sermonData={sermonData} kvHeight={kvHeight} />
    </>
  );
}
