import { getBulletinListData } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest } from 'next/server';

// worship/bulletin 페이지용 - 주보 목록 반환
export async function GET(request: NextRequest) {
  return handleApiGetRequest(
    request,
    'NOTION_SERMON_ID',
    () => getBulletinListData(),
    '주보 데이터를 가져오는 데 실패했습니다.'
  );
}
