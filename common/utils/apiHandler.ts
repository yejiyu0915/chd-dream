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
        'Cache-Control': 'public, max-age=300, must-revalidate', // 5분 캐시, 재검증 강제
        ETag: `"${notionLastEditedTime || new Date().getTime()}"`, // ETag 추가로 더 정확한 캐싱
      },
    });
  } catch (_error) {
    // error 변수명을 _error로 변경하여 사용되지 않음을 명시
    void _error; // _error가 사용되지 않는다는 린트 경고를 피하기 위해 추가
    // console.error(`API 요청 처리 중 오류 발생:`, _error); // 디버깅을 위해 활성화
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
