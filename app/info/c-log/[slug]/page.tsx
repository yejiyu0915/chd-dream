import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeSlug from 'rehype-slug';

import {
  getNotionPageAndContentBySlug,
  getNotionPageMetadataBySlug,
  notion,
  getPrevNextCLogPosts,
  getCLogData,
} from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import { getCachedMarkdown } from '@/lib/clogMarkdownCache';
import l from '@/common/styles/mdx/MdxLayout.module.scss';
import CLogDetailHeader from '@/app/info/c-log/[slug]/components/CLogDetailHeader';
import CLogDetailFooter from '@/app/info/c-log/[slug]/components/CLogDetailFooter';
import CLogContent from '@/app/info/c-log/[slug]/components/CLogContent';
import CLogBandLinks from '@/app/info/c-log/[slug]/components/CLogBandLinks';
import CLogRecommendedPostsClient from '@/app/info/c-log/[slug]/components/CLogRecommendedPostsClient';
import ContentSkeleton from '@/common/components/skeletons/ContentSkeleton';
import { getCurrentSeason } from '@/common/utils/season';
import { generateDynamicMetadata } from '@/common/data/metadata';
import { extractDetailPageMetadataWithCategory } from '@/lib/notionUtils';

// ISR 설정: 10분마다 재생성 (성능 최적화)
export const revalidate = 600; // 10분

// 메타데이터 캐시 (성능 최적화)
const metadataCache = new Map<string, { data: any; timestamp: number }>();
const METADATA_CACHE_TTL = 30 * 60 * 1000; // 30분

// 메타데이터만 먼저 가져오는 함수 (blocks 제외 - 진짜 Streaming!, 캐싱 적용)
// 성능 최적화: blocks를 가져오지 않아서 훨씬 빠름
async function getPageMetadata(slug: string) {
  const cacheKey = `clog-metadata-${slug}`;
  const now = Date.now();

  // 캐시 확인
  const cached = metadataCache.get(cacheKey);
  if (cached && now - cached.timestamp < METADATA_CACHE_TTL) {
    return cached.data;
  }

  try {
    // blocks 제외하고 page만 가져오기 (훨씬 빠름!)
    const page = await getNotionPageMetadataBySlug('NOTION_CLOG_ID', slug);

    if (!page) {
      return null;
    }

    const currentSeason = getCurrentSeason();

    // 공통 함수 사용 (카테고리 포함)
    const metadata = extractDetailPageMetadataWithCategory(page, currentSeason);

    // 캐시에 저장
    metadataCache.set(cacheKey, {
      data: metadata,
      timestamp: now,
    });

    return metadata;
  } catch (error) {
    // 에러 발생 시 null 반환하여 notFound() 호출
    console.error('C-log 메타데이터를 가져오는 중 오류 발생:', error);
    return null;
  }
}

// Markdown 콘텐츠를 생성하는 함수 (무거운 작업 - Suspense 안에서 실행, 캐싱 적용)
async function getMarkdownContent(slug: string) {
  // 캐시된 Markdown 변환 결과 사용
  return getCachedMarkdown(slug, async () => {
    try {
      // Suspense 안에서 blocks를 가져옴 (진짜 Streaming!)
      const notionData = await getNotionPageAndContentBySlug('NOTION_CLOG_ID', slug);

      if (!notionData) {
        console.error(`[C-log] slug "${slug}"에 대한 Notion 데이터를 찾을 수 없습니다.`);
        return '';
      }

      // 이미지 블록이 있는지 확인 (디버깅용)
      const imageBlocks = notionData.blocks.filter((block: any) => block.type === 'image');
      if (imageBlocks.length > 0) {
        console.log(`[C-log] 이미지 블록 ${imageBlocks.length}개 발견 (slug: ${slug})`);
        // 이미지 블록 정보 로깅 (디버깅용)
        imageBlocks.forEach((block: any, index: number) => {
          const imageUrl =
            block.image?.type === 'external'
              ? block.image.external?.url
              : block.image?.type === 'file'
                ? block.image.file?.url
                : 'unknown';
          console.log(`[C-log] 이미지 ${index + 1}: ${imageUrl}`);
        });
      }

      const n2m = new NotionToMarkdown({
        notionClient: notion,
      });

      // blocksToMarkdown 단계별로 에러 처리
      let markdownBlocks;
      try {
        markdownBlocks = await n2m.blocksToMarkdown(notionData.blocks);
      } catch (blocksError: any) {
        console.error('[C-log] blocksToMarkdown 변환 중 오류 발생:', {
          slug,
          error: blocksError?.message || blocksError,
          stack: blocksError?.stack,
          imageBlocksCount: imageBlocks.length,
        });
        // 이미지 블록이 있는 경우, 이미지 블록만 제외하고 다시 시도
        if (imageBlocks.length > 0) {
          console.log('[C-log] 이미지 블록을 제외하고 다시 시도합니다...');
          const blocksWithoutImages = notionData.blocks.filter(
            (block: any) => block.type !== 'image'
          );
          try {
            markdownBlocks = await n2m.blocksToMarkdown(blocksWithoutImages);
            console.log('[C-log] 이미지 블록 제외 후 변환 성공');
          } catch (retryError: any) {
            console.error(
              '[C-log] 이미지 블록 제외 후에도 변환 실패:',
              retryError?.message || retryError
            );
            return '';
          }
        } else {
          return '';
        }
      }

      // toMarkdownString 변환
      let markdown: string;
      try {
        const result = n2m.toMarkdownString(markdownBlocks);
        markdown = result.parent;
      } catch (markdownError: any) {
        console.error('[C-log] toMarkdownString 변환 중 오류 발생:', {
          slug,
          error: markdownError?.message || markdownError,
          stack: markdownError?.stack,
        });
        return '';
      }

      // MDX 컴파일은 제거 (MDXRemote에서 처리하므로 불필요, 성능 향상)
      // compile 함수는 검증용이었지만 실제로는 사용되지 않음

      return markdown;
    } catch (error: any) {
      // 예상치 못한 에러 발생 시 상세 로그
      console.error('[C-log] 콘텐츠를 가져오는 중 예상치 못한 오류 발생:', {
        slug,
        error: error?.message || error,
        stack: error?.stack,
        name: error?.name,
      });
      return '';
    }
  });
}

// 빌드 타임에 정적 경로 생성 (운영 환경에서 페이지가 보이도록)
export async function generateStaticParams() {
  try {
    const cLogData = await getCLogData();
    // slug가 있는 항목만 반환
    return cLogData
      .filter((item) => item.slug && item.slug.trim() !== '')
      .map((item) => ({
        slug: item.slug,
      }));
  } catch (error) {
    // 에러 발생 시 빈 배열 반환 (런타임에 동적으로 생성)
    console.error('generateStaticParams error:', error);
    return [];
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  try {
    const metadata = await getPageMetadata(slug);

    if (!metadata) {
      return {
        title: '게시글을 찾을 수 없습니다',
      };
    }

    const { title, category, date, tags, imageUrl } = metadata;
    const description = `${category} | ${date} | ${tags.join(', ')}`;

    return generateDynamicMetadata(title, description, imageUrl);
  } catch (error) {
    // 에러 발생 시 기본 메타데이터 반환
    console.error('메타데이터 생성 중 오류 발생:', error);
    return {
      title: '게시글을 찾을 수 없습니다',
    };
  }
}

export default async function CLogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  if (!slug) {
    notFound();
  }

  // 메타데이터만 먼저 가져오기 (헤더 즉시 표시를 위해)
  // 콘텐츠는 Suspense에서 별도로 처리하여 스트리밍
  let metadata;
  try {
    metadata = await getPageMetadata(slug);
  } catch (error) {
    console.error('C-log 페이지 메타데이터를 가져오는 중 오류 발생:', error);
    notFound();
  }

  if (!metadata) {
    notFound();
  }

  const { title, category, date, tags, imageUrl, band1, band2 } = metadata;

  return (
    <div className={l.container}>
      {/* 즉시 표시: 헤더 (LCP 개선) */}
      <CLogDetailHeader
        title={title}
        category={category}
        date={date}
        imageUrl={imageUrl}
        tags={tags}
      />

      {/* 2단계: 콘텐츠 Streaming (무거운 작업 - 이제 진짜 스트리밍!) */}
      <Suspense fallback={<ContentSkeleton />}>
        <ContentSection slug={slug} />
      </Suspense>

      {/* 3단계: Band 링크 영역 (MDX 콘텐츠 하단) */}
      {(band1 || band2) && <CLogBandLinks band1={band1 || null} band2={band2 || null} />}

      {/* 4단계: Footer Streaming */}
      <Suspense fallback={<div style={{ minHeight: '200px', backgroundColor: 'transparent' }} />}>
        <FooterSection slug={slug} />
      </Suspense>

      {/* 5단계: 추천글 클라이언트 지연 로드 (서버 렌더링 블로킹 방지) */}
      <CLogRecommendedPostsClient slug={slug} category={category} tags={tags} />

      <aside className="relative hidden md:block">{/* 목차 */}</aside>
    </div>
  );
}

// 콘텐츠 섹션 (비동기 컴포넌트 - Suspense 안에서 blocks 가져옴)
async function ContentSection({ slug }: { slug: string }) {
  try {
    const markdown = await getMarkdownContent(slug);
    return <CLogContent markdown={markdown} />;
  } catch (error) {
    // 에러 발생 시 빈 콘텐츠 표시
    console.error('콘텐츠 섹션 로딩 중 오류 발생:', error);
    return <CLogContent markdown="" />;
  }
}

// Footer 섹션 (비동기 컴포넌트)
async function FooterSection({ slug }: { slug: string }) {
  try {
    const { prev: prevPost, next: nextPost } = await getPrevNextCLogPosts(slug);
    return <CLogDetailFooter prevPost={prevPost} nextPost={nextPost} />;
  } catch (error) {
    // 에러 발생 시 이전/다음 포스트 없이 Footer 표시
    console.error('Footer 섹션 로딩 중 오류 발생:', error);
    return <CLogDetailFooter prevPost={null} nextPost={null} />;
  }
}

