import { Suspense } from 'react';
import { getCLogData } from '@/lib/notion';
import CLogListClient from '@/app/info/c-log/components/CLogListClient';

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function CLogListPage() {
  // 서버에서 C-Log 데이터를 병렬로 가져옴 (빠른 초기 로딩)
  const cLogData = await getCLogData();

  // useSearchParams()를 사용하므로 Suspense로 감싸기 (Next.js 15 요구사항)
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CLogListClient initialCLogData={cLogData} />
    </Suspense>
  );
}
