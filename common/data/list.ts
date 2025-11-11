import { menuData } from './info';

export interface PageMeta {
  title: string; // 페이지 제목 & Breadcrumb 이름
  description?: string; // 페이지 설명 (선택적)
}

/**
 * 섹션명을 경로로 매핑합니다.
 */
const sectionPathMap: Record<string, string> = {
  '교회 소개': '/about',
  '예배 안내': '/worship',
  '교회 소식': '/info',
};

/**
 * info.ts의 menuData에서 섹션 및 페이지 메타 정보를 자동 생성합니다.
 */
function generatePageMetaFromMenuData(): Record<string, PageMeta> {
  const meta: Record<string, PageMeta> = {};

  menuData.forEach((section) => {
    const sectionPath = sectionPathMap[section.name];
    if (!sectionPath) return;

    // 섹션 레벨: title만 (Breadcrumb용)
    meta[sectionPath] = {
      title: section.name,
    };

    // 페이지 레벨: subMenu에서 자동 생성
    section.subMenu?.forEach((page) => {
      if (!page.href) return; // href가 없으면 스킵

      meta[page.href] = {
        title: page.name,
        description: `${page.name} 페이지입니다.`,
      };
    });
  });

  return meta;
}

// menuData에서 자동 생성
const generatedMeta = generatePageMetaFromMenuData();

/**
 * 모든 페이지의 메타 정보를 관리합니다.
 * menuData에서 자동 생성 + 필요한 것만 오버라이드
 */
export const pageMeta: Record<string, PageMeta> = {
  ...generatedMeta,

  // menuData에 없는 페이지는 수동 추가
  '/location': {
    title: '오시는 길',
    description: '행복으로가는교회로 찾아오시는 길을 안내합니다.',
  },

  // description만 더 상세하게 오버라이드
  '/about/history': {
    ...generatedMeta['/about/history'],
    description: '우리 교회의 연혁을 소개합니다.',
  },

  '/worship/timetable': {
    ...generatedMeta['/worship/timetable'],
    description: '집회 시간표를 확인할 수 있습니다.',
  },
  '/worship/bulletin': {
    ...generatedMeta['/worship/bulletin'],
    description: '온라인 주보를 확인할 수 있습니다.',
  },
  '/worship/sermon': {
    ...generatedMeta['/worship/sermon'],
    description: '영혼의 양식이 되는 생명의 말씀을 만나보세요.',
  },

  '/info/news': {
    ...generatedMeta['/info/news'],
    description: '새로운 소식과 업데이트를 전해드립니다.',
  },
  '/info/c-log': {
    ...generatedMeta['/info/c-log'],
    description: '교회의 다양한 이야기를 만나보세요.',
  },
  '/info/schedule': {
    ...generatedMeta['/info/schedule'],
    description: '다양한 일정과 행사를 확인하세요.',
  },
  '/info/notice': {
    ...generatedMeta['/info/notice'],
    description: '홈페이지 공지사항을 확인하세요.',
  },
};

/**
 * 경로를 기반으로 페이지 메타 정보를 가져옵니다.
 * 상세 페이지(/info/news/slug)의 경우 상위 경로(/info/news)의 메타 정보를 반환합니다.
 */
export function getPageMeta(pathname: string): PageMeta | null {
  // 1. 정확한 경로 매칭
  if (pageMeta[pathname]) {
    return pageMeta[pathname];
  }

  // 2. 상위 경로로 fallback
  const segments = pathname.split('/').filter(Boolean);

  // 2-1. 2단계 경로 확인 (예: /info/news)
  if (segments.length >= 2) {
    const twoLevelPath = `/${segments[0]}/${segments[1]}`;
    if (pageMeta[twoLevelPath]) {
      return pageMeta[twoLevelPath];
    }
  }

  // 2-2. 1단계 경로 확인 (예: /about)
  if (segments.length >= 1) {
    const oneLevelPath = `/${segments[0]}`;
    if (pageMeta[oneLevelPath]) {
      return pageMeta[oneLevelPath];
    }
  }

  return null;
}

/**
 * 경로 세그먼트를 기반으로 Breadcrumb 이름을 가져옵니다.
 * title을 Breadcrumb 이름으로 사용합니다.
 */
export function getBreadcrumbName(segment: string, fullPath?: string): string {
  // 1. 전체 경로로 먼저 검색
  if (fullPath && pageMeta[fullPath]) {
    return pageMeta[fullPath].title;
  }

  // 2. 세그먼트 단독으로 검색 (섹션 레벨)
  const sectionPath = `/${segment}`;
  if (pageMeta[sectionPath]) {
    return pageMeta[sectionPath].title;
  }

  // 3. 기본값: 첫 글자 대문자
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
