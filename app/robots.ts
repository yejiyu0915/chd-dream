import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 배포 시 실제 도메인으로 교체 필요 (환경변수 사용)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // API 라우트 크롤링 차단
          '/dashboard/', // 대시보드 크롤링 차단
          '/_next/', // Next.js 내부 파일 크롤링 차단
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}









