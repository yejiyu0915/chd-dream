import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 경고: 타입 에러가 있어도 프로덕션 빌드를 허용
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
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
