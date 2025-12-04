import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/group/newfamily');

export default function NewFamilyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

