'use client';

import kv from '@/app/main/KV/KV.module.scss';
import KVNews from '@/app/_main/KV/KVNews';
import KVSlider from '@/app/_main/KV/KVSlider';
import { KVSliderItem } from '@/lib/notion'; // KVSliderItem 임포트
import { useEffect, useState } from 'react';

interface KVProps {
  kvSliderItems: KVSliderItem[];
  setKvHeightState: (height: string) => void; // 부모 컴포넌트에게 높이를 전달하는 함수
}

export default function KV({ kvSliderItems, setKvHeightState }: KVProps) {
  const [kvHeight, setKvHeight] = useState('100vh'); // 초기값은 항상 '100vh'로 설정

  useEffect(() => {
    // 클라이언트 사이드에서만 window.innerHeight를 사용
    const setHeight = () => {
      const newHeight = `${window.innerHeight}px`;
      setKvHeight(newHeight);
      setKvHeightState(newHeight); // 부모 컴포넌트에게 높이 전달
    };

    setHeight(); // 컴포넌트 마운트 시 높이 설정
    window.addEventListener('resize', setHeight); // 리사이즈 시 높이 재설정

    return () => {
      window.removeEventListener('resize', setHeight); // 클린업
    };
  }, [setKvHeightState]);

  return (
    <div className={kv.kv} style={{ height: kvHeight }}>
      <KVSlider kvSliderItems={kvSliderItems} kvHeight={kvHeight} />{' '}
      {/* kvSliderItems, kvHeight prop으로 전달 */}
      <KVNews />
    </div>
  );
}
