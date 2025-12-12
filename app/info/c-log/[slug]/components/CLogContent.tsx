import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import mdx from 'common/styles/mdx/MdxContent.module.scss';
import { mdxComponents } from '@/common/config/mdx-components';
import ContentWrapper from '@/common/components/utils/ContentWrapper';
import MdxImageSwiperWrapper from '@/common/components/mdx/MdxImageSwiper';
import rehypeUnwrapImageFromP from '@/common/plugins/rehype-unwrap-image-from-p';
import remarkImageToBlock from '@/common/plugins/remark-image-to-block';

interface CLogContentProps {
  markdown: string;
}

// Markdown 콘텐츠를 별도 컴포넌트로 분리 (Streaming 최적화)
export default function CLogContent({ markdown }: CLogContentProps) {
  return (
    <ContentWrapper>
      <MdxImageSwiperWrapper>
        <section className={`${mdx.mdxContent} detail-inner`}>
          <MDXRemote
            source={markdown}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkImageToBlock],
                rehypePlugins: [
                  rehypeSlug,
                  rehypeUnwrapImageFromP,
                  rehypeSanitize,
                  rehypePrettyCode,
                ],
              },
            }}
            components={mdxComponents}
          />
        </section>
      </MdxImageSwiperWrapper>
    </ContentWrapper>
  );
}
