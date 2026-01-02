import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeSlug from 'rehype-slug';

import { compile } from '@mdx-js/mdx';

import {
  getNotionPageAndContentBySlug,
  notion,
  getPrevNextCLogPosts,
  getCLogData,
} from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import l from '@/common/styles/mdx/MdxLayout.module.scss';
import CLogDetailHeader from '@/app/info/c-log/[slug]/components/CLogDetailHeader';
import CLogDetailFooter from '@/app/info/c-log/[slug]/components/CLogDetailFooter';
import CLogContent from '@/app/info/c-log/[slug]/components/CLogContent';
import ContentSkeleton from '@/common/components/skeletons/ContentSkeleton';
import { getCurrentSeason } from '@/common/utils/season';
import { generateDynamicMetadata } from '@/common/data/metadata';
import { extractDetailPageMetadataWithCategory } from '@/lib/notionUtils';

// 메타데이터만 먼저 가져오는 함수 (blocks 제외 - 진짜 Streaming!)
async function getPageMetadata(slug: string) {
  try {
    const notionData = await getNotionPageAndContentBySlug('NOTION_CLOG_ID', slug);

    if (!notionData) {
      return null;
    }

    const { page } = notionData;
    const currentSeason = getCurrentSeason();

    // 공통 함수 사용 (카테고리 포함)
    return extractDetailPageMetadataWithCategory(page, currentSeason);
  } catch (error) {
    // 에러 발생 시 null 반환하여 notFound() 호출
    console.error('C-log 메타데이터를 가져오는 중 오류 발생:', error);
    return null;
  }
}

// Markdown 콘텐츠를 생성하는 함수 (무거운 작업 - Suspense 안에서 실행)
async function getMarkdownContent(slug: string) {
  try {
    // Suspense 안에서 blocks를 가져옴 (진짜 Streaming!)
    const notionData = await getNotionPageAndContentBySlug('NOTION_CLOG_ID', slug);

    if (!notionData) {
      console.error(`[C-log] slug "${slug}"에 대한 Notion 데이터를 찾을 수 없습니다.`);
      return '';
    }

    // 이미지 블록이 있는지 확인 (디버깅용)
    const imageBlocks = notionData.blocks.filter(
      (block: any) => block.type === 'image'
    );
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
          console.error('[C-log] 이미지 블록 제외 후에도 변환 실패:', retryError?.message || retryError);
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

    // MDX 컴파일 (에러가 나도 마크다운은 반환)
    try {
      await compile(markdown, {
        rehypePlugins: [rehypeSlug, rehypeExtractToc, withTocExport],
      });
    } catch (compileError: any) {
      console.warn('[C-log] MDX 컴파일 중 경고 (마크다운은 반환):', {
        slug,
        error: compileError?.message || compileError,
      });
      // 컴파일 에러가 있어도 마크다운은 반환 (렌더링은 시도)
    }

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

  // 1단계: 메타데이터만 먼저 가져오기 (초고속 - 헤더 즉시 표시!)
  let metadata;
  try {
    metadata = await getPageMetadata(slug);
  } catch (error) {
    // 에러 발생 시 notFound() 호출
    console.error('C-log 페이지 메타데이터를 가져오는 중 오류 발생:', error);
    notFound();
  }

  if (!metadata) {
    notFound();
  }

  const { title, category, date, tags, imageUrl } = metadata;

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

      {/* 3단계: Footer Streaming */}
      <Suspense fallback={<div style={{ minHeight: '200px', backgroundColor: 'transparent' }} />}>
        <FooterSection slug={slug} />
      </Suspense>

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
