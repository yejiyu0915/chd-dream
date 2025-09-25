import { getMainNoticeData } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return handleApiGetRequest(
    request,
    'NOTION_NOTICE_ID',
    () => getMainNoticeData(), // 메인 페이지용 - 2개만
    '공지사항 데이터를 가져오는 데 실패했습니다.'
  );
}
