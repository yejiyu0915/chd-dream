import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';

import { compile } from '@mdx-js/mdx';

import { getNotionPageAndContentBySlug, notion, getPrevNextCLogPosts } from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import mdx from 'common/styles/mdx/MdxContent.module.scss';
import PageTitleSetter from '@/app/info/_components/PageTitleSetter';
import l from 'common/styles/mdx/MdxLayout.module.scss';
import CLogDetailHeader from './_components/CLogDetailHeader';
import CLogDetailFooter from './_components/CLogDetailFooter';

interface CLogDetailPageProps {
  params: { slug: string };
}

export default async function CLogDetailPage({ params }: CLogDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

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

  const { parent: markdown } = n2m.toMarkdownString(await n2m.blocksToMarkdown(notionData.blocks));
  await compile(markdown, {
    rehypePlugins: [rehypeSlug, rehypeExtractToc, withTocExport],
  });

  const { page } = notionData;
  const titleProperty = page.properties.Title;
  const categoryProperty = page.properties.Category;
  const dateProperty = page.properties.Date;
  const tagsProperty = page.properties.Tags; // Tags 속성 추가

  const title =
    (titleProperty?.type === 'title' && titleProperty.title[0]?.plain_text) || '제목 없음';
  const category = (categoryProperty?.type === 'select' && categoryProperty.select?.name) || '기타';
  const date =
    dateProperty?.type === 'date' && dateProperty.date?.start
      ? new Date(dateProperty.date.start)
          .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
          .replace(/\. /g, '.')
          .replace(/\.$/, '')
      : '날짜 없음';
  const tags =
    (tagsProperty?.type === 'multi_select' && tagsProperty.multi_select?.map((tag) => tag.name)) ||
    []; // 태그 추출, 없으면 빈 배열

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
    <div className={l.container}>
      <PageTitleSetter title={title} />
      <CLogDetailHeader
        title={title}
        category={category}
        date={date}
        imageUrl={imageUrl}
        tags={tags}
      />
      <section className={`${mdx.mdxContent} detail-inner`}>
        <MDXRemote
          source={markdown} // mdxSource 대신 markdown 직접 전달
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
            },
          }}
        />
      </section>
      <CLogDetailFooter prevPost={prevPost} nextPost={nextPost} />
      <aside className="relative hidden md:block">
        {/* 목차 */}
        {/* 목차 주석 처리된 부분 유지 */}
      </aside>
    </div>
  );
}
