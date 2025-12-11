'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sermonData } from '@/app/worship/sermon/data/sermonData';
import SermonNav from '@/app/worship/sermon/components/SermonNav';
import SermonContent from '@/app/worship/sermon/components/SermonContent';
import s from '@/app/worship/sermon/Sermon.module.scss';

interface SermonClientProps {
  contentParam: string | null;
}

export default function SermonClient({ contentParam }: SermonClientProps) {
  const router = useRouter();

  // URL 파라미터에서 content 값을 가져와서 인덱스로 변환 (1부터 시작 → 0부터 시작으로)
  const contentIndex = contentParam ? parseInt(contentParam, 10) - 1 : 0;

  // 유효한 인덱스인지 확인 후 초기 ID 설정
  const validIndex = contentIndex >= 0 && contentIndex < sermonData.length ? contentIndex : 0;
  const initialId = sermonData[validIndex].id;

  const [activeId, setActiveId] = useState(initialId);

  // URL 파라미터가 변경되면 activeId 업데이트
  useEffect(() => {
    if (contentParam) {
      const index = parseInt(contentParam, 10) - 1;
      if (index >= 0 && index < sermonData.length) {
        setActiveId(sermonData[index].id);
      }
    }
  }, [contentParam]);

  // 현재 선택된 데이터 찾기
  const activeData = sermonData.find((item) => item.id === activeId) || sermonData[0];

  // activeId 변경 시 스크롤 최상단으로 즉시 이동 (smooth 효과 없이)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeId]);

  // 설교 선택 시 URL 파라미터 업데이트 (ID를 숫자 인덱스로 변환)
  const handleSermonSelect = (id: string) => {
    setActiveId(id);
    const index = sermonData.findIndex((item) => item.id === id);
    const contentNumber = index + 1; // 1부터 시작하는 숫자로 변환
    router.push(`/worship/sermon?content=${contentNumber}`, { scroll: false });
  };

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
          <SermonNav data={sermonData} activeId={activeId} onSelect={handleSermonSelect} />

          {/* 오른쪽 본문 */}
          <SermonContent
            data={activeData}
            prevSermon={prevSermon}
            nextSermon={nextSermon}
            onSelect={handleSermonSelect}
          />
        </div>
      </div>
    </>
  );
}
