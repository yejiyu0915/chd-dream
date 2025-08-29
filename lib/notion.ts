import { Client } from '@notionhq/client';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// C-log 데이터 타입 정의
export interface CLogItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

// Notion 데이터베이스에서 C-log 데이터 가져오기
export async function getCLogData(): Promise<CLogItem[]> {
  console.log('[C-LOG DEBUG] getCLogData 함수 실행 시작...');

  // 환경변수 체크
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CLOG_ID) {
    console.error(
      '[C-LOG DEBUG] 🚨 Notion API 토큰 또는 데이터베이스 ID가 .env.local 파일에 설정되지 않았습니다.'
    );
    // 빈 배열을 반환하여 페이지 자체는 깨지지 않도록 합니다.
    return [];
  }

  console.log(
    `[C-LOG DEBUG] 데이터베이스 ID (${process.env.NOTION_CLOG_ID})로 API 호출을 시도합니다.`
  );

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CLOG_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      page_size: 6, // 메인 화면에 표시할 아이템 수
    });

    console.log(
      `[C-LOG DEBUG] Notion API가 성공적으로 응답했습니다. 가져온 페이지 수: ${response.results.length}개`
    );

    const cLogItems: CLogItem[] = response.results.map((page: any) => {
      const properties = page.properties;

      // console.log('[Notion DEBUG] page properties:', properties); // 전체 properties 로그 (주석 처리)
      // console.log('[Notion DEBUG] Image property:', properties.Image); // Image 속성 로그 (주석 처리)
      // console.log('[Notion DEBUG] Page Cover:', page.cover); // Page Cover 속성 로그 (주석 처리)

      let imageUrlToUse = '/no-image.svg'; // 기본 이미지 URL

      if (page.cover) {
        if (page.cover.type === 'external') {
          imageUrlToUse = page.cover.external.url; // 외부 이미지 URL 직접 사용
        } else if (page.cover.type === 'file') {
          // Notion 내부 파일 이미지이므로 프록시 API 사용
          imageUrlToUse = `/api/notion-image?url=${encodeURIComponent(page.cover.file.url)}`;
        }
      }

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || '제목 없음',
        category: properties.Category?.select?.name || '기타',
        date: properties.Date?.date?.start
          ? new Date(properties.Date.date.start)
              .toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\. /g, '.')
              .replace(/\.$/, '')
          : '날짜 없음',
        imageUrl: imageUrlToUse,
        imageAlt: properties.Title?.title?.[0]?.plain_text || 'C-log 이미지',
      };
    });

    console.log(`[C-LOG DEBUG] ${cLogItems.length}개의 페이지를 성공적으로 파싱했습니다.`);
    return cLogItems;
  } catch (error) {
    console.error('[C-LOG DEBUG] 🚨 Notion API 호출 중 심각한 오류가 발생했습니다:', error);
    // 에러 발생 시 빈 배열을 반환합니다.
    return [];
  }
}
