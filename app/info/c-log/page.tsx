import { getCLogData, CLogItem } from '@/lib/notion';
import CLogListClient from '@/app/info/c-log/components/CLogListClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/c-log');

// 페이지를 동적 렌더링으로 강제 설정
export const dynamic = 'force-dynamic';

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function CLogListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; sort?: string; view?: string }>;
}) {
  // searchParams를 await로 받기 (Next.js 16 권장 방식)
  const params = await searchParams;

  // 서버에서 C-Log 데이터를 병렬로 가져옴 (빠른 초기 로딩)
  let cLogData: CLogItem[] = [];
  try {
    cLogData = await getCLogData();
  } catch (error) {
    // 에러 발생 시 빈 배열로 초기화하여 페이지는 표시되도록 함
    console.error('C-log 데이터를 가져오는 중 오류 발생:', error);
    cLogData = [];
  }

  // searchParams를 props로 전달
  return <CLogListClient initialCLogData={cLogData} searchParams={params} />;
}
