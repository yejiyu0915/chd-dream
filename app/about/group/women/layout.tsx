import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/group/women');

export default function WomenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
