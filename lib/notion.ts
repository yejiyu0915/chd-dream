import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GetPageResponse, // 사용되지 않지만, 임포트 오류를 피하기 위해 남겨둠
  BlockObjectResponse,
  // DatabaseObjectResponse,
  // BlockObjectResponse,
  // PartialPageObjectResponse,
  // PartialDatabaseObjectResponse,
  // PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 제네릭 아이템 타입 정의 (모든 속성을 포함할 수 있도록)
interface GenericItem {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Notion API 응답의 유연성을 위해 any 허용
}

// Notion 페이지 객체를 특정 타입으로 변환하는 매퍼 함수 타입 정의
type ItemMapper<T> = (page: PageObjectResponse) => T | null;

// Notion 데이터 가져오기를 위한 제네릭 함수
export async function getNotionData<T extends GenericItem>(
  databaseIdEnvVar: string, // Notion 데이터베이스 ID 환경 변수 이름 (예: 'NOTION_CLOG_ID')
  mapper: ItemMapper<T>, // Notion 페이지 객체를 원하는 타입 T로 변환하는 매퍼 함수
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter?: QueryDatabaseResponse['results'][number] extends { properties: infer P }
      ? { property: keyof P; [key: string]: any }
      : any; // Notion 필터 타입으로 구체화
    sorts?: { property: string; direction: 'ascending' | 'descending' }[]; // 데이터 정렬 조건 (구체화)
    pageSize?: number; // 가져올 데이터의 최대 개수
    revalidateSeconds?: number; // 캐시 재검증 시간 (초 단위) - Next.js의 fetch revalidate와 관련되지만, 여기서는 직접 적용하지 않음
  }
): Promise<T[]> {
  // 환경 변수에서 Notion 토큰과 데이터베이스 ID 가져오기
  const notionDatabaseId = process.env[databaseIdEnvVar];
  if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
    // console.error(`Notion 토큰 또는 데이터베이스 ID (${databaseIdEnvVar})가 누락되었습니다.`);
    return [];
  }

  try {
    // Notion 데이터베이스 쿼리
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: options?.filter,
      sorts: options?.sorts,
      page_size: options?.pageSize,
      // Notion SDK 호출에는 Next.js fetch 캐싱 옵션을 직접 적용하지 않음. 대신 On-Demand Revalidation 사용
      // next: {
      //   revalidate: options?.revalidateSeconds ?? 60,
      // },
    });

    // 쿼리 결과를 매퍼 함수를 사용하여 원하는 타입으로 변환
    const items: T[] = response.results
      .map((page) => {
        if (
          !('properties' in page) ||
          page.object !== 'page'
          // !(page as PageObjectResponse).properties
        ) {
          return null; // properties가 없거나 페이지 객체가 아니거나 properties가 없는 경우 스킵
        }
        return mapper(page as PageObjectResponse); // PageObjectResponse로 타입 단언
      })
      .filter(Boolean) as T[]; // null 값 필터링 및 타입 단언

    return items;
  } catch (_error: unknown) {
    void _error; // _error가 사용되지 않는다는 린트 경고를 피하기 위해 추가
    // console.error(`Notion 데이터 가져오기 중 오류 발생 (${databaseIdEnvVar}):`, _error);
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

/**
 * Notion 데이터베이스의 마지막 수정 시간을 가져옵니다.
 * 이 함수는 데이터베이스 자체의 메타데이터를 조회하여,
 * 데이터베이스 내용의 변경 여부를 빠르게 확인하는 데 사용됩니다.
 * @param databaseIdEnvVar Notion 데이터베이스 ID 환경 변수 이름
 * @returns 마지막 수정 시간 (ISO 8601 형식 문자열) 또는 null
 */
export async function getNotionDatabaseLastEditedTime(
  databaseIdEnvVar: string
): Promise<string | null> {
  const notionDatabaseId = process.env[databaseIdEnvVar];
  if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
    // console.error(`Notion 토큰 또는 데이터베이스 ID (${databaseIdEnvVar})가 누락되었습니다.`);
    return null;
  }

  try {
    const database = await notion.databases.retrieve({
      database_id: notionDatabaseId,
      // Notion SDK 호출에는 Next.js fetch 캐싱 옵션을 직접 적용하지 않음. 대신 On-Demand Revalidation 사용
      // next: {
      //   revalidate: 10, // 데이터베이스 메타데이터 캐시 시간 (10초)
      // },
    });

    if ('last_edited_time' in database) {
      return database.last_edited_time;
    }
    return null;
  } catch (_error: unknown) {
    void _error; // _error가 사용되지 않는다는 린트 경고를 피하기 위해 추가
    // console.error(
    //   `Notion 데이터베이스 마지막 수정 시간 가져오기 중 오류 발생 (${databaseIdEnvVar}):`,
    //   _error
    // );
    return null;
  }
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
  slug: string; // slug 속성 추가
  link: string; // link 속성 다시 추가
  description?: string; // description 속성 추가
}

// 설교 데이터 타입 정의
export interface SermonItem {
  id: string;
  date: string;
  title: string;
  summary: string; // Notion의 Summary (s.verse)
  verse: string; // Notion의 Verse (s.desc)
  link: string;
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

interface NotionProperty {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Notion 속성의 동적 특성으로 인해 any 허용
}

// Notion 속성에서 일반 텍스트를 추출하는 헬퍼 함수
function getPlainText(property: NotionProperty | undefined): string | null {
  if (!property) return null;

  if (property.type === 'title' && 'title' in property && property.title[0]?.plain_text) {
    return property.title[0].plain_text;
  } else if (
    property.type === 'rich_text' &&
    'rich_text' in property &&
    property.rich_text[0]?.plain_text
  ) {
    return property.rich_text[0].plain_text;
  } else if (property.type === 'url' && 'url' in property && property.url) {
    return property.url;
  }
  return null;
}

// Notion 날짜 속성에서 포맷된 날짜 문자열을 추출하는 헬퍼 함수
function getFormattedDate(property: NotionProperty | undefined): string {
  if (!property || property.type !== 'date' || !('date' in property) || !property.date?.start) {
    return '날짜 없음';
  }
  return new Date(property.date.start)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '.')
    .replace(/\.$/, '');
}

// CLogItem 매핑 함수
const mapPageToCLogItem: ItemMapper<CLogItem> = (page) => {
  const properties = page.properties;

  // 속성 이름을 정확히 명시하고 타입 가드를 활용합니다.
  const titleProperty = properties.Title as NotionProperty | undefined;
  const categoryProperty = properties.Category as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const tagsProperty = properties.Tags as NotionProperty | undefined;
  const slugProperty = properties.Slug as NotionProperty | undefined; // Slug 속성 추가
  const descriptionProperty = properties.Description as NotionProperty | undefined; // Description 속성 추가

  let imageUrlToUse = '/no-image.svg';

  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrlToUse = page.cover.external.url || '/no-image.svg';
    } else if (page.cover.type === 'file') {
      imageUrlToUse = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  }

  const slug = getPlainText(slugProperty) || ''; // slug 추출

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    category:
      (categoryProperty && 'select' in categoryProperty && categoryProperty.select?.name) || '기타',
    date: getFormattedDate(dateProperty),
    imageUrl: imageUrlToUse,
    imageAlt: getPlainText(titleProperty) || 'C-log 이미지',
    tags: (tagsProperty &&
    'multi_select' in tagsProperty &&
    Array.isArray(tagsProperty.multi_select)
      ? tagsProperty.multi_select
      : []
    ).map((tag: { name: string }) => tag.name),
    slug: slug, // slug 매핑
    link: `/info/c-log/${slug}`, // link 속성 추가
    description: getPlainText(descriptionProperty) || undefined, // description 매핑
  };
};

// 설교 데이터 매핑 함수
const mapPageToSermonItem: ItemMapper<SermonItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const summaryProperty = properties.Summary as NotionProperty | undefined;
  const verseProperty = properties.Verse as NotionProperty | undefined;
  const linkProperty = properties.Link as NotionProperty | undefined;

  return {
    id: page.id,
    date: getFormattedDate(dateProperty),
    title: getPlainText(titleProperty) || '제목 없음',
    summary: getPlainText(summaryProperty) || '요약 없음',
    verse: getPlainText(verseProperty) || '본문 없음',
    link:
      linkProperty && 'url' in linkProperty && typeof linkProperty.url === 'string'
        ? linkProperty.url
        : '/',
  };
};

// 뉴스 데이터 매핑 함수
const mapPageToNewsItem: ItemMapper<NewsItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    date: getFormattedDate(dateProperty),
  };
};

// KV Slider 데이터 매핑 함수
const mapPageToKVSliderItem: ItemMapper<KVSliderItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const descriptionProperty = properties.Summary as NotionProperty | undefined;
  const linkProperty = properties.Link as NotionProperty | undefined;
  const imageProperty = properties.Image as NotionProperty | undefined;

  let imageUrlToUse = '/main/kv.jpg';
  let imageAltToUse = getPlainText(titleProperty) || '이미지';

  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrlToUse = page.cover.external.url || '/main/kv.jpg';
    } else if (page.cover.type === 'file') {
      imageUrlToUse = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  } else if (imageProperty && 'files' in imageProperty && imageProperty.files?.[0]) {
    const file = imageProperty.files[0];
    if (file.type === 'external') {
      imageUrlToUse = file.external.url;
    } else if (file.type === 'file') {
      imageUrlToUse = `/api/notion-image?pageId=${page.id}&propertyId=${imageProperty.id}`; // propertyId는 string이므로 as any 제거
    }
    imageAltToUse = file.name || '이미지';
  }

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    description: getPlainText(descriptionProperty) || '설명 없음',
    image: imageUrlToUse,
    imageAlt: imageAltToUse,
    link:
      linkProperty && 'url' in linkProperty && typeof linkProperty.url === 'string'
        ? linkProperty.url
        : '/',
  };
};

// Notion 데이터베이스에서 C-log 데이터 가져오기
export async function getCLogData(): Promise<CLogItem[]> {
  return getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem);
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

// Notion 데이터베이스에서 메인 페이지용 C-log 데이터 (6개) 가져오기
export async function getCLogMainData(): Promise<CLogItem[]> {
  return getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem, 6);
}

export async function getNotionPageAndContentBySlug(
  databaseIdEnvVar: string,
  slug: string
): Promise<{ page: PageObjectResponse; blocks: BlockObjectResponse[] } | null> {
  const notionDatabaseId = process.env[databaseIdEnvVar];
  if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
    return null;
  }

  try {
    // 1. 슬러그로 페이지 찾기
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: {
        property: 'Slug', // Notion 데이터베이스의 slug 속성 이름
        rich_text: {
          equals: slug,
        },
      },
      page_size: 1, // 슬러그는 고유해야 하므로 하나만 가져옵니다.
      // Notion SDK 호출에는 Next.js fetch 캐싱 옵션을 직접 적용하지 않음. 대신 On-Demand Revalidation 사용
      // next: { revalidate: 60 }, // 60초 동안 Notion 데이터베이스 쿼리 결과 캐싱
    });

    if (response.results.length === 0) {
      return null; // 해당 슬러그를 가진 페이지가 없습니다.
    }

    const page = response.results[0];

    if (!('properties' in page) || page.object !== 'page') {
      return null; // 유효한 페이지 객체가 아닙니다.
    }

    // 2. 페이지의 모든 블록 가져오기
    const blocks: BlockObjectResponse[] = [];
    let cursor: string | null = null;
    do {
      const blockResponse = await notion.blocks.children.list({
        block_id: page.id,
        start_cursor: cursor || undefined,
        // Notion SDK 호출에는 Next.js fetch 캐싱 옵션을 직접 적용하지 않음. 대신 On-Demand Revalidation 사용
        // next: { revalidate: 60 }, // 60초 동안 Notion 블록 내용 캐싱
      });
      blocks.push(...(blockResponse.results as BlockObjectResponse[]));
      cursor = blockResponse.next_cursor;
    } while (cursor);

    return { page: page as PageObjectResponse, blocks };
  } catch (_error: unknown) {
    void _error;
    // console.error(`Notion 페이지 및 콘텐츠 가져오기 중 오류 발생:`, _error);
    return null;
  }
}

export async function getPrevNextCLogPosts(currentSlug: string): Promise<{
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}> {
  const clogItems = await getCLogData(); // 모든 C-log 데이터 가져오기 (날짜 내림차순 정렬)

  let prevPost: { title: string; slug: string } | null = null;
  let nextPost: { title: string; slug: string } | null = null;

  for (let i = 0; i < clogItems.length; i++) {
    const item = clogItems[i];
    // const itemSlug = item.link?.split('/').pop(); // link 속성 대신 slug 사용

    if (item.slug === currentSlug) {
      // item.slug로 비교
      // 현재 게시글을 찾았을 때 이전/다음 게시글 설정
      if (i > 0) {
        const prevItem = clogItems[i - 1];
        prevPost = {
          title: prevItem.title,
          slug: prevItem.slug, // slug 사용
        };
      }
      if (i < clogItems.length - 1) {
        const nextItem = clogItems[i + 1];
        nextPost = {
          title: nextItem.title,
          slug: nextItem.slug, // slug 사용
        };
      }
      break; // 현재 게시글을 찾았으므로 루프 종료
    }
  }

  return { prev: prevPost, next: nextPost };
}
