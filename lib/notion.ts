import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GetPageResponse, // 사용되지 않지만, 임포트 오류를 피하기 위해 남겨둠
  BlockObjectResponse,
  // DatabaseObjectResponse,
  // PartialPageObjectResponse,
  // PartialDatabaseObjectResponse,
  // PartialBlockObjectResponse,
} from '@notionhq/client';
import { unstable_cache } from 'next/cache';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2025-09-03', // 최신 API 버전 지정
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
    filter?: any; // Notion API 필터 조건이 동적일 수 있으므로 any 허용
    sorts?: { property: string; direction: 'ascending' | 'descending' }[]; // 데이터 정렬 조건 (구체화)
    pageSize?: number; // 가져올 데이터의 최대 개수
    revalidateSeconds?: number; // 캐시 재검증 시간 (초 단위) - Next.js의 fetch revalidate와 관련되지만, 여기서는 직접 적용하지 않음
    tags?: string[]; // 캐싱을 위한 태그 (추가)
  }
): Promise<T[]> {
  // 환경 변수에서 Notion 토큰과 데이터베이스 ID 가져오기
  const notionDatabaseId = process.env[databaseIdEnvVar];
  if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
    // console.error(`Notion 토큰 또는 데이터베이스 ID (${databaseIdEnvVar})가 누락되었습니다.`);
    return [];
  }

  try {
    // 2025-09-03 버전업에 따라 data_source_id를 먼저 가져와야 함
    const databaseInfo = await notion.databases.retrieve({ database_id: notionDatabaseId });

    let dataSourceId: string | undefined;
    if (
      'data_sources' in databaseInfo &&
      Array.isArray(databaseInfo.data_sources) &&
      databaseInfo.data_sources.length > 0
    ) {
      dataSourceId = databaseInfo.data_sources[0].id; // 첫 번째 data_source_id 사용
    } else {
      // data_sources가 없거나 비어있는 경우, 이전처럼 database_id를 사용 (하위 호환성을 위해)
      dataSourceId = notionDatabaseId; // 이 부분은 실제 API 호출에서 database_id로 대체될 수 있습니다.
    }

    // Notion 데이터베이스 쿼리
    // Notion SDK v5에서는 dataSources.query를 사용 (업그레이드 가이드 참조)
    const pageSize = options?.pageSize || 1000;

    const response: any = await notion.dataSources.query({
      data_source_id: dataSourceId as string, // data_source_id 사용
      filter: options?.filter,
      sorts: options?.sorts,
      page_size: pageSize,
    });

    // 쿼리 결과를 매퍼 함수를 사용하여 원하는 타입으로 변환
    const items: T[] = response.results
      .map((page: PageObjectResponse) => {
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
    pageSize: pageSize || 1000, // pageSize가 없으면 1000으로 설정 (더 큰 값)
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
  link: string;
  slug: string; // slug 속성 추가
  popup: boolean; // 팝업 표시 여부
  popupStartDate: string; // 팝업 시작 날짜/시간
  popupEndDate: string; // 팝업 종료 날짜/시간
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
export const mapPageToNewsItem: ItemMapper<NewsItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const slugProperty = properties.Slug as NotionProperty | undefined; // Slug 속성 추가
  const popupProperty = properties.Popup as NotionProperty | undefined; // Popup 속성 추가
  const popupStartDateProperty = properties['Popup Start Date'] as NotionProperty | undefined; // Popup Start Date 속성 추가
  const popupEndDateProperty = properties['Popup End Date'] as NotionProperty | undefined; // Popup End Date 속성 추가

  // 팝업 체크박스 값 추출
  const popupValue = popupProperty && 'checkbox' in popupProperty ? popupProperty.checkbox : false;

  // 팝업 시작/종료 날짜 추출
  const popupStartDate =
    popupStartDateProperty && 'date' in popupStartDateProperty && popupStartDateProperty.date?.start
      ? popupStartDateProperty.date.start
      : '';
  const popupEndDate =
    popupEndDateProperty && 'date' in popupEndDateProperty && popupEndDateProperty.date?.start
      ? popupEndDateProperty.date.start
      : '';

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    date: getFormattedDate(dateProperty),
    link: `/info/news/${getPlainText(slugProperty) || page.id}`, // link 속성 추가
    slug: getPlainText(slugProperty) || page.id, // slug 매핑
    popup: popupValue, // 팝업 표시 여부
    popupStartDate: popupStartDate, // 팝업 시작 날짜/시간
    popupEndDate: popupEndDate, // 팝업 종료 날짜/시간
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
  return unstable_cache(
    async () => {
      return getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem);
    },
    ['clog-data'],
    { revalidate: 300, tags: ['clog-list'] } // 5분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 최신 설교 데이터 가져오기
export async function getSermonData(): Promise<SermonItem | null> {
  return unstable_cache(
    async () => {
      const sermons = await getPublishedNotionData<SermonItem>(
        'NOTION_SERMON_ID',
        mapPageToSermonItem,
        1
      );
      return sermons.length > 0 ? sermons[0] : null;
    },
    ['sermon-data'],
    { revalidate: 300, tags: ['sermon-list'] } // 5분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 최신 뉴스 데이터 가져오기 (모든 뉴스)
export async function getNewsData(): Promise<NewsItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<NewsItem>('NOTION_NEWS_ID', mapPageToNewsItem, 1000); // 명시적으로 1000개 지정
    },
    ['news-data'],
    { revalidate: 300, tags: ['news-list'] } // 5분 캐시, 태그 기반 재검증
  )();
}

// 메인 페이지용 뉴스 데이터 (2개만)
export async function getMainNewsData(): Promise<NewsItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<NewsItem>('NOTION_NEWS_ID', mapPageToNewsItem, 2); // 메인 페이지용 2개
    },
    ['main-news-data'],
    { revalidate: 300, tags: ['main-news'] } // 5분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 최신 KV Slider 데이터 가져오기
export async function getKVSliderData(): Promise<KVSliderItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<KVSliderItem>('NOTION_KV_ID', mapPageToKVSliderItem);
    },
    ['kv-slider-data'],
    { revalidate: 600, tags: ['kv-slider-list'] } // 10분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 메인 페이지용 C-log 데이터 (6개) 가져오기
export async function getCLogMainData(): Promise<CLogItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem, 6);
    },
    ['clog-main-data'],
    { revalidate: 300, tags: ['clog-list'] } // 5분 캐시, 태그 기반 재검증
  )();
}

export async function getNotionPageAndContentBySlug(
  databaseIdEnvVar: string,
  slug: string
): Promise<{ page: PageObjectResponse; blocks: BlockObjectResponse[] } | null> {
  return unstable_cache(
    async (databaseIdEnvVar: string, slug: string) => {
      const notionDatabaseId = process.env[databaseIdEnvVar];
      if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
        return null;
      }

      try {
        // 2025-09-03 버전업에 따라 data_source_id를 먼저 가져와야 함
        const databaseInfo = await notion.databases.retrieve({ database_id: notionDatabaseId });

        let dataSourceId: string | undefined;
        if (
          'data_sources' in databaseInfo &&
          Array.isArray(databaseInfo.data_sources) &&
          databaseInfo.data_sources.length > 0
        ) {
          dataSourceId = databaseInfo.data_sources[0].id; // 첫 번째 data_source_id 사용
        } else {
          dataSourceId = notionDatabaseId; // data_sources가 없거나 비어있는 경우, 이전처럼 database_id를 사용
        }

        // 1. 슬러그로 페이지 찾기
        const response: any = await notion.dataSources.query({
          // Notion SDK v5에서는 dataSources.query를 사용
          data_source_id: dataSourceId as string, // data_source_id 사용
          filter: {
            property: 'Slug', // Notion 데이터베이스의 slug 속성 이름
            rich_text: {
              equals: slug,
            },
          },
          page_size: 1, // 슬러그는 고유해야 하므로 하나만 가져옵니다.
        });

        if (response.results.length === 0) {
          return null; // 페이지를 찾을 수 없으면 null 반환
        }

        const page = response.results[0]; // 첫 번째 결과가 페이지 객체여야 합니다.

        // 2. 페이지의 모든 블록 가져오기
        const blocks: BlockObjectResponse[] = [];
        let cursor: string | null = null;
        do {
          const blockResponse = await notion.blocks.children.list({
            block_id: page.id,
            start_cursor: cursor || undefined,
          });
          blocks.push(...(blockResponse.results as BlockObjectResponse[]));
          cursor = blockResponse.next_cursor;
        } while (cursor);

        return { page: page as PageObjectResponse, blocks };
      } catch (error: unknown) {
        void error;
        // console.error(`Notion 페이지 및 콘텐츠 가져오기 중 오류 발생:`, error);
        return null;
      }
    },
    [`${databaseIdEnvVar}-detail-${slug}`],
    { revalidate: 60, tags: [`${databaseIdEnvVar}-post-${slug}`] }
  )(databaseIdEnvVar, slug);
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

export type PrevNextCLogPosts = Awaited<ReturnType<typeof getPrevNextCLogPosts>>;

// 뉴스 이전/다음 포스트 가져오기 함수
export async function getPrevNextNewsPosts(currentSlug: string): Promise<{
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}> {
  // 캐시된 뉴스 데이터 사용 (빌드 성능 개선)
  const newsItems = await getNewsData();

  let prevPost: { title: string; slug: string } | null = null;
  let nextPost: { title: string; slug: string } | null = null;

  for (let i = 0; i < newsItems.length; i++) {
    const item = newsItems[i];

    if (item.slug === currentSlug) {
      // 현재 게시글을 찾았을 때 이전/다음 게시글 설정
      if (i > 0) {
        const prevItem = newsItems[i - 1];
        prevPost = {
          title: prevItem.title,
          slug: prevItem.slug,
        };
      }
      if (i < newsItems.length - 1) {
        const nextItem = newsItems[i + 1];
        nextPost = {
          title: nextItem.title,
          slug: nextItem.slug,
        };
      }
      break; // 현재 게시글을 찾았으므로 루프 종료
    }
  }

  return { prev: prevPost, next: nextPost };
}

export type PrevNextNewsPosts = Awaited<ReturnType<typeof getPrevNextNewsPosts>>;

// NewsItem 인터페이스는 위에서 이미 정의됨 (팝업 속성 포함)

// Notion에서 뉴스 게시물 목록을 가져오는 함수
export async function getNewsPosts(
  databaseIdEnvVar: string,
  pageSize?: number
): Promise<NewsItem[] | null> {
  return unstable_cache(
    async (databaseIdEnvVar: string, pageSize?: number) => {
      const notionDatabaseId = process.env[databaseIdEnvVar];
      if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
        return null;
      }

      try {
        // 2025-09-03 버전업에 따라 data_source_id를 먼저 가져와야 함
        const databaseInfo = await notion.databases.retrieve({ database_id: notionDatabaseId });

        let dataSourceId: string | undefined;
        if (
          'data_sources' in databaseInfo &&
          Array.isArray(databaseInfo.data_sources) &&
          databaseInfo.data_sources.length > 0
        ) {
          dataSourceId = databaseInfo.data_sources[0].id; // 첫 번째 data_source_id 사용
        } else {
          dataSourceId = notionDatabaseId; // data_sources가 없거나 비어있는 경우, 이전처럼 database_id를 사용
        }

        const response: any = await notion.dataSources.query({
          data_source_id: dataSourceId as string, // data_source_id 사용
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
          page_size: pageSize || 1000, // pageSize가 없으면 1000으로 설정
        });

        const newsItems: NewsItem[] = response.results.map((page: PageObjectResponse) => {
          const p = page as PageObjectResponse;
          const titleProperty = p.properties.Title;
          const dateProperty = p.properties.Date;
          const slugProperty = p.properties.Slug; // Slug 속성 추가
          const popupProperty = p.properties.Popup; // Popup 속성 추가
          const popupStartDateProperty = p.properties['Popup Start Date']; // Popup Start Date 속성 추가
          const popupEndDateProperty = p.properties['Popup End Date']; // Popup End Date 속성 추가

          const title = getPlainText(titleProperty);
          const date = getFormattedDate(dateProperty);
          const slug = getPlainText(slugProperty) || p.id; // slug 추출 (없으면 page.id 사용)

          // 팝업 체크박스 값 추출
          const popupValue =
            popupProperty && 'checkbox' in popupProperty ? popupProperty.checkbox : false;

          // 팝업 시작/종료 날짜 추출
          const popupStartDate =
            popupStartDateProperty &&
            'date' in popupStartDateProperty &&
            popupStartDateProperty.date?.start
              ? popupStartDateProperty.date.start
              : '';
          const popupEndDate =
            popupEndDateProperty &&
            'date' in popupEndDateProperty &&
            popupEndDateProperty.date?.start
              ? popupEndDateProperty.date.start
              : '';

          return {
            id: p.id,
            title: title || '제목 없음',
            date: date || '날짜 없음',
            link: `/info/news/${slug}`, // Notion Page ID 대신 slug를 기반으로 링크 생성
            slug: slug,
            popup: popupValue, // 팝업 표시 여부
            popupStartDate: popupStartDate, // 팝업 시작 날짜/시간
            popupEndDate: popupEndDate, // 팝업 종료 날짜/시간
          };
        });

        return newsItems;
      } catch (error) {
        void error;
        return null;
      }
    },
    [`news-list${pageSize !== undefined ? `-${pageSize}` : ''}`],
    { revalidate: 60, tags: ['news-list'] }
  )(databaseIdEnvVar, pageSize);
}
