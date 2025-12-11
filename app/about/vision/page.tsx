'use client';

import dynamic from 'next/dynamic';

// SSR 비활성화 - hydration 에러 방지
const VisionClient = dynamic(() => import('@/app/about/vision/components/VisionClient'), {
  ssr: false,
});

export default function VisionPage() {
  return <VisionClient />;
}
