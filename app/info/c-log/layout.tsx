import { getCLogData } from '@/lib/notion';

export async function generateStaticParams() {
  const clogItems = await getCLogData();
  return clogItems.map((item) => ({
    slug: item.slug,
  }));
}

export default function CLogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
