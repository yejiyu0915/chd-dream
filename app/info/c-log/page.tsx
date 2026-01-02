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

    // 데이터가 비어있는 경우 로깅 (프로덕션 모니터링용)
    if (!cLogData || cLogData.length === 0) {
      console.warn('[C-log] 리스트 페이지: 데이터가 비어있습니다.', {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    } else {
      console.log(`[C-log] 리스트 페이지: ${cLogData.length}개의 항목을 가져왔습니다.`);
    }
  } catch (error) {
    // 에러 발생 시 빈 배열로 초기화하여 페이지는 표시되도록 함
    // 프로덕션 모니터링을 위한 구조화된 에러 로깅
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'UnknownError',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };
    console.error('[C-log] 리스트 페이지 데이터를 가져오는 중 오류 발생:', errorDetails);
    cLogData = [];
  }

  // searchParams를 props로 전달
  return <CLogListClient initialCLogData={cLogData} searchParams={params} />;
}
