import { Metadata } from 'next';
import { pageMeta } from './list';

// 사이트 기본 정보
const SITE_NAME = '행복으로가는교회';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

// NEWS 타이틀 오버라이드 (영문으로 표시)
const TITLE_OVERRIDES: Record<string, string> = {
  '/info/news': 'NEWS',
};

/**
 * 페이지 메타데이터 생성 함수
 * @param pathname - 페이지 경로 (예: '/info/news')
 * @returns Next.js Metadata 객체
 */
export function generatePageMetadata(pathname: string): Metadata {
  // list.ts의 pageMeta에서 데이터 가져오기
  const pageData = pageMeta[pathname];

  if (!pageData) {
    // 메타데이터가 없는 경우 기본값 반환
    return {
      title: SITE_NAME,
      description: `${SITE_NAME}입니다.`,
    };
  }

  // 타이틀 오버라이드 적용 (예: NEWS)
  const title = TITLE_OVERRIDES[pathname] || pageData.title;
  const description = pageData.description || `${pageData.title} 페이지입니다.`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle, // root layout의 template이 작동하지 않아서 직접 적용
    description: description,
    openGraph: {
      title: fullTitle,
      description: description,
      url: `${SITE_URL}${pathname}`,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
    },
  };
}

/**
 * 동적 페이지 (slug) 메타데이터 생성 함수
 * @param title - 게시글 제목
 * @param description - 게시글 설명
 * @param imageUrl - 이미지 URL (선택)
 * @returns Next.js Metadata 객체
 */
export function generateDynamicMetadata(
  title: string,
  description: string,
  imageUrl?: string
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  const metadata: Metadata = {
    title: fullTitle, // root layout의 template이 작동하지 않아서 직접 적용
    description: description,
    openGraph: {
      title: fullTitle,
      description: description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
    },
  };

  // 이미지가 있으면 추가
  if (imageUrl) {
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
    if (metadata.openGraph) {
      metadata.openGraph.images = [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ];
    }
    if (metadata.twitter) {
      metadata.twitter.images = [fullImageUrl];
    }
  }

  return metadata;
}

// 상수 export
export { SITE_NAME, SITE_URL };
