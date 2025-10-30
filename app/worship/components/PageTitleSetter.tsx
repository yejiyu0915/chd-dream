'use client';

import { useLayoutEffect } from 'react';
import { usePageTitle } from '@/app/worship/utils/title-context';

interface PageTitleSetterProps {
  title: string;
}

export default function PageTitleSetter({ title }: PageTitleSetterProps) {
  const { setPageTitle } = usePageTitle();

  // useLayoutEffect로 변경: 브라우저가 화면을 그리기 전에 동기적으로 실행되어 Suspense 경계 문제 해결
  useLayoutEffect(() => {
    setPageTitle(title);
  }, [setPageTitle, title]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고, 제목 설정 역할만 수행합니다.
}
