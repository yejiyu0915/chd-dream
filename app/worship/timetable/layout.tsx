import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/worship/timetable');

export default function TimetableLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}



