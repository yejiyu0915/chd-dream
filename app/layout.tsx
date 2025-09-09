// 'use client'; // 클라이언트 컴포넌트 지시문 제거
import type { Metadata } from 'next';
import '@/common/styles/globals.scss';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
// import SmoothScroll from '@/common/components/utils/SmoothScroll'; // SmoothScroll 임포트 제거
import Providers from './providers';
// import React, { useState } from 'react'; // React와 useState 임포트 제거
import { MobileMenuProvider } from '@/common/components/layouts/Header/MobileMenuContext'; // MobileMenuProvider만 임포트
import LayoutContent from '@/common/components/layouts/LayoutContent'; // 분리된 LayoutContent 임포트

export const metadata: Metadata = {
  title: '순복음인천초대교회',
  description: '꿈이 이루어지는 행복한 교회, 순복음인천초대교회입니다.',
};

// 'use client'; // 클라이언트 컴포넌트 지시문 추가 (제거)
// function LayoutContent({ children }: { children: React.ReactNode }) {
//   const { setLenisInstance } = useMobileMenu(); // MobileMenuContext에서 setLenisInstance 가져오기
//   return (
//     <SmoothScroll setLenisInstance={setLenisInstance}>
//       {' '}
//       // setLenisInstance prop 전달
//       <div className="wrapper">
//         <Header />
//         {children}
//         <Footer />
//       </div>
//     </SmoothScroll>
//   );
// }

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
          <MobileMenuProvider>
            {' '}
            {/* MobileMenuProvider로 감싸기 */}
            <LayoutContent>{children}</LayoutContent>
          </MobileMenuProvider>{' '}
          {/* MobileMenuProvider 닫기 */}
          {/* {React.cloneElement(children as React.ReactElement, {
            isMobileMenuOpen,
          })} */}
        </Providers>
      </body>
    </html>
  );
}
