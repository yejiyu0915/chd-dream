import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/group/men');

export default function MenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
