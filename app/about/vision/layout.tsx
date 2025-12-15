import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/about/vision');

export default function VisionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
