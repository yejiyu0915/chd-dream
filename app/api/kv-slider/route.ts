import { getKVSliderData } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return handleApiGetRequest(
    request,
    'NOTION_KV_ID',
    () => getKVSliderData(),
    'KV Slider 데이터를 가져오는 데 실패했습니다.'
  );
}
