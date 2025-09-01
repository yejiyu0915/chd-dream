import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'; // PageObjectResponse 임포트

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
  tags: string[];
}

// Notion 데이터베이스에서 C-log 데이터 가져오기
export async function getCLogData(): Promise<CLogItem[]> {
  // 환경변수 체크
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CLOG_ID) {
    // 빈 배열을 반환하여 페이지 자체는 깨지지 않도록 합니다.
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CLOG_ID,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      page_size: 6, // 메인 화면에 표시할 아이템 수
    });

    const cLogItems: CLogItem[] = response.results.map((page: PageObjectResponse) => {
      const properties = page.properties;

      let imageUrlToUse = '/no-image.svg'; // 기본 이미지 URL

      if (page.cover) {
        if (page.cover.type === 'external') {
          imageUrlToUse = page.cover.external.url;
        } else if (page.cover.type === 'file') {
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
        tags: (properties.Tags?.multi_select || []).map((tag: { name: string }) => tag.name),
      };
    });

    return cLogItems;
  } catch (error) {
    return [];
  }
}
