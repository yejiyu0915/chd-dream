'use client';

import kv from '@/app/main/KV/KV.module.scss';
import KVNews from '@/app/main/KV/KVNews';
import KVSlider from '@/app/main/KV/KVSlider';
import { KVSliderItem, NewsItem } from '@/lib/notion'; // NewsItem 임포트 추가
import { useEffect, useState } from 'react';

interface KVProps {
  kvSliderItems: KVSliderItem[];
  newsData: NewsItem[];
  setKvHeightState: (height: string) => void; // 부모 컴포넌트에게 높이를 전달하는 함수
}

export default function KV({ kvSliderItems, newsData, setKvHeightState }: KVProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const [kvHeight, setKvHeight] = useState('100vh');

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;

    /** 주소창·툴바 변화 반영: visualViewport 우선, 없으면 innerHeight */
    const readVisibleHeight = () =>
      window.visualViewport?.height ?? window.innerHeight;

    const setHeight = () => {
      const h = readVisibleHeight();
      if (h <= 0) return;
      const newHeight = `${h}px`;
      setKvHeight(newHeight);
      setKvHeightState(newHeight);
    };

    let rafId = 0;
    const scheduleHeight = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setHeight();
        rafId = 0;
      });
    };

    setHeight();

    window.addEventListener('resize', isMobile ? scheduleHeight : setHeight);

    const vv = window.visualViewport;
    if (vv && isMobile) {
      vv.addEventListener('resize', scheduleHeight);
      vv.addEventListener('scroll', scheduleHeight);
    }

    const orientationTimers: number[] = [];
    const onOrientationChange = () => {
      orientationTimers.forEach(clearTimeout);
      orientationTimers.length = 0;
      [0, 50, 200, 500].forEach((ms) => {
        orientationTimers.push(window.setTimeout(setHeight, ms));
      });
    };

    if (isMobile) {
      window.addEventListener('orientationchange', onOrientationChange);
    }

    return () => {
      window.removeEventListener('resize', isMobile ? scheduleHeight : setHeight);
      if (vv && isMobile) {
        vv.removeEventListener('resize', scheduleHeight);
        vv.removeEventListener('scroll', scheduleHeight);
      }
      if (isMobile) {
        window.removeEventListener('orientationchange', onOrientationChange);
      }
      orientationTimers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [setKvHeightState]);

  // 슬라이드 1개일 때 singleSlide 클래스 추가 (네비게이션/인디케이터 없을 때 레이아웃 조정용)
  const isSingleSlide = kvSliderItems.length === 1;

  return (
    <div className={`${kv.kv} ${isSingleSlide ? kv.singleSlide : ''}`} style={{ height: kvHeight }}>
      <KVSlider initialKvSliderItems={kvSliderItems} kvHeight={kvHeight} />{' '}
      {/* 서버에서 받은 데이터를 initialData로 전달 */}
      <KVNews initialNewsData={newsData} />
    </div>
  );
}
