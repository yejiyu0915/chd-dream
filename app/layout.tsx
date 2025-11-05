import type { Metadata } from 'next';
import '@/common/styles/globals.scss';
import { Providers } from '@/app/providers';
import { MobileMenuProvider } from '@/common/components/layouts/Header/MobileMenuContext';
import LayoutContent from '@/common/components/layouts/LayoutContent';
import { getPopupWithContent } from '@/lib/notion';

export const metadata: Metadata = {
  title: '행복으로가는교회',
  description: '꿈이 이루어지는 행복한 교회, 행복으로가는교회입니다.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 팝업 데이터 + 콘텐츠 미리 가져오기 (메타데이터 + 블록)
  const popupData = await getPopupWithContent();

  return (
    <html lang="ko">
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
