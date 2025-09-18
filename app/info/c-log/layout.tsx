import { getCLogData } from '@/lib/notion';
import React, { Suspense } from 'react';

export async function generateStaticParams() {
  const clogItems = await getCLogData();
  return clogItems.map((item) => ({
    slug: item.slug,
  }));
}

export default function CLogLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>로딩 중...</div>}>{children}</Suspense>;
}
