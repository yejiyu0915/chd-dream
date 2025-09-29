import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';

import { compile } from '@mdx-js/mdx';

import { getNotionPageAndContentBySlug, notion, getPrevNextNewsPosts } from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import mdx from '@/common/styles/mdx/MdxContent.module.scss';
import PageTitleSetter from '@/app/info/components/PageTitleSetter';
import l from '@/common/styles/mdx/MdxLayout.module.scss';
import NewsDetailHeader from '@/app/info/news/[slug]/components/NewsDetailHeader';
import NewsDetailFooter from '@/app/info/news/[slug]/components/NewsDetailFooter';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

interface NewsDetailPageProps {
  params: { slug: string };
}

// 뉴스 상세 페이지 캐싱 설정 - 1시간마다 재검증
export const revalidate = 3600;

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  if (!slug) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['news-detail', slug],
    queryFn: () => getNotionPageAndContentBySlug('NOTION_NEWS_ID', slug),
  });

  const notionData = queryClient.getQueryData(['news-detail', slug]) as
    | { page: PageObjectResponse; blocks: BlockObjectResponse[] }
    | undefined;

  if (!notionData) {
    notFound();
  }

  const n2m = new NotionToMarkdown({
    notionClient: notion,
  });

  const { parent: markdown } = n2m.toMarkdownString(await n2m.blocksToMarkdown(notionData.blocks));
  await compile(markdown, {
    rehypePlugins: [rehypeSlug, rehypeExtractToc, withTocExport],
  });

  const { page } = notionData;
  const titleProperty = page.properties.Title;
  const dateProperty = page.properties.Date;
  const tagsProperty = page.properties.Tags; // 뉴스에도 태그가 있다면

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
    []; // 태그 추출, 없으면 빈 배열

  let imageUrl = '/no-image.svg'; // 기본 이미지
  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrl = page.cover.external.url || '/no-image.svg';
    } else if (page.cover.type === 'file') {
      imageUrl = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  }

  const { prev: prevPost, next: nextPost } = await getPrevNextNewsPosts(slug);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={l.container}>
        <PageTitleSetter title={title} />
        <NewsDetailHeader title={title} date={date} imageUrl={imageUrl} tags={tags} />
        <section className={`${mdx.mdxContent} detail-inner`}>
          <MDXRemote
            source={markdown}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
              },
            }}
          />
        </section>
        <NewsDetailFooter prevPost={prevPost} nextPost={nextPost} />
        <aside className="relative hidden md:block">
          {/* 목차 */}
          {/* 목차 주석 처리된 부분 유지 */}
        </aside>
      </div>
    </HydrationBoundary>
  );
}
