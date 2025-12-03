import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { mdxComponents } from '@/common/config/mdx-components';

interface BulletinMdxContentProps {
  content: string;
}

// HTML을 마크다운으로 변환하는 간단한 함수
// blockquote 태그를 MDX 인용 문법으로 변환
const htmlToMarkdown = (html: string): string => {
  let markdown = html;
  
  // blockquote 태그를 MDX 인용 문법으로 변환
  markdown = markdown.replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/gs, (match, content) => {
    // HTML 태그 제거
    const text = content.replace(/<[^>]*>/g, '').trim();
    // 여러 줄로 나누어 각 줄 앞에 > 추가
    return text.split('\n').map(line => `> ${line.trim()}`).join('\n');
  });
  
  // 나머지 HTML 태그는 그대로 유지 (MDX는 HTML을 지원함)
  return markdown;
};

// 주보 콘텐츠를 MDX로 렌더링하는 서버 컴포넌트
export default function BulletinMdxContent({ content }: BulletinMdxContentProps) {
  // HTML을 마크다운으로 변환
  const markdown = htmlToMarkdown(content);
  
  return (
    <MDXRemote
      source={markdown}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
        },
      }}
      components={mdxComponents}
    />
  );
}

