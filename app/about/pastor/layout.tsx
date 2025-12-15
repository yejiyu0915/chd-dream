import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/pastor');

export default function PastorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
