'use client';

import { useEffect } from 'react';
import { usePageTitle } from '@/app/worship/utils/title-context';

interface PageTitleSetterProps {
  title: string;
}

export default function PageTitleSetter({ title }: PageTitleSetterProps) {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle(title);
  }, [setPageTitle, title]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고, 제목 설정 역할만 수행합니다.
}
