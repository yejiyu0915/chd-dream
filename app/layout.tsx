import type { Metadata } from 'next';
import '../common/styles/globals.scss';
import Header from '../common/components/layouts/Header/Header';
import Footer from '../common/components/layouts/Footer/Footer';
import SmoothScroll from '../common/components/utils/SmoothScroll';

export const metadata: Metadata = {
  title: '순복음인천초대교회',
  description: '꿈이 이루어지는 행복한 교회, 순복음인천초대교회입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SmoothScroll>
          <div className="wrapper">
            <Header />
            {children}
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
