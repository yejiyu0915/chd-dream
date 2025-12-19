import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/history');

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

