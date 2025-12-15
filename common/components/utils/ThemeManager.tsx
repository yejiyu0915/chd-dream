'use client';

import { useEffect } from 'react';
import { getCurrentSeason, type Season } from '@/common/utils/season';

/**
 * 테마 관리 컴포넌트
 * localStorage의 테마 설정을 확인하고 html의 data-season 속성을 업데이트
 */
export default function ThemeManager() {
  useEffect(() => {
    // localStorage에서 테마 설정 확인
    const savedTheme = localStorage.getItem('theme-preference');

    let season: Season;

    if (savedTheme && savedTheme !== 'auto') {
      // 저장된 테마가 있고 'auto'가 아니면 저장된 테마 사용
      season = savedTheme as Season;
    } else {
      // 'auto'이거나 저장된 테마가 없으면 현재 계절 사용
      season = getCurrentSeason();
    }

    // html의 data-season 속성 업데이트
    document.documentElement.setAttribute('data-season', season);
  }, []);

  // UI를 렌더링하지 않음
  return null;
}
