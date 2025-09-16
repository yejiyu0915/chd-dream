'use client';

import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

// 이 파일은 App Router에서 MDX를 사용할 때 필수적입니다.
// MDX 콘텐츠 내의 HTML 태그들을 커스텀 React 컴포넌트로 매핑하는 역할을 합니다.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 기본 HTML 태그들을 커스텀 컴포넌트로 매핑
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    h5: ({ children }) => <h5>{children}</h5>,
    h6: ({ children }) => <h6>{children}</h6>,
    p: ({ children }) => <p>{children}</p>,
    ul: ({ children }) => <ul>{children}</ul>,
    ol: ({ children }) => <ol>{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    a: ({ children, href }) => <a href={href}>{children}</a>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    code: ({ children }) => <code>`{children}`</code>,
    pre: ({ children }) => (
      <pre>
        <code>{children}</code>
      </pre>
    ),
    img: ({ src, alt }) => <Image src={src} alt={alt} width={1000} height={1000} />,
    // `components` prop을 통해 전달될 수 있는 추가 사용자 정의 컴포넌트들도 병합합니다.
    ...components,
  };
}
