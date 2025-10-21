import { getNotionPageAndContentBySlug } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  return handleApiGetRequest(
    request,
    'NOTION_SERMON_ID',
    () => getNotionPageAndContentBySlug('NOTION_SERMON_ID', resolvedParams.id),
    '주보 상세 데이터를 가져오는 데 실패했습니다.'
  );
}
