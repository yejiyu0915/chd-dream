'use client';

import { useState } from 'react';
import PageTitleSetter from '@/app/worship/components/PageTitleSetter';
import { sermonData } from './data/sermonData';
import SermonNav from './components/SermonNav';
import SermonContent from './components/SermonContent';
import s from './Sermon.module.scss';

export default function SermonPage() {
  // 첫 번째 항목을 기본 활성화
  const [activeId, setActiveId] = useState(sermonData[0].id);

  // 현재 선택된 데이터 찾기
  const activeData = sermonData.find((item) => item.id === activeId) || sermonData[0];

  return (
    <>
      {/* 페이지 타이틀 설정 */}
      <PageTitleSetter title="생명의 말씀" />

      <div className={`${s.sermon} detail-inner`}>
        <div className={s.sermon__inner}>
          {/* 왼쪽 내비게이션 */}
          <SermonNav data={sermonData} activeId={activeId} onSelect={setActiveId} />

          {/* 오른쪽 본문 */}
          <SermonContent data={activeData} />
        </div>
      </div>
    </>
  );
}
