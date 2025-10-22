'use client';

import type { SermonDataType } from '../data/sermonData';
import s from '../Sermon.module.scss';

interface SermonContentProps {
  data: SermonDataType;
}

export default function SermonContent({ data }: SermonContentProps) {
  const ContentComponent = data.component; // 동적 컴포넌트 할당

  return (
    <div className={s.content}>
      <h2 className={s.content__title}>{data.title}</h2>
      <div className={s.content__body}>
        {/* 각 설교 컴포넌트 렌더링 */}
        <ContentComponent />
      </div>
    </div>
  );
}
