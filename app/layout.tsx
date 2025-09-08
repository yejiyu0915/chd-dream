import type { Metadata } from 'next';
import '@/common/styles/globals.scss';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import SmoothScroll from '@/common/components/utils/SmoothScroll';
import Providers from './providers';
// import React, { useState } from 'react'; // React와 useState 임포트 제거
import { MobileMenuProvider } from '@/app/contexts/MobileMenuContext'; // MobileMenuProvider 임포트

export const metadata: Metadata = {
  title: '순복음인천초대교회',
  description: '꿈이 이루어지는 행복한 교회, 순복음인천초대교회입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 햄버거 메뉴 상태 제거

  return (
    <html lang="ko">
      <body>
        <Providers>
          <SmoothScroll>
            <div className="wrapper">
              <MobileMenuProvider>
                {' '}
                {/* MobileMenuProvider로 감싸기 */}
                <Header
                // isMobileMenuOpen={isMobileMenuOpen}
                // onToggleMobileMenu={setIsMobileMenuOpen}
                />
                {children}
              </MobileMenuProvider>{' '}
              {/* MobileMenuProvider 닫기 */}
              {/* {React.cloneElement(children as React.ReactElement, {
                isMobileMenuOpen,
              })} */}
              <Footer />
            </div>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
