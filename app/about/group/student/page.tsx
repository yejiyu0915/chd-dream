'use client';

import { useMemo } from 'react';
import { groupData } from '@/app/about/group/data/groupData';
import GroupContent from '@/app/about/group/components/GroupContent';

export default function StudentPage() {
  // 현재 교구 데이터 찾기
  const currentGroup = useMemo(() => groupData.find((group) => group.id === 'student'), []);

  // 이전/다음 교구 찾기
  const currentIndex = useMemo(() => groupData.findIndex((group) => group.id === 'student'), []);
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
    return <div>교구 정보를 찾을 수 없습니다.</div>;
  }

  return <GroupContent data={currentGroup} prevGroup={prevGroup} nextGroup={nextGroup} />;
}
