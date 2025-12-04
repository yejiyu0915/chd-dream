import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeSlug from 'rehype-slug';

import { compile } from '@mdx-js/mdx';

import { getNotionPageAndContentBySlug, notion, getPrevNextNewsPosts } from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import l from '@/common/styles/mdx/MdxLayout.module.scss';
import NewsDetailHeader from '@/app/info/news/[slug]/components/NewsDetailHeader';
import NewsDetailFooter from '@/app/info/news/[slug]/components/NewsDetailFooter';
import NewsContent from '@/app/info/news/[slug]/components/NewsContent';
import ContentSkeleton from '@/common/components/skeletons/ContentSkeleton';
import { getCurrentSeason } from '@/common/utils/season';
import { generateDynamicMetadata } from '@/common/data/metadata';
import { extractDetailPageMetadata } from '@/lib/notionUtils';

// 메타데이터만 먼저 가져오는 함수 (blocks 제외 - 진짜 Streaming!)
async function getPageMetadata(slug: string) {
  const notionData = await getNotionPageAndContentBySlug('NOTION_NEWS_ID', slug);

  if (!notionData) {
    return null;
  }

  const { page } = notionData;
  const currentSeason = getCurrentSeason();

  // 공통 함수 사용
  return extractDetailPageMetadata(page, currentSeason);
}

// Markdown 콘텐츠를 생성하는 함수 (무거운 작업 - Suspense 안에서 실행)
async function getMarkdownContent(slug: string) {
  // Suspense 안에서 blocks를 가져옴 (진짜 Streaming!)
  const notionData = await getNotionPageAndContentBySlug('NOTION_NEWS_ID', slug);

  if (!notionData) {
    return '';
  }

  const n2m = new NotionToMarkdown({
    notionClient: notion,
  });

  const { parent: markdown } = n2m.toMarkdownString(await n2m.blocksToMarkdown(notionData.blocks));
  await compile(markdown, {
    rehypePlugins: [rehypeSlug, rehypeExtractToc, withTocExport],
  });

  return markdown;
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  const metadata = await getPageMetadata(slug);

  if (!metadata) {
    return {
      title: '게시글을 찾을 수 없습니다',
    };
  }

  const { title, date, tags, imageUrl } = metadata;
  const description = `${date} | ${tags.join(', ')}`;

  return generateDynamicMetadata(title, description, imageUrl);
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  if (!slug) {
    notFound();
  }

  // 1단계: 메타데이터만 먼저 가져오기 (초고속 - 헤더 즉시 표시!)
  const metadata = await getPageMetadata(slug);

  if (!metadata) {
    notFound();
  }

  const { title, date, tags, imageUrl } = metadata;

  return (
    <div className={l.container}>
      {/* 즉시 표시: 헤더 (LCP 개선) */}
      <NewsDetailHeader title={title} date={date} imageUrl={imageUrl} tags={tags} />

      {/* 2단계: 콘텐츠 Streaming (무거운 작업 - 이제 진짜 스트리밍!) */}
      <Suspense fallback={<ContentSkeleton />}>
        <ContentSection slug={slug} />
      </Suspense>

      {/* 3단계: Footer Streaming */}
      <Suspense fallback={<div style={{ minHeight: '200px', backgroundColor: 'transparent' }} />}>
        <FooterSection slug={slug} />
      </Suspense>

      <aside className="relative hidden md:block"></aside>
    </div>
  );
}

// 콘텐츠 섹션 (비동기 컴포넌트 - Suspense 안에서 blocks 가져옴)
async function ContentSection({ slug }: { slug: string }) {
  const markdown = await getMarkdownContent(slug);
  return <NewsContent markdown={markdown} />;
}

// Footer 섹션 (비동기 컴포넌트)
async function FooterSection({ slug }: { slug: string }) {
  const { prev: prevPost, next: nextPost } = await getPrevNextNewsPosts(slug);
  return <NewsDetailFooter prevPost={prevPost} nextPost={nextPost} />;
}
