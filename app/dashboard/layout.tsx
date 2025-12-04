import type { Metadata } from 'next';
import '../../common/styles/globals.scss';

export const metadata: Metadata = {
  title: '작업 현황판 - 행복으로가는교회',
  description: '행복으로가는교회 웹사이트 개발 현황 대시보드',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
