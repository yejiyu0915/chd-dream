import type { Metadata } from 'next';
import '@/common/styles/globals.scss';
import { Providers } from '@/app/providers';
import { MobileMenuProvider } from '@/common/components/layouts/Header/MobileMenuContext';
import LayoutContent from '@/common/components/layouts/LayoutContent';

export const metadata: Metadata = {
  title: '행복으로가는교회',
  description: '꿈이 이루어지는 행복한 교회, 행복으로가는교회입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <MobileMenuProvider>
            <LayoutContent>{children}</LayoutContent>
          </MobileMenuProvider>
        </Providers>
      </body>
    </html>
  );
}
