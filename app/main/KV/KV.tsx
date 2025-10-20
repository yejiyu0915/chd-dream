'use client';

import kv from '@/app/main/KV/KV.module.scss';
import KVNews from '@/app/main/KV/KVNews';
import KVSlider from '@/app/main/KV/KVSlider';
import { KVSliderItem } from '@/lib/notion'; // KVSliderItem 임포트
import { useEffect, useState } from 'react';

interface KVProps {
  kvSliderItems: KVSliderItem[];
  setKvHeightState: (height: string) => void; // 부모 컴포넌트에게 높이를 전달하는 함수
}

export default function KV({ kvSliderItems, setKvHeightState }: KVProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const [kvHeight, setKvHeight] = useState('100vh'); // 초기값은 항상 '100vh'로 설정

  useEffect(() => {
    // 모바일 디바이스 감지 함수
    const isMobileDevice = () => {
      return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768
      );
    };

    // 클라이언트 사이드에서만 window.innerHeight를 사용
    const setHeight = () => {
      const newHeight = `${window.innerHeight}px`;
      setKvHeight(newHeight);
      setKvHeightState(newHeight); // 부모 컴포넌트에게 높이 전달
    };

    // 모바일에서는 초기 높이만 설정하고 resize 이벤트 무시
    if (isMobileDevice()) {
      setHeight(); // 컴포넌트 마운트 시에만 높이 설정
    } else {
      // 데스크톱에서는 기존 동작 유지
      setHeight();
      window.addEventListener('resize', setHeight);
    }

    return () => {
      // 모바일이 아닌 경우에만 이벤트 리스너 제거
      if (!isMobileDevice()) {
        window.removeEventListener('resize', setHeight);
      }
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
