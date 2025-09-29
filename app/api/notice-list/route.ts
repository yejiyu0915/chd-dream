import { getNoticeData } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return handleApiGetRequest(
    request,
    'NOTION_NOTICE_ID',
    () => getNoticeData(), // 공지사항 리스트용 - 모든 공지사항
    '공지사항 리스트 데이터를 가져오는 데 실패했습니다.'
  );
}
