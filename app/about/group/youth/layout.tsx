import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/group/youth');

export default function YouthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}



