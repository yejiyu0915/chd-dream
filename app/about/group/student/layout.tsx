import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/group/student');

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}





