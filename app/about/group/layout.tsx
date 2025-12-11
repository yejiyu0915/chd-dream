import GroupLayoutClient from '@/app/about/group/GroupLayoutClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/group');

export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GroupLayoutClient>{children}</GroupLayoutClient>;
}
