import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

// MDX 커스텀 컴포넌트 매핑 (웹접근성을 위해 헤딩 레벨을 한 단계씩 낮춤)
// 서버 컴포넌트용 - next-mdx-remote/rsc에서 사용
export const mdxComponents: MDXComponents = {
  // 헤딩 태그를 한 단계씩 낮춤 (h1 -> h2, h2 -> h3, h3 -> h4)
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a href={href}>
      🔗 {children}
    </a>
  ),
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  code: ({ children }) => <code>{children}</code>,
  pre: ({ children }) => <pre>{children}</pre>,
  img: ({ src, alt }) => {
    // Cloudinary URL의 query string은 이미지 변환 파라미터이므로 유지
    // Next.js Image가 query string을 포함한 URL을 처리하지 못하므로 unoptimized 사용
    // 내용이 많은 페이지 최적화: lazy loading 적용
    return (
      <div data-mdx-image-wrapper="true">
        <Image
          src={src || ''}
          alt={alt || ''}
          width={1000}
          height={1000}
          sizes="(max-width: 768px) 100vw, 80vw"
          unoptimized={true}
          loading="lazy" // lazy loading 명시적 적용 (성능 최적화)
          decoding="async" // 비동기 디코딩 (성능 최적화)
        />
      </div>
    );
  },
  table: ({ children }) => (
    <div className="table-wrapper">
      <table>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
};
