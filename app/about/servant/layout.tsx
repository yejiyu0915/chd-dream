import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/servant');

export default function ServantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

