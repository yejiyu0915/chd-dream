'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { groupData } from '@/app/about/group/data/groupData';
import GroupContent from '@/app/about/group/components/GroupContent';

export default function MenPage() {
  // 현재 교구 데이터 찾기
  const currentGroup = useMemo(() => groupData.find((group) => group.id === 'men'), []);

  // 이전/다음 교구 찾기
  const currentIndex = useMemo(() => groupData.findIndex((group) => group.id === 'men'), []);
  const prevGroup = useMemo(
    () => (currentIndex > 1 ? groupData[currentIndex - 1] : null),
    [currentIndex]
  );
  const nextGroup = useMemo(
    () =>
      currentIndex > 0 && currentIndex < groupData.length - 1 ? groupData[currentIndex + 1] : null,
    [currentIndex]
  );

  if (!currentGroup) {
    return (
      <div
        className="inner"
        style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          maxWidth: '36rem',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p style={{ marginBottom: '1rem' }}>교구 정보를 불러오지 못했습니다.</p>
        <Link href="/about/group">교구 안내로 돌아가기</Link>
      </div>
    );
  }

  return <GroupContent data={currentGroup} prevGroup={prevGroup} nextGroup={nextGroup} />;
}
