import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import mdx from '@/common/styles/mdx/MdxContent.module.scss';
import { mdxComponents } from '@/common/config/mdx-components';

interface NoticeContentProps {
  markdown: string;
}

// Markdown 콘텐츠를 별도 컴포넌트로 분리 (Streaming 최적화)
export default function NoticeContent({ markdown }: NoticeContentProps) {
  return (
    <section className={`${mdx.mdxContent} detail-inner`}>
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
    </section>
  );
}

