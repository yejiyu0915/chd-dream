import { NextResponse, type NextRequest } from 'next/server';
import { getNotionDatabaseLastEditedTime } from '@/lib/notion';

type DataFetcher<T> = () => Promise<T>;

export async function handleApiGetRequest<T>(
  request: NextRequest,
  databaseIdEnvVar: string,
  dataFetcher: DataFetcher<T>,
  errorMessage: string = '데이터를 가져오는 데 실패했습니다.'
) {
  try {
    const clientLastModified = request.headers.get('If-Modified-Since');

    // Notion 데이터베이스의 현재 마지막 수정 시간 가져오기
    const notionLastEditedTime = await getNotionDatabaseLastEditedTime(databaseIdEnvVar);

    // 클라이언트가 보낸 시간과 Notion의 시간이 같으면 304 응답
    if (notionLastEditedTime && clientLastModified === notionLastEditedTime) {
      return new NextResponse(null, { status: 304 });
    }

    const data = await dataFetcher();

    // Notion의 현재 마지막 수정 시간을 Last-Modified 헤더에 담아 보냅니다.
    return NextResponse.json(data, {
      headers: {
        'Last-Modified': notionLastEditedTime || new Date().toUTCString(),
        // 캐시 제어 헤더를 여기에 추가할 수도 있습니다 (예: 'Cache-Control': 'no-cache, must-revalidate')
      },
    });
  } catch (error) {
    console.error(`API 요청 처리 중 오류 발생:`, error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
