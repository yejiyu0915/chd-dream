import { notFound } from 'next/navigation';
// import React from 'react'; // React 임포트 다시 추가
// import { MDXRemote } from 'next-mdx-remote'; // MDX 관련 임포트 제거
// import { serialize } from 'next-mdx-remote/serialize'; // MDX 관련 임포트 제거
import {
  getCLogData,
  getNotionPageAndContentBySlug,
  notion,
  getPrevNextCLogPosts,
} from '@/lib/notion';
// import { NotionToMarkdown } from 'notion-to-md'; // MDX 관련 임포트 제거
// import styles from './CLogDetail.module.scss'; // Client Component로 이동 예정
import CLogDetailClientContent from './_components/CLogDetailClientContent'; // 새로 생성할 Client Component 임포트

interface CLogDetailPageProps {
  params: { slug: string };
}

// generateStaticParams 함수는 app/info/c-log/layout.tsx로 이동했습니다.

export default async function CLogDetailPage({ params }: CLogDetailPageProps) {
  const slug = params.slug as string; // params.slug를 언래핑

  if (!slug) {
    notFound();
  }

  const notionData = await getNotionPageAndContentBySlug('NOTION_CLOG_ID', slug);

  if (!notionData) {
    notFound();
  }

  // MDX 관련 코드 제거 시작
  // const n2m = new NotionToMarkdown({
  //   notionClient: notion,
  // });
  // const mdxBlocks = await n2m.blocksToMarkdown(notionData.blocks);
  // const mdxSource = await serialize(n2m.toMarkdownString(mdxBlocks), {
  //   parseFrontmatter: true,
  //   mdxOptions: {
  //     rehypePlugins: [
  //       (options: any) => {
  //         return (tree: any) => {
  //           // @ts-ignore
  //           mdxSource.scope = { ...mdxSource.scope, toc: tree.data.toc };
  //         };
  //       },
  //     ],
  //   },
  // });
  // const toc = mdxSource.scope?.toc; // 추출된 목차 데이터
  // MDX 관련 코드 제거 끝

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

  // Notion 블록 데이터를 직접 Client Component로 전달
  const rawContentBlocks = notionData.blocks;

  return (
    <CLogDetailClientContent
      // mdxSource={mdxSource} // MDX 관련 props 제거
      category={category}
      title={title}
      date={date}
      imageUrl={imageUrl}
      prevPost={prevPost}
      nextPost={nextPost}
      // toc={toc} // MDX 관련 props 제거
      rawContentBlocks={rawContentBlocks} // 원시 블록 데이터 전달
    />
  );
}
