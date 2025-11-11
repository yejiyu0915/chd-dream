import { notFound } from 'next/navigation';
import { Suspense } from 'react';
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

interface NewsDetailPageProps {
  params: { slug: string };
}

// 캐싱 설정 - 5분마다 재검증 (빌드 독립적)
export const revalidate = 300;

// 빌드 시에 없던 새로운 slug도 런타임에 자동 생성 (빌드 불필요)
export const dynamicParams = true;

// 메타데이터만 먼저 가져오는 함수 (blocks 제외 - 진짜 Streaming!)
async function getPageMetadata(slug: string) {
  const notionData = await getNotionPageAndContentBySlug('NOTION_NEWS_ID', slug);

  if (!notionData) {
    return null;
  }

  const { page } = notionData;
  const titleProperty = page.properties.Title;
  const dateProperty = page.properties.Date;
  const tagsProperty = page.properties.Tags;

  const title =
    (titleProperty?.type === 'title' && titleProperty.title[0]?.plain_text) || '제목 없음';
  const date =
    dateProperty?.type === 'date' && dateProperty.date?.start
      ? new Date(dateProperty.date.start)
          .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
          .replace(/\. /g, '.')
          .replace(/\.$/, '')
      : '날짜 없음';
  const tags =
    (tagsProperty?.type === 'multi_select' &&
      tagsProperty.multi_select?.map((tag: { name: string }) => tag.name)) ||
    [];

  // 계절별 기본 이미지 경로 생성
  const currentSeason = getCurrentSeason();
  const defaultImageUrl = `/images/title/${currentSeason}/info.jpg`;

  let imageUrl = defaultImageUrl;
  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrl = page.cover.external.url || defaultImageUrl;
    } else if (page.cover.type === 'file') {
      imageUrl = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  }

  return { title, date, tags, imageUrl };
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

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
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
