import { notFound } from 'next/navigation';
// import Link from 'next/link'; // Client Component로 이동 예정
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import {
  getCLogData,
  getNotionPageAndContentBySlug,
  notion,
  getPrevNextCLogPosts,
} from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
// import styles from './CLogDetail.module.scss'; // Client Component로 이동 예정
import CLogDetailClientContent from './_components/CLogDetailClientContent'; // 새로 생성할 Client Component 임포트

interface CLogDetailPageProps {
  params: { slug: string };
}

// generateStaticParams 함수는 app/info/c-log/layout.tsx로 이동했습니다.

export default async function CLogDetailPage({ params }: CLogDetailPageProps) {
  const slug = await params.slug; // params를 React.use() 대신 await로 직접 언래핑 (Next.js 15+ 방식)

  if (!slug) {
    notFound();
  }

  const notionData = await getNotionPageAndContentBySlug('NOTION_CLOG_ID', slug);

  if (!notionData) {
    notFound();
  }

  const n2m = new NotionToMarkdown({
    notionClient: notion,
  });

  const mdxBlocks = await n2m.blocksToMarkdown(notionData.blocks);
  const mdxSource = await serialize(n2m.toMarkdownString(mdxBlocks));

  const { page } = notionData;
  const titleProperty = page.properties.Title as any;
  const categoryProperty = page.properties.Category as any;
  const dateProperty = page.properties.Date as any;

  const title = titleProperty?.title[0]?.plain_text || '제목 없음';
  const category = categoryProperty?.select?.name || '기타';
  const date = dateProperty?.date?.start
    ? new Date(dateProperty.date.start)
        .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\. /g, '.')
        .replace(/\.$/, '')
    : '날짜 없음';

  let imageUrl = '/no-image.svg'; // 기본 이미지
  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrl = page.cover.external.url || '/no-image.svg';
    } else if (page.cover.type === 'file') {
      imageUrl = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  }

  const { prev: prevPost, next: nextPost } = await getPrevNextCLogPosts(slug);

  return (
    <CLogDetailClientContent
      mdxSource={mdxSource}
      category={category}
      title={title}
      date={date}
      imageUrl={imageUrl} // imageUrl props 전달
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
}
