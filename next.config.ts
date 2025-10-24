import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 경고: 타입 에러가 있어도 프로덕션 빌드를 허용
    ignoreBuildErrors: true,
  },
  // React 컴파일러 활성화 (실험적 기능)
  experimental: {
    reactCompiler: true,
  },
  // 환경변수 명시적 설정 (클라이언트에서 사용)
  env: {
    NEXT_PUBLIC_KAKAO_MAP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
  },
  // 캐싱 최적화 설정 (Next.js 15에서는 isrMemoryCacheSize 옵션이 제거됨)
  images: {
    // Notion 외부 이미지 도메인 추가 (Notion 내부 URL은 필요 없음)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash 이미지 호스트 추가
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary 이미지 호스트 추가
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't1.daumcdn.net', // 카카오맵 타일 이미지
        port: '',
        pathname: '/**',
      },
      // 필요하다면 다른 외부 이미지 도메인도 여기에 추가하세요.
    ],
    // 이미지 캐싱 최적화
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7일 캐시
    formats: ['image/webp', 'image/avif'], // 최신 이미지 포맷 사용
  },
  // Browser-sync 관련 요청 무시
  async rewrites() {
    return [
      {
        source: '/browser-sync/:path*',
        destination: '/404',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/info',
        destination: '/info/news',
        permanent: true,
      },
    ];
  },
  // Turbopack 설정 (안정화됨)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    // remarkPlugins: [remarkGfm], // 전역 MDX 플러그인 설정 제거 또는 주석 처리
    // rehypePlugins: [
    //   rehypeSlug,
    //   rehypeExtractToc,
    //   [rehypePrettyCode, { theme: 'github-dark' }],
    //   rehypeSanitize,
    // ],
  },
});

export default withMDX(nextConfig);
