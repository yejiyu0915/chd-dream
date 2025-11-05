import { getCLogData } from '@/lib/notion';
import CLogListClient from '@/app/info/c-log/components/CLogListClient';

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function CLogListPage() {
  // 서버에서 C-Log 데이터를 병렬로 가져옴 (빠른 초기 로딩)
  const cLogData = await getCLogData();

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <CLogListClient initialCLogData={cLogData} />;
}
