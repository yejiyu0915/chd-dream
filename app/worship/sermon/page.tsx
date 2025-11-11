'use client';

import { useState, useEffect } from 'react';
import { sermonData } from '@/app/worship/sermon/data/sermonData';
import SermonNav from '@/app/worship/sermon/components/SermonNav';
import SermonContent from '@/app/worship/sermon/components/SermonContent';
import s from '@/app/worship/sermon/Sermon.module.scss';

export default function SermonPage() {
  // 첫 번째 항목을 기본 활성화
  const [activeId, setActiveId] = useState(sermonData[0].id);

  // 현재 선택된 데이터 찾기
  const activeData = sermonData.find((item) => item.id === activeId) || sermonData[0];

  // activeId 변경 시 스크롤 최상단으로 즉시 이동 (smooth 효과 없이)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeId]);

  // 현재 인덱스 찾기
  const currentIndex = sermonData.findIndex((item) => item.id === activeId);

  // 이전/다음 설교 계산
  const prevSermon = currentIndex > 0 ? sermonData[currentIndex - 1] : null;
  const nextSermon = currentIndex < sermonData.length - 1 ? sermonData[currentIndex + 1] : null;

  return (
    <>
      <div className={`${s.sermon} detail-inner`}>
        <div className={s.inner}>
          {/* 왼쪽 내비게이션 */}
          <SermonNav data={sermonData} activeId={activeId} onSelect={setActiveId} />

          {/* 오른쪽 본문 */}
          <SermonContent
            data={activeData}
            prevSermon={prevSermon}
            nextSermon={nextSermon}
            onSelect={setActiveId}
          />
        </div>
      </div>
    </>
  );
}
