import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/blessing');

export default function BlessingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
