import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
  DatabaseObjectResponse,
  BlockObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 제네릭 아이템 타입 정의 (모든 속성을 포함할 수 있도록)
interface GenericItem {
  id: string;
  [key: string]: any;
}

// Notion 페이지 객체를 특정 타입으로 변환하는 매퍼 함수 타입 정의
type ItemMapper<T> = (page: PageObjectResponse) => T | null;

// Notion 데이터 가져오기를 위한 제네릭 함수
export async function getNotionData<T extends GenericItem>(
  databaseIdEnvVar: string, // Notion 데이터베이스 ID 환경 변수 이름 (예: 'NOTION_CLOG_ID')
  mapper: ItemMapper<T>, // Notion 페이지 객체를 원하는 타입 T로 변환하는 매퍼 함수
  options?: {
    filter?: any; // 데이터 필터링 조건
    sorts?: any[]; // 데이터 정렬 조건
    pageSize?: number; // 가져올 데이터의 최대 개수
    revalidateSeconds?: number; // 캐시 재검증 시간 (초 단위)
  }
): Promise<T[]> {
  // 환경 변수에서 Notion 토큰과 데이터베이스 ID 가져오기
  const notionDatabaseId = process.env[databaseIdEnvVar];
  if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
    console.error(`Notion 토큰 또는 데이터베이스 ID (${databaseIdEnvVar})가 누락되었습니다.`);
    return [];
  }

  try {
    // Notion 데이터베이스 쿼리
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: options?.filter,
      sorts: options?.sorts,
      page_size: options?.pageSize,
      // Next.js 캐싱을 위한 revalidate 옵션 적용 (기본 60초)
      next: {
        revalidate: options?.revalidateSeconds ?? 60,
      },
    });

    // 쿼리 결과를 매퍼 함수를 사용하여 원하는 타입으로 변환
    const items: T[] = response.results
      .map((page) => {
        if (
          !('properties' in page) ||
          page.object !== 'page' ||
          !(page as PageObjectResponse).properties
        ) {
          return null; // properties가 없거나 페이지 객체가 아니거나 properties가 없는 경우 스킵
        }
        return mapper(page as PageObjectResponse); // PageObjectResponse로 타입 단언
      })
      .filter(Boolean) as T[]; // null 값 필터링 및 타입 단언

    return items;
  } catch (error: unknown) {
    console.error(`Notion 데이터 가져오기 중 오류 발생 (${databaseIdEnvVar}):`, error);
    return [];
  }
}

// 발행된 Notion 데이터를 가져오는 헬퍼 함수
export async function getPublishedNotionData<T extends GenericItem>(
  databaseIdEnvVar: string, // Notion 데이터베이스 ID 환경 변수 이름
  mapper: ItemMapper<T>, // Notion 페이지 객체를 원하는 타입 T로 변환하는 매퍼 함수
  pageSize?: number // 가져올 데이터의 최대 개수
): Promise<T[]> {
  return getNotionData<T>(databaseIdEnvVar, mapper, {
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
    pageSize: pageSize,
    revalidateSeconds: 60,
  });
}

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

// 뉴스 데이터 타입 정의
export interface NewsItem {
  id: string;
  title: string;
  date: string;
}

// KV Slider 데이터 타입 정의
export interface KVSliderItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: string;
}

// Notion 속성에서 일반 텍스트를 추출하는 헬퍼 함수
function getPlainText(property: any): string | null {
  if (property?.title?.[0]?.plain_text) {
    return property.title[0].plain_text;
  } else if (property?.rich_text?.[0]?.plain_text) {
    return property.rich_text[0].plain_text;
  }
  return null;
}

// Notion 날짜 속성에서 포맷된 날짜 문자열을 추출하는 헬퍼 함수
function getFormattedDate(property: any): string {
  if (property?.date?.start) {
    return new Date(property.date.start)
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .replace(/\.$/, '');
  }
  return '날짜 없음';
}

// CLogItem 매핑 함수
const mapPageToCLogItem: ItemMapper<CLogItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as any;
  const categoryProperty = properties.Category as any;
  const dateProperty = properties.Date as any;
  const tagsProperty = properties.Tags as any;

  let imageUrlToUse = '/no-image.svg';

  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrlToUse = (page.cover as any).external.url || '/no-image.svg';
    } else if (page.cover.type === 'file') {
      imageUrlToUse = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  }

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    category: categoryProperty?.select?.name || '기타',
    date: getFormattedDate(dateProperty),
    imageUrl: imageUrlToUse,
    imageAlt: getPlainText(titleProperty) || 'C-log 이미지',
    tags: (tagsProperty?.multi_select || []).map((tag: { name: string }) => tag.name),
  };
};

// 설교 데이터 매핑 함수
const mapPageToSermonItem: ItemMapper<SermonItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as any;
  const dateProperty = properties.Date as any;
  const summaryProperty = properties.Summary as any;
  const verseProperty = properties.Verse as any;

  return {
    id: page.id,
    date: getFormattedDate(dateProperty),
    title: getPlainText(titleProperty) || '제목 없음',
    summary: getPlainText(summaryProperty) || '요약 없음',
    verse: getPlainText(verseProperty) || '본문 없음',
  };
};

// 뉴스 데이터 매핑 함수
const mapPageToNewsItem: ItemMapper<NewsItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as any;
  const dateProperty = properties.Date as any;

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    date: getFormattedDate(dateProperty),
  };
};

// KV Slider 데이터 매핑 함수
const mapPageToKVSliderItem: ItemMapper<KVSliderItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as any;
  const descriptionProperty = properties.Summary as any;
  const linkProperty = properties.Link as any;
  const imageProperty = properties.Image as any;

  let imageUrlToUse = '/main/kv.jpg';
  let imageAltToUse = getPlainText(titleProperty) || '이미지';

  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrlToUse = (page.cover as any).external.url || '/main/kv.jpg';
    } else if (page.cover.type === 'file') {
      imageUrlToUse = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  } else if (imageProperty?.files?.[0]) {
    const file = imageProperty.files[0];
    if (file.type === 'external') {
      imageUrlToUse = file.external.url;
    } else if (file.type === 'file') {
      imageUrlToUse = `/api/notion-image?pageId=${page.id}&propertyId=${imageProperty.id}`; // propertyId 추가
    }
    imageAltToUse = file.name || '이미지';
  }

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    description: getPlainText(descriptionProperty) || '설명 없음',
    image: imageUrlToUse,
    imageAlt: imageAltToUse,
    link: linkProperty?.url || '/',
  };
};

// Notion 데이터베이스에서 C-log 데이터 가져오기
export async function getCLogData(): Promise<CLogItem[]> {
  return getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem, 6);
}

// Notion 데이터베이스에서 최신 설교 데이터 가져오기
export async function getSermonData(): Promise<SermonItem | null> {
  const sermons = await getPublishedNotionData<SermonItem>(
    'NOTION_SERMON_ID',
    mapPageToSermonItem,
    1
  );
  return sermons.length > 0 ? sermons[0] : null;
}

// Notion 데이터베이스에서 최신 뉴스 데이터 가져오기
export async function getNewsData(): Promise<NewsItem[]> {
  return getPublishedNotionData<NewsItem>('NOTION_NEWS_ID', mapPageToNewsItem, 2);
}

// Notion 데이터베이스에서 최신 KV Slider 데이터 가져오기
export async function getKVSliderData(): Promise<KVSliderItem[]> {
  return getPublishedNotionData<KVSliderItem>('NOTION_KV_ID', mapPageToKVSliderItem);
}
