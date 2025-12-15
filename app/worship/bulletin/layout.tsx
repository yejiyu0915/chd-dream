import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/worship/bulletin');

export default function BulletinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
