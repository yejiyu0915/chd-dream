import { getBulletinListData, getNotionPageAndContentBySlug } from '@/lib/notion';
import BulletinClient from '@/app/worship/bulletin/components/BulletinClient';

// 페이지를 동적 렌더링으로 강제 설정
export const dynamic = 'force-dynamic';

// 개발 환경에서는 캐시 비활성화, 프로덕션에서는 5분마다 재검증
// export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 300;

// 서버 컴포넌트 - searchParams를 props로 받아서 클라이언트 컴포넌트에 전달
export default async function BulletinPage({
  searchParams,
}: {
  searchParams: Promise<{ content?: string }>;
}) {
  // searchParams를 await로 받기 (Next.js 16 권장 방식)
  const params = await searchParams;
  const contentParam = params.content || null;

  // 서버에서 주보 리스트 데이터를 가져옴 (빠른 초기 로딩)
  const bulletinList = await getBulletinListData();

  // 최신 주보의 내용을 미리 로드 (로딩 없이 즉시 표시)
  let initialLatestBulletinContent = null;
  if (bulletinList.length > 0 && !contentParam) {
    // URL 파라미터가 없을 때만 최신 주보 미리 로드
    const latestBulletin = bulletinList[0];
    const latestBulletinData = await getNotionPageAndContentBySlug(
      'NOTION_SERMON_ID',
      latestBulletin.slug
    );
    
    if (latestBulletinData && latestBulletinData.blocks) {
      initialLatestBulletinContent = {
        bulletinId: latestBulletin.id,
        blocks: latestBulletinData.blocks,
      };
    }
  }

  // useSearchParams 대신 서버에서 받은 searchParams를 props로 전달
  return (
    <BulletinClient
      initialBulletinList={bulletinList}
      contentParam={contentParam}
      initialLatestBulletinContent={initialLatestBulletinContent}
    />
  );
}
