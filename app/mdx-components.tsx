'use client';

import type { MDXComponents } from 'mdx/types';
import { mdxComponents } from '@/common/config/mdx-components';

// 이 파일은 App Router에서 MDX를 사용할 때 필수적입니다.
// MDX 콘텐츠 내의 HTML 태그들을 커스텀 React 컴포넌트로 매핑하는 역할을 합니다.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    // `components` prop을 통해 전달될 수 있는 추가 사용자 정의 컴포넌트들도 병합합니다.
    ...components,
  };
}
