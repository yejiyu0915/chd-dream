import { getBulletinListData } from '@/lib/notion';
import BulletinClient from '@/app/worship/bulletin/components/BulletinClient';

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function BulletinPage() {
  // 서버에서 주보 리스트 데이터를 가져옴 (빠른 초기 로딩)
  const bulletinList = await getBulletinListData();

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <BulletinClient initialBulletinList={bulletinList} />;
}
