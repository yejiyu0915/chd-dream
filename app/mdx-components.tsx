'use client';

import type { MDXComponents } from 'mdx/types';

// 이 파일은 App Router에서 MDX를 사용할 때 필수적입니다.
// MDX 콘텐츠 내의 HTML 태그들을 커스텀 React 컴포넌트로 매핑하는 역할을 합니다.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 기본 HTML 태그들을 커스텀 컴포넌트로 매핑
    h1: ({ children }) => <h1 className="text-5xl font-bold my-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-4xl font-bold my-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-3xl font-bold my-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-2xl font-bold my-2">{children}</h4>,
    h5: ({ children }) => <h5 className="text-xl font-bold my-1">{children}</h5>,
    h6: ({ children }) => <h6 className="text-lg font-bold my-1">{children}</h6>,
    p: ({ children }) => <p className="my-2 text-base leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside ml-4 my-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside ml-4 my-2">{children}</ol>,
    li: ({ children }) => <li className="my-1">{children}</li>,
    a: ({ children, href }) => (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 text-red-600 px-1 rounded">`{children}`</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4">
        <code>{children}</code>
      </pre>
    ),
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="max-w-full h-auto mx-auto my-4 rounded-md shadow-lg" />
    ),
    // `components` prop을 통해 전달될 수 있는 추가 사용자 정의 컴포넌트들도 병합합니다.
    ...components,
  };
}
