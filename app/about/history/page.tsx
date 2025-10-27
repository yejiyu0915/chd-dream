'use client';

import React, { useEffect } from 'react';
import { usePageTitle } from '@/app/about/utils/title-context';

export default function HistoryPage() {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('교회 연혁');
  }, [setPageTitle]);

  return (
    <section>
      <div className="inner">{/* 내용은 비워둠 - 추후 작업 예정 */}</div>
    </section>
  );
}
