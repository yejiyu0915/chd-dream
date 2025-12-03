import { getBulletinListData } from '@/lib/notion';
import BulletinClient from '@/app/worship/bulletin/components/BulletinClient';

// 개발 환경에서는 캐시 비활성화, 프로덕션에서는 5분마다 재검증
// export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 300;

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function BulletinPage() {
  // 서버에서 주보 리스트 데이터를 가져옴 (빠른 초기 로딩)
  const bulletinList = await getBulletinListData();

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <BulletinClient initialBulletinList={bulletinList} />;
}
