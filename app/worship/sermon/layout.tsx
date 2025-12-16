import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/worship/sermon');

export default function SermonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

