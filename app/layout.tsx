import type { Metadata } from 'next';
import '@/common/styles/globals.scss';
import { Providers } from '@/app/providers';
import { MobileMenuProvider } from '@/common/components/layouts/Header/MobileMenuContext';
import LayoutContent from '@/common/components/layouts/LayoutContent';
import { getPopupWithContent } from '@/lib/notion';
import { getCurrentSeason } from '@/common/utils/season';

// 배포 시 실제 도메인으로 교체 필요
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  // 기본 메타데이터
  title: '행복으로가는교회', // 하위 layout에서 전체 제목을 직접 반환하므로 template 제거
  description: '꿈이 이루어지는 행복한 교회, 행복으로가는교회입니다. 인천 남동구 문화로 227',
  keywords: [
    '행복으로가는교회',
    '인천교회',
    '남동구교회',
    '기독교',
    '예배',
    '찬양',
    '설교',
    '청년부',
    '주일학교',
  ],

  // Open Graph (Facebook, KakaoTalk 등)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    title: '행복으로가는교회',
    description: '꿈이 이루어지는 행복한 교회, 행복으로가는교회입니다.',
    siteName: '행복으로가는교회',
    images: [
      {
        url: `${siteUrl}/images/og/og_251216.jpg`,
        width: 1200,
        height: 630,
        alt: '행복으로가는교회',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '행복으로가는교회',
    description: '꿈이 이루어지는 행복한 교회, 행복으로가는교회입니다.',
    images: [`${siteUrl}/images/og/og_251216.jpg`],
  },

  // 추가 메타 태그
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 사이트 검증
  verification: {
    google: '', // Google Search Console 인증 코드 추가 필요
    // naver: '', // 네이버 서치어드바이저 인증 코드 추가 필요
  },

  // 기타
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 팝업 데이터 + 콘텐츠 미리 가져오기 (메타데이터 + 블록)
  const popupData = await getPopupWithContent();

  // 현재 계절 판단 (서버에서 초기값 설정, 개발자 도구에서 수동 변경 가능)
  const currentSeason = getCurrentSeason();

  return (
    <html lang="ko" data-season={currentSeason}>
      {/* 개발자 도구에서 수동 변경 가능 */}
      <body>
        <Providers>
          <MobileMenuProvider>
            <LayoutContent initialPopupData={popupData}>{children}</LayoutContent>
          </MobileMenuProvider>
        </Providers>
      </body>
    </html>
  );
}
