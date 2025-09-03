import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 경고: 타입 에러가 있어도 프로덕션 빌드를 허용
    ignoreBuildErrors: true,
  },
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
      // 필요하다면 다른 외부 이미지 도메인도 여기에 추가하세요.
    ],
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
  // Turbopack 설정 (안정화됨)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
