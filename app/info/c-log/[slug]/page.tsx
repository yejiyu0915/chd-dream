import { notFound } from 'next/navigation';
// import { serialize } from 'next-mdx-remote/serialize'; // serialize 임포트 제거
import { MDXRemote } from 'next-mdx-remote/rsc'; // next-mdx-remote/rsc에서 MDXRemote 임포트

import remarkGfm from 'remark-gfm'; // remarkGfm 임포트 추가
import rehypeSanitize from 'rehype-sanitize'; // rehypeSanitize 임포트 추가
import rehypePrettyCode from 'rehype-pretty-code'; // rehypePrettyCode 임포트 추가
import rehypeSlug from 'rehype-slug'; // rehypeSlug 임포트 추가
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc'; // rehypeExtractToc 임포트 추가
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx'; // withTocExport 임포트

import { compile } from '@mdx-js/mdx'; // compile 함수 임포트 다시 추가

import {
  // getCLogData, // 사용하지 않음
  getNotionPageAndContentBySlug,
  notion,
  getPrevNextCLogPosts,
} from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md'; // NotionToMarkdown 임포트
// import CLogDetailClientContent from './_components/CLogDetailClientContent'; // CLogDetailClientContent 임포트 제거
import Link from 'next/link'; // Link 임포트
import styles from './CLogDetail.module.scss'; // CSS Module 임포트

interface CLogDetailPageProps {
  params: { slug: string };
}

// generateStaticParams 함수는 app/info/c-log/layout.tsx로 이동했습니다.

export default async function CLogDetailPage({ params }: CLogDetailPageProps) {
  const resolvedParams = await params; // params 객체 자체를 await
  const slug = resolvedParams.slug as string; // resolvedParams에서 slug 추출

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

  const { parent: markdown } = n2m.toMarkdownString(await n2m.blocksToMarkdown(notionData.blocks)); // Notion 블록을 마크다운 문자열로 변환 후 'parent' 속성 추출
  // console.log('Generated Markdown:', markdown); // 마크다운 문자열 로그 제거

  // const mdxSource = await serialize(markdown, { // serialize 사용 제거
  //   parseFrontmatter: true,
  //   mdxOptions: {
  //     remarkPlugins: [remarkGfm],
  //     rehypePlugins: [rehypeSlug, rehypeExtractToc, rehypeSanitize, rehypePrettyCode],
  //   },
  // });

  // data 객체에서 toc를 추출하기 위해 compile 함수를 사용
  const { data } = await compile(markdown, {
    rehypePlugins: [
      rehypeSlug,
      rehypeExtractToc,
      withTocExport, // withTocExport 추가
      // withTocExport, // withTocExport는 MDXRemote에서 직접 사용하지 않으므로 제거
    ],
  });

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
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr_240px] md:gap-8">
        <aside className="hidden md:block">{/* 추후 콘텐츠 추가 */}</aside>
        <section className="overflow-hidden">
          {/* 블로그 헤더 */}
          <div className="space-y-4">
            <div className="space-y-2">
              {/* 카테고리/태그 */}
              <div className="flex gap-2">
                {/* Notion 태그를 사용하는 경우 여기에 맵핑 */}
                {category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {category}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
            </div>

            {/* 메타 정보 */}
            <div className="text-muted-foreground flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                {/* <User className="h-4 w-4" /> */}
                <span>{date}</span> {/* 날짜 표시 */}
              </div>
            </div>
          </div>

          {/* 이미지 배너 */}
          {imageUrl && imageUrl !== '/no-image.svg' && (
            <div className="my-8">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <hr className="my-8" />

          {/* MDX 본문 */}
          <div className={styles.mdxContent}>
            <MDXRemote
              source={markdown} // mdxSource 대신 markdown 직접 전달
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
                },
              }}
            />
          </div>

          <hr className="my-16" />

          {/* 이전/다음 포스트 네비게이션 */}
          <div className="flex justify-between mt-8">
            {prevPost ? (
              <Link href={`/info/c-log/${prevPost.slug}`} className="text-blue-600 hover:underline">
                이전글: {prevPost.title}
              </Link>
            ) : (
              <span className="text-gray-500">이전글 없음</span>
            )}
            {nextPost ? (
              <Link href={`/info/c-log/${nextPost.slug}`} className="text-blue-600 hover:underline">
                다음글: {nextPost.title}
              </Link>
            ) : (
              <span className="text-gray-500">다음글 없음</span>
            )}
          </div>

          {/* <GiscusComments /> */}
        </section>
        <aside className="relative hidden md:block">
          {/* 목차 */}
          {data?.toc && data.toc.length > 0 && (
            <div className="sticky top-[var(--sticky-top)]">
              <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold">목차</h3>
                <nav className="space-y-3 text-sm">
                  {data.toc.map((item) => (
                    <div key={item.id} className={`ml-${(item.depth - 1) * 4}`}>
                      <Link
                        href={`#${item.id}`}
                        className="hover:text-foreground text-muted-foreground block font-medium transition-colors"
                      >
                        {item.value}
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
