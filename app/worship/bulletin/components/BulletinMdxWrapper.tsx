import { Suspense } from 'react';
import BulletinMdxContent from './BulletinMdxContent';

interface BulletinMdxWrapperProps {
  content: string;
}

// 서버 컴포넌트 래퍼 - 클라이언트 컴포넌트에서 사용할 수 있도록
export default function BulletinMdxWrapper({ content }: BulletinMdxWrapperProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BulletinMdxContent content={content} />
    </Suspense>
  );
}


