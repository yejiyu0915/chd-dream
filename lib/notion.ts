import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'; // PageObjectResponse 임포트
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
// import type { FilePageCoverResponse } from '@notionhq/client/build/src/api-endpoints'; // FilePageCoverResponse 임포트 제거
// import type { ExternalPageCoverResponse } from '@notionhq/client/build/src/api-endpoints'; // ExternalPageCoverResponse 임포트 제거

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

// 설교 데이터 타입 정의
export interface SermonItem {
  id: string;
  date: string;
  title: string;
  summary: string; // Notion의 Summary (s.verse)
  verse: string; // Notion의 Verse (s.desc)
}

// Notion 데이터베이스에서 C-log 데이터 가져오기
export async function getCLogData(): Promise<CLogItem[]> {
  // 환경변수 체크
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CLOG_ID) {
    // 빈 배열을 반환하여 페이지 자체는 깨지지 않도록 합니다.
    return [];
  }

  try {
    const response: QueryDatabaseResponse = await notion.databases.query({
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

    const cLogItems: CLogItem[] = response.results
      .map((page) => {
        // page가 PageObjectResponse 타입임을 단언
        if (!('properties' in page)) return null; // properties가 없는 경우 스킵
        const properties = (page as PageObjectResponse).properties;

        // Notion 속성 접근 시 타입 단언 추가
        const titleProperty = properties.Title as any; // 또는 TitleProperty 타입을 정의하여 사용
        const categoryProperty = properties.Category as any;
        const dateProperty = properties.Date as any;
        const tagsProperty = properties.Tags as any;

        let imageUrlToUse = '/no-image.svg'; // 기본 이미지 URL

        if ((page as PageObjectResponse).cover) {
          if ((page as PageObjectResponse).cover?.type === 'external') {
            imageUrlToUse =
              ((page as PageObjectResponse).cover as any).external.url || '/no-image.svg'; // as any 사용
          } else if ((page as PageObjectResponse).cover?.type === 'file') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            imageUrlToUse = `/api/notion-image?url=${encodeURIComponent(((page as PageObjectResponse).cover as any).file.url || '')}`;
          }
        }

        return {
          id: page.id,
          title: titleProperty?.title?.[0]?.plain_text || '제목 없음',
          category: categoryProperty?.select?.name || '기타',
          date: dateProperty?.date?.start
            ? new Date(dateProperty.date.start)
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '.')
                .replace(/\.$/, '')
            : '날짜 없음',
          imageUrl: imageUrlToUse,
          imageAlt: titleProperty?.title?.[0]?.plain_text || 'C-log 이미지',
          tags: (tagsProperty?.multi_select || []).map((tag: { name: string }) => tag.name),
        };
      })
      .filter(Boolean) as CLogItem[]; // null 값 필터링 및 타입 단언

    return cLogItems;
  } catch (_error: unknown) {
    // error 변수 타입을 unknown으로 변경
    void _error; // _error 변수가 사용되지 않음을 명시
    return [];
  }
}

// Notion 데이터베이스에서 최신 설교 데이터 가져오기
export async function getSermonData(): Promise<SermonItem | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_SERMON_ID) {
    return null;
  }

  try {
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: process.env.NOTION_SERMON_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      page_size: 1, // 최신 설교 하나만 가져옴
    });

    if (response.results.length === 0) {
      return null; // 설교 데이터가 없는 경우
    }

    const page = response.results[0];
    if (!('properties' in page)) return null; // properties가 없는 경우 스킵

    const properties = (page as PageObjectResponse).properties;

    // Notion 속성 접근 시 타입 단언 추가
    const titleProperty = properties.Title as any;
    const dateProperty = properties.Date as any;
    const summaryProperty = properties.Summary as any;
    const verseProperty = properties.Verse as any;

    // 날짜 포맷팅
    const date = dateProperty?.date?.start
      ? new Date(dateProperty.date.start)
          .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\. /g, '.')
          .replace(/\.$/, '')
      : '날짜 없음';

    return {
      id: page.id,
      date: date,
      title: titleProperty?.title?.[0]?.plain_text || '제목 없음',
      summary: summaryProperty?.rich_text?.[0]?.plain_text || '요약 없음', // Notion의 Summary 필드
      verse: verseProperty?.rich_text?.[0]?.plain_text || '본문 없음', // Notion의 Verse 필드
    };
  } catch (_error: unknown) {
    // error 변수 타입을 unknown으로 변경
    void _error; // _error 변수가 사용되지 않음을 명시
    return null;
  }
}
