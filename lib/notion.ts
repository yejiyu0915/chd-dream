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
import { getCurrentSeason } from '@/common/utils/season';
import { REVALIDATE_TIME } from '@/lib/revalidate.config';

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

  // 재시도 로직 (최대 3회, 지수 백오프)
  const maxRetries = 3;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
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

      // 성공 시 재시도 로그 (프로덕션 모니터링용)
      if (attempt > 0) {
        console.log(`[Notion] ${databaseIdEnvVar} 데이터 가져오기 성공 (재시도 ${attempt}회 후)`);
      }

      return items;
    } catch (error: unknown) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : 'UnknownError';

      // 재시도 가능한 에러인지 확인 (네트워크 오류, 타임아웃 등)
      const isRetryableError =
        errorName === 'APIResponseError' ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('network') ||
        errorMessage.includes('ECONNRESET') ||
        errorMessage.includes('ETIMEDOUT') ||
        (error instanceof Error && error.message.includes('rate limit'));

      // 마지막 시도이거나 재시도 불가능한 에러인 경우
      if (attempt === maxRetries - 1 || !isRetryableError) {
        // 프로덕션 모니터링을 위한 구조화된 에러 로깅
        console.error(`[Notion] ${databaseIdEnvVar} 데이터 가져오기 실패:`, {
          databaseIdEnvVar,
          attempt: attempt + 1,
          maxRetries,
          errorName,
          errorMessage,
          isRetryableError,
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        });
        return [];
      }

      // 재시도 전 대기 (지수 백오프: 1초, 2초, 4초)
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(
        `[Notion] ${databaseIdEnvVar} 데이터 가져오기 실패, ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries}):`,
        errorMessage
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // 모든 재시도 실패 시
  console.error(`[Notion] ${databaseIdEnvVar} 데이터 가져오기 최종 실패 (${maxRetries}회 시도)`);
  return [];
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
  rawDate: string; // 원본 날짜 (NEW 배지 판별용)
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
  praise: string; // Notion의 Praise (s.desc) - 기존 verse에서 변경
  slug: string; // slug 속성 추가
}

// 주보 데이터 타입 정의 (SermonItem과 동일)
export interface BulletinItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  praise: string;
  slug: string;
}

// 뉴스 데이터 타입 정의
export interface NewsItem {
  id: string;
  title: string;
  date: string; // 포맷된 날짜 문자열 (표시용)
  rawDate: string; // 원본 날짜/시간 정보 (계산용)
  link: string;
  slug: string; // slug 속성 추가
  popup: boolean; // 팝업 표시 여부
  popupStartDate: string; // 팝업 시작 날짜/시간
  popupEndDate: string; // 팝업 종료 날짜/시간
}

// 공지사항 데이터 타입 (뉴스와 동일한 구조)
export type NoticeItem = NewsItem;

// 일정 데이터 타입 정의
export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // ISO 날짜 문자열
  time?: string; // 시간 (선택사항)
  location?: string; // 장소 (선택사항)
  description?: string; // 설명 (선택사항)
  category?: string; // 카테고리 (선택사항)
  tags?: string[]; // 태그 배열 (선택사항)
  important?: boolean; // 중요 일정 여부 (선택사항)
  startDate?: string; // 시작 날짜/시간 (ISO 문자열)
  endDate?: string; // 종료 날짜/시간 (ISO 문자열)
  ongoing?: boolean; // 상시 일정 여부 (종료일 미정)
}

// KV Slider 데이터 타입 정의
export interface KVSliderItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: string | null; // URL이 없을 수 있으므로 null 허용
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

// 월별 주차 계산 함수
function getWeekNumber(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();

  // 해당 월의 첫 번째 날
  const firstDayOfMonth = new Date(year, month, 1);

  // 해당 월의 첫 번째 월요일 찾기
  const firstMonday = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6일, 아니면 dayOfWeek - 1
  firstMonday.setDate(firstDayOfMonth.getDate() - daysToMonday);

  // 현재 날짜와 첫 번째 월요일의 차이를 주 단위로 계산
  const diffTime = date.getTime() - firstMonday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber;
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

// 설교 데이터용 날짜 포맷 함수 (주차 정보 포함)
function getFormattedDateWithWeek(property: NotionProperty | undefined): string {
  if (!property || property.type !== 'date' || !('date' in property) || !property.date?.start) {
    return '날짜 없음';
  }
  const date = new Date(property.date.start);
  const formattedDate = date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '.')
    .replace(/\.$/, '');

  const weekNumber = getWeekNumber(date);
  return `${formattedDate} (${date.getFullYear()}년 ${date.getMonth() + 1}월 ${weekNumber}주차)`;
}

// Notion 날짜 속성에서 원본 날짜/시간 문자열을 추출하는 헬퍼 함수
function getRawDate(property: NotionProperty | undefined): string {
  if (!property || property.type !== 'date' || !('date' in property) || !property.date?.start) {
    return '';
  }
  return property.date.start;
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

  // 현재 계절을 가져와서 기본 이미지 경로 설정
  const currentSeason = getCurrentSeason();
  let imageUrlToUse = `/images/title/${currentSeason}/info.jpg`;

  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrlToUse = page.cover.external.url || `/images/title/${currentSeason}/info.jpg`;
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
    rawDate: getRawDate(dateProperty), // NEW 배지 판별용 원본 날짜
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
  const praiseProperty = properties.Praise as NotionProperty | undefined; // Verse → Praise로 변경
  const slugProperty = properties.Slug as NotionProperty | undefined; // Slug 속성 추가

  return {
    id: page.id,
    date: getFormattedDateWithWeek(dateProperty), // 설교 데이터에만 주차 정보 포함
    title: getPlainText(titleProperty) || '제목 없음',
    summary: getPlainText(summaryProperty) || '요약 없음',
    praise: getPlainText(praiseProperty) || '찬양 없음', // verse → praise로 변경
    slug: getPlainText(slugProperty) || page.id, // slug 매핑
  };
};

// 주보 데이터 매핑 함수 (SermonItem과 동일한 구조)
const mapPageToBulletinItem: ItemMapper<BulletinItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const summaryProperty = properties.Summary as NotionProperty | undefined;
  const praiseProperty = properties.Praise as NotionProperty | undefined;
  const slugProperty = properties.Slug as NotionProperty | undefined;

  return {
    id: page.id,
    date: getFormattedDateWithWeek(dateProperty), // 주보 데이터에도 주차 정보 포함
    title: getPlainText(titleProperty) || '제목 없음',
    summary: getPlainText(summaryProperty) || '요약 없음',
    praise: getPlainText(praiseProperty) || '찬양 없음',
    slug: getPlainText(slugProperty) || page.id,
  };
};

// 뉴스 데이터 매핑 함수
export const mapPageToNewsItem: ItemMapper<NewsItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const slugProperty = properties.Slug as NotionProperty | undefined; // Slug 속성 추가
  const popupProperty = properties.Popup as NotionProperty | undefined; // Popup 속성 추가
  const popupPeriodProperty = properties['Popup Period'] as NotionProperty | undefined; // Popup Period 속성 추가

  // 팝업 체크박스 값 추출
  const popupValue = popupProperty && 'checkbox' in popupProperty ? popupProperty.checkbox : false;

  // 팝업 기간에서 시작/종료 날짜 추출
  let popupStartDate = '';
  let popupEndDate = '';

  if (popupPeriodProperty && 'date' in popupPeriodProperty && popupPeriodProperty.date) {
    // 시작 날짜
    if (popupPeriodProperty.date.start) {
      popupStartDate = popupPeriodProperty.date.start;
    }
    // 종료 날짜
    if (popupPeriodProperty.date.end) {
      popupEndDate = popupPeriodProperty.date.end;
    }
  }

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    date: getFormattedDate(dateProperty),
    rawDate: getRawDate(dateProperty),
    link: `/info/news/${getPlainText(slugProperty) || page.id}`, // link 속성 추가
    slug: getPlainText(slugProperty) || page.id, // slug 매핑
    popup: popupValue, // 팝업 표시 여부
    popupStartDate: popupStartDate, // 팝업 시작 날짜/시간
    popupEndDate: popupEndDate, // 팝업 종료 날짜/시간
  };
};

// 공지사항 데이터 매핑 함수
export const mapPageToNoticeItem: ItemMapper<NoticeItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const slugProperty = properties.Slug as NotionProperty | undefined;
  const popupProperty = properties.Popup as NotionProperty | undefined;
  const popupPeriodProperty = properties['Popup Period'] as NotionProperty | undefined;

  // 팝업 체크박스 값 추출
  const popupValue = popupProperty && 'checkbox' in popupProperty ? popupProperty.checkbox : false;

  // 팝업 기간에서 시작/종료 날짜 추출
  let popupStartDate = '';
  let popupEndDate = '';

  if (popupPeriodProperty && 'date' in popupPeriodProperty && popupPeriodProperty.date) {
    // 시작 날짜
    if (popupPeriodProperty.date.start) {
      popupStartDate = popupPeriodProperty.date.start;
    }
    // 종료 날짜
    if (popupPeriodProperty.date.end) {
      popupEndDate = popupPeriodProperty.date.end;
    }
  }

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    date: getFormattedDate(dateProperty),
    rawDate: getRawDate(dateProperty),
    link: `/info/notice/${getPlainText(slugProperty) || page.id}`, // 공지사항 링크
    slug: getPlainText(slugProperty) || page.id,
    popup: popupValue,
    popupStartDate: popupStartDate,
    popupEndDate: popupEndDate,
  };
};

// 범용 데이터 매핑 함수 (메뉴 타입에 따라 동적 링크 생성)
export const mapPageToMenuItem = (menuType: 'news' | 'notice' | 'c-log') => {
  const basePath =
    menuType === 'news' ? '/info/news' : menuType === 'notice' ? '/info/notice' : '/info/c-log';

  return (page: PageObjectResponse): NewsItem => {
    const properties = page.properties;

    const titleProperty = properties.Title as NotionProperty | undefined;
    const dateProperty = properties.Date as NotionProperty | undefined;
    const slugProperty = properties.Slug as NotionProperty | undefined;
    const popupProperty = properties.Popup as NotionProperty | undefined;
    const popupPeriodProperty = properties['Popup Period'] as NotionProperty | undefined;

    // 팝업 체크박스 값 추출
    const popupValue =
      popupProperty && 'checkbox' in popupProperty ? popupProperty.checkbox : false;

    // 팝업 기간에서 시작/종료 날짜 추출
    let popupStartDate = '';
    let popupEndDate = '';

    if (popupPeriodProperty && 'date' in popupPeriodProperty && popupPeriodProperty.date) {
      // 시작 날짜
      if (popupPeriodProperty.date.start) {
        popupStartDate = popupPeriodProperty.date.start;
      }
      // 종료 날짜
      if (popupPeriodProperty.date.end) {
        popupEndDate = popupPeriodProperty.date.end;
      }
    }

    return {
      id: page.id,
      title: getPlainText(titleProperty) || '제목 없음',
      date: getFormattedDate(dateProperty),
      rawDate: getRawDate(dateProperty),
      link: `${basePath}/${getPlainText(slugProperty) || page.id}`, // 동적 링크 생성
      slug: getPlainText(slugProperty) || page.id,
      popup: popupValue,
      popupStartDate: popupStartDate,
      popupEndDate: popupEndDate,
    };
  };
};

// 일정 데이터 매핑 함수
const mapPageToScheduleItem: ItemMapper<ScheduleItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const dateProperty = properties.Date as NotionProperty | undefined;
  const timeProperty = properties.Time as NotionProperty | undefined;
  const locationProperty = properties.Location as NotionProperty | undefined;
  const descriptionProperty = properties.Description as NotionProperty | undefined;
  const categoryProperty = properties.Category as NotionProperty | undefined;
  const tagsProperty = properties.Tags as NotionProperty | undefined;
  const importantProperty = properties.Important as NotionProperty | undefined;
  const ongoingProperty = properties.Ongoing as NotionProperty | undefined; // Ongoing 체크박스 필드

  // 날짜를 ISO 문자열로 변환
  let dateString = '';
  let startDateString = '';
  let endDateString = '';

  if (dateProperty && dateProperty.type === 'date' && 'date' in dateProperty && dateProperty.date) {
    // 기본 날짜 (시작 날짜)
    if (dateProperty.date.start) {
      dateString = dateProperty.date.start;
      startDateString = dateProperty.date.start;
    }
    // 종료 날짜가 있으면 설정
    if (dateProperty.date.end) {
      endDateString = dateProperty.date.end;
    }
  }

  // Ongoing 체크박스 값 추출
  const ongoingValue =
    (ongoingProperty && 'checkbox' in ongoingProperty && ongoingProperty.checkbox) || false;

  return {
    id: page.id,
    title: getPlainText(titleProperty) || '제목 없음',
    date: dateString,
    time: getPlainText(timeProperty) || undefined,
    location: getPlainText(locationProperty) || undefined,
    description: getPlainText(descriptionProperty) || undefined,
    category:
      (categoryProperty && 'select' in categoryProperty && categoryProperty.select?.name) ||
      undefined,
    tags: (tagsProperty &&
    'multi_select' in tagsProperty &&
    Array.isArray(tagsProperty.multi_select)
      ? tagsProperty.multi_select
      : []
    ).map((tag: { name: string }) => tag.name),
    important:
      (importantProperty && 'checkbox' in importantProperty && importantProperty.checkbox) || false,
    startDate: startDateString || undefined,
    endDate: endDateString || undefined,
    ongoing: ongoingValue, // 상시 일정 여부
  };
};

// KV Slider 데이터 매핑 함수
const mapPageToKVSliderItem: ItemMapper<KVSliderItem> = (page) => {
  const properties = page.properties;

  const titleProperty = properties.Title as NotionProperty | undefined;
  const descriptionProperty = properties.Summary as NotionProperty | undefined;
  const linkProperty = properties.URL as NotionProperty | undefined; // 'Link'가 아닌 'URL' 필드 사용
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
        : null, // URL이 없으면 null 반환
  };
};

// Notion 데이터베이스에서 C-log 데이터 가져오기
export async function getCLogData(): Promise<CLogItem[]> {
  return unstable_cache(
    async () => {
      const startTime = Date.now();
      try {
        const data = await getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem);
        const duration = Date.now() - startTime;
        
        // 데이터 검증 및 상세 로깅
        if (!data) {
          console.error('[C-log] getCLogData: data가 null/undefined입니다.', {
            timestamp: new Date().toISOString(),
            duration: `${duration}ms`,
          });
          return [];
        }
        
        if (data.length === 0) {
          console.warn('[C-log] getCLogData: 데이터가 비어있습니다.', {
            timestamp: new Date().toISOString(),
            duration: `${duration}ms`,
            possibleCauses: [
              'Notion에 Published 상태의 항목이 없음',
              '모든 항목이 Preview 상태',
              'Notion 데이터베이스 필터 조건 불일치',
              'Notion에서 수정 중일 때 일시적 문제',
            ],
          });
        } else {
          console.log(`[C-log] getCLogData: ${data.length}개의 항목을 가져왔습니다. (${duration}ms)`);
        }
        
        return data;
      } catch (error) {
        const duration = Date.now() - startTime;
        // 에러 발생 시 상세 로깅
        const errorDetails = {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : 'UnknownError',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
          duration: `${duration}ms`,
          possibleCauses: [
            'Notion API rate limit 초과',
            '네트워크 타임아웃',
            'Notion 데이터베이스 접근 권한 문제',
            'Notion에서 수정 중일 때 일시적 오류',
            'Notion API 서버 문제',
          ],
        };
        console.error('[C-log] getCLogData 내부 에러:', errorDetails);
        
        // 에러 발생 시 빈 배열 반환 (캐시는 이전 값 유지)
        return [];
      }
    },
    ['clog-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['clog-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// C-log 데이터 가져오기 (NewsItem 타입으로)
export async function getCLogNewsData(): Promise<NewsItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<NewsItem>('NOTION_CLOG_ID', mapPageToMenuItem('c-log'), 1000);
    },
    ['clog-news-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['clog-list'] }
  )();
}

// 메인 페이지용 C-log 데이터 (2개만)
export async function getMainCLogData(): Promise<NewsItem[]> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getPublishedNotionData<NewsItem>('NOTION_CLOG_ID', mapPageToMenuItem('c-log'), 2);
  }

  return unstable_cache(
    async () => {
      return getPublishedNotionData<NewsItem>('NOTION_CLOG_ID', mapPageToMenuItem('c-log'), 2);
    },
    ['main-clog-data'],
    { revalidate: REVALIDATE_TIME.SHORT, tags: ['main-clog'] }
  )();
}

// Notion 데이터베이스에서 최신 설교 데이터 가져오기
export async function getSermonData(): Promise<SermonItem | null> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    const sermons = await getPublishedNotionData<SermonItem>(
      'NOTION_SERMON_ID',
      mapPageToSermonItem,
      1
    );
    return sermons.length > 0 ? sermons[0] : null;
  }

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
    { revalidate: REVALIDATE_TIME.LIST, tags: ['sermon-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 최신 주보 데이터 가져오기 (단일)
export async function getBulletinData(): Promise<BulletinItem | null> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    const bulletins = await getPublishedNotionData<BulletinItem>(
      'NOTION_SERMON_ID',
      mapPageToBulletinItem,
      1
    );
    return bulletins.length > 0 ? bulletins[0] : null;
  }

  return unstable_cache(
    async () => {
      const bulletins = await getPublishedNotionData<BulletinItem>(
        'NOTION_SERMON_ID',
        mapPageToBulletinItem,
        1
      );
      return bulletins.length > 0 ? bulletins[0] : null;
    },
    ['bulletin-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['bulletin-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 모든 주보 데이터 가져오기 (목록용)
export async function getBulletinListData(): Promise<BulletinItem[]> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getPublishedNotionData<BulletinItem>('NOTION_SERMON_ID', mapPageToBulletinItem, 1000);
  }

  return unstable_cache(
    async () => {
      return getPublishedNotionData<BulletinItem>('NOTION_SERMON_ID', mapPageToBulletinItem, 1000);
    },
    ['bulletin-list-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['bulletin-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// Notion 데이터베이스에서 최신 뉴스 데이터 가져오기 (모든 뉴스)
export async function getNewsData(): Promise<NewsItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<NewsItem>('NOTION_NEWS_ID', mapPageToMenuItem('news'), 1000); // 명시적으로 1000개 지정
    },
    ['news-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['news-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// 메인 페이지용 뉴스 데이터 (2개만)
export async function getMainNewsData(): Promise<NewsItem[]> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getPublishedNotionData<NewsItem>('NOTION_NEWS_ID', mapPageToMenuItem('news'), 2);
  }

  return unstable_cache(
    async () => {
      return getPublishedNotionData<NewsItem>('NOTION_NEWS_ID', mapPageToMenuItem('news'), 2); // 메인 페이지용 2개
    },
    ['main-news-data'],
    { revalidate: REVALIDATE_TIME.SHORT, tags: ['main-news'] } // 30초 캐시
  )();
}

// 공지사항 데이터 가져오기 (모든 공지사항)
export async function getNoticeData(): Promise<NoticeItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<NoticeItem>(
        'NOTION_NOTICE_ID',
        mapPageToMenuItem('notice'),
        1000
      );
    },
    ['notice-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['notice-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// 메인 페이지용 공지사항 데이터 (2개만)
export async function getMainNoticeData(): Promise<NoticeItem[]> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getPublishedNotionData<NoticeItem>('NOTION_NOTICE_ID', mapPageToMenuItem('notice'), 2);
  }

  return unstable_cache(
    async () => {
      return getPublishedNotionData<NoticeItem>('NOTION_NOTICE_ID', mapPageToMenuItem('notice'), 2);
    },
    ['main-notice-data'],
    { revalidate: REVALIDATE_TIME.SHORT, tags: ['main-notice'] } // 30초 캐시
  )();
}

// Notion 데이터베이스에서 최신 KV Slider 데이터 가져오기
export async function getKVSliderData(): Promise<KVSliderItem[]> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getPublishedNotionData<KVSliderItem>('NOTION_KV_ID', mapPageToKVSliderItem);
  }

  return unstable_cache(
    async () => {
      return getPublishedNotionData<KVSliderItem>('NOTION_KV_ID', mapPageToKVSliderItem);
    },
    ['kv-slider-data'],
    { revalidate: REVALIDATE_TIME.SHORT, tags: ['kv-slider-list'] } // 30초 캐시
  )();
}

// Notion 데이터베이스에서 메인 페이지용 C-log 데이터 (6개) 가져오기
export async function getCLogMainData(): Promise<CLogItem[]> {
  return unstable_cache(
    async () => {
      return getPublishedNotionData<CLogItem>('NOTION_CLOG_ID', mapPageToCLogItem, 6);
    },
    ['clog-main-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['clog-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

// 일정 데이터 가져오기
export async function getScheduleData(): Promise<ScheduleItem[]> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getPublishedNotionData<ScheduleItem>('NOTION_SCHEDULE_ID', mapPageToScheduleItem, 1000);
  }

  return unstable_cache(
    async () => {
      return getPublishedNotionData<ScheduleItem>(
        'NOTION_SCHEDULE_ID',
        mapPageToScheduleItem,
        1000
      );
    },
    ['schedule-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['schedule-list'] } // 3분 캐시, 태그 기반 재검증
  )();
}

export async function getNotionPageAndContentBySlug(
  databaseIdEnvVar: string,
  slug: string
): Promise<{ page: PageObjectResponse; blocks: BlockObjectResponse[] } | null> {
  // 개발 환경에서는 캐시를 비활성화
  if (process.env.NODE_ENV === 'development') {
    return getNotionPageAndContentBySlugInternal(databaseIdEnvVar, slug);
  }

  return unstable_cache(
    async (databaseIdEnvVar: string, slug: string) => {
      return getNotionPageAndContentBySlugInternal(databaseIdEnvVar, slug);
    },
    [`${databaseIdEnvVar}-detail-${slug}`],
    {
      revalidate: REVALIDATE_TIME.DETAIL, // 1시간 캐시 (성능 최적화)
      tags: [`${databaseIdEnvVar}-post-${slug}`, 'bulletin-content'],
    }
  )(databaseIdEnvVar, slug);
}

// 실제 데이터 가져오기 로직을 분리한 내부 함수
async function getNotionPageAndContentBySlugInternal(
  databaseIdEnvVar: string,
  slug: string
): Promise<{ page: PageObjectResponse; blocks: BlockObjectResponse[] } | null> {
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

    // 1. 슬러그로 페이지 찾기 (Published 또는 Preview 상태만 허용)
    // 리스트에는 Published만 보이지만, 상세 페이지는 Preview도 접근 가능하도록 함
    const response: any = await notion.dataSources.query({
      // Notion SDK v5에서는 dataSources.query를 사용
      data_source_id: dataSourceId as string, // data_source_id 사용
      filter: {
        and: [
          {
            property: 'Slug', // Notion 데이터베이스의 slug 속성 이름
            rich_text: {
              equals: slug,
            },
          },
          {
            or: [
              {
                property: 'Status',
                select: {
                  equals: 'Published',
                },
              },
              {
                property: 'Status',
                select: {
                  equals: 'Preview',
                },
              },
            ],
          },
        ],
      },
      page_size: 1, // 슬러그는 고유해야 하므로 하나만 가져옵니다.
    });

    if (response.results.length === 0) {
      return null; // 페이지를 찾을 수 없으면 null 반환
    }

    const page = response.results[0]; // 첫 번째 결과가 페이지 객체여야 합니다.

    // 2. 페이지의 모든 블록 가져오기 (최적화된 버전)
    const getAllBlocksWithChildren = async (blockId: string, depth = 0): Promise<any[]> => {
      // 최대 깊이 제한 (성능 최적화)
      if (depth > 3) {
        return [];
      }

      const allBlocks: any[] = [];
      let cursor: string | null = null;

      do {
        const blockResponse = await notion.blocks.children.list({
          block_id: blockId,
          start_cursor: cursor || undefined,
        });

        const blocks = blockResponse.results as BlockObjectResponse[];

        // 병렬 처리로 성능 개선
        const blockPromises = blocks.map(async (block) => {
          const blockWithChildren = { ...block } as any;

          // children이 있는 블록 타입들만 재귀적으로 처리 (깊이 제한)
          if (
            (block.type === 'bulleted_list_item' ||
              block.type === 'numbered_list_item' ||
              block.type === 'toggle' ||
              block.type === 'callout') &&
            depth < 2 // 중첩 깊이 제한
          ) {
            try {
              const childBlocks = await getAllBlocksWithChildren(block.id, depth + 1);
              blockWithChildren.children = childBlocks;
            } catch (error) {
              // children을 가져올 수 없는 경우 무시
              void error;
            }
          } else if (block.type === 'table') {
            // 테이블의 경우 table_rows를 별도로 가져오기
            try {
              const tableRowsResponse = await notion.blocks.children.list({
                block_id: block.id,
              });
              const tableRows = tableRowsResponse.results;
              blockWithChildren.table_rows = tableRows;
            } catch (error) {
              // 테이블 행을 가져올 수 없는 경우 무시
              void error;
            }
          }

          return blockWithChildren;
        });

        // 모든 블록을 병렬로 처리
        const processedBlocks = await Promise.all(blockPromises);
        allBlocks.push(...processedBlocks);

        cursor = blockResponse.next_cursor;
      } while (cursor);

      return allBlocks;
    };

    const blocks = await getAllBlocksWithChildren(page.id);

    return { page: page as PageObjectResponse, blocks };
  } catch (error: unknown) {
    void error;
    // console.error(`Notion 페이지 및 콘텐츠 가져오기 중 오류 발생:`, error);
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

// 공지사항 이전/다음 포스트 가져오기 함수
export async function getPrevNextNoticePosts(currentSlug: string): Promise<{
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}> {
  // 캐시된 공지사항 데이터 사용
  const noticeItems = await getNoticeData();

  let prevPost: { title: string; slug: string } | null = null;
  let nextPost: { title: string; slug: string } | null = null;

  for (let i = 0; i < noticeItems.length; i++) {
    const item = noticeItems[i];

    if (item.slug === currentSlug) {
      if (i > 0) {
        const prevItem = noticeItems[i - 1];
        prevPost = {
          title: prevItem.title,
          slug: prevItem.slug,
        };
      }
      if (i < noticeItems.length - 1) {
        const nextItem = noticeItems[i + 1];
        nextPost = {
          title: nextItem.title,
          slug: nextItem.slug,
        };
      }
      break;
    }
  }

  return { prev: prevPost, next: nextPost };
}

export type PrevNextNoticePosts = Awaited<ReturnType<typeof getPrevNextNoticePosts>>;

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
          const popupPeriodProperty = p.properties['Popup Period']; // Popup Period 속성 추가

          const title = getPlainText(titleProperty);
          const date = getFormattedDate(dateProperty);
          const rawDate = getRawDate(dateProperty);
          const slug = getPlainText(slugProperty) || p.id; // slug 추출 (없으면 page.id 사용)

          // 팝업 체크박스 값 추출
          const popupValue =
            popupProperty && 'checkbox' in popupProperty ? popupProperty.checkbox : false;

          // 팝업 기간에서 시작/종료 날짜 추출
          let popupStartDate = '';
          let popupEndDate = '';

          if (popupPeriodProperty && 'date' in popupPeriodProperty && popupPeriodProperty.date) {
            // 시작 날짜
            if (popupPeriodProperty.date.start) {
              popupStartDate = popupPeriodProperty.date.start;
            }
            // 종료 날짜
            if (popupPeriodProperty.date.end) {
              popupEndDate = popupPeriodProperty.date.end;
            }
          }

          return {
            id: p.id,
            title: title || '제목 없음',
            date: date || '날짜 없음',
            rawDate: rawDate,
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
    { revalidate: REVALIDATE_TIME.MEDIUM, tags: ['news-list'] }
  )(databaseIdEnvVar, pageSize);
}

// ===== 팝업 관련 함수 =====

// 팝업 데이터 타입 (NewsItem + 콘텐츠 블록)
export interface PopupData extends NewsItem {
  blocks?: BlockObjectResponse[]; // 콘텐츠 블록 (선택적)
}

// 팝업 조건에 맞는 데이터 가져오기 (News + Notice 통합)
export async function getPopupData(): Promise<PopupData | null> {
  return unstable_cache(
    async () => {
      try {
        // News와 Notice 데이터를 모두 가져오기
        const [allNewsData, allNoticeData] = await Promise.all([getNewsData(), getNoticeData()]);

        // 현재 시간
        const now = new Date();

        // 팝업 조건에 맞는 데이터 필터링 (News + Notice)
        const allPopupData = [...allNewsData, ...allNoticeData].filter((item) => {
          // 1. popup이 true인 항목만
          if (!item.popup) {
            return false;
          }

          // 2. popupStartDate가 설정되어 있으면 현재 시간이 시작 시간 이후여야 함
          if (item.popupStartDate && item.popupStartDate.trim() !== '') {
            const startDate = new Date(item.popupStartDate);
            if (now < startDate) {
              return false;
            }
          }

          // 3. 팝업 종료 날짜 체크
          let endDate: Date;

          if (item.popupEndDate && item.popupEndDate.trim() !== '') {
            // 명시적으로 종료 날짜가 설정된 경우
            endDate = new Date(item.popupEndDate);
          } else {
            // 종료 날짜가 설정되지 않은 경우, 작성일로부터 7일 후로 설정
            if (item.rawDate) {
              const itemDate = new Date(item.rawDate);
              endDate = new Date(itemDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 후
            } else {
              // rawDate가 없는 경우 현재 시간으로부터 7일 후로 설정
              endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            }
          }

          if (now > endDate) {
            return false;
          }

          return true;
        });

        // 팝업 데이터가 없으면 null 반환
        if (allPopupData.length === 0) {
          return null;
        }

        // 팝업 데이터가 여러 개인 경우 우선순위에 따라 정렬
        allPopupData.sort((a, b) => {
          // 1. popupEndDate가 가장 늦은 것 우선
          if (a.popupEndDate && b.popupEndDate) {
            const aEndDate = new Date(a.popupEndDate);
            const bEndDate = new Date(b.popupEndDate);
            if (aEndDate.getTime() !== bEndDate.getTime()) {
              return bEndDate.getTime() - aEndDate.getTime(); // 내림차순 (늦은 것이 먼저)
            }
          } else if (a.popupEndDate && !b.popupEndDate) {
            return -1; // a가 종료일이 있으면 우선
          } else if (!a.popupEndDate && b.popupEndDate) {
            return 1; // b가 종료일이 있으면 우선
          }

          // 2. popupEndDate가 같거나 둘 다 없으면 Date가 가장 최신인 것 우선
          const aDate = new Date(a.rawDate || a.date);
          const bDate = new Date(b.rawDate || b.date);
          return bDate.getTime() - aDate.getTime(); // 내림차순 (최신이 먼저)
        });

        // 가장 우선순위가 높은 항목 하나만 반환
        return allPopupData[0];
      } catch {
        return null;
      }
    },
    ['popup-data'],
    { revalidate: REVALIDATE_TIME.LIST, tags: ['popup-data'] } // 3분 캐시
  )();
}

// 팝업 데이터 + 콘텐츠 블록 함께 가져오기
export async function getPopupWithContent(): Promise<PopupData | null> {
  return unstable_cache(
    async () => {
      try {
        // 1. 팝업 메타데이터 가져오기
        const popupData = await getPopupData();

        if (!popupData) {
          return null;
        }

        // 2. 콘텐츠 블록 가져오기
        // link에서 타입 추론 (news인지 notice인지)
        const isNotice = popupData.link.includes('/info/notice/');
        const databaseIdEnvVar = isNotice ? 'NOTION_NOTICE_ID' : 'NOTION_NEWS_ID';

        const contentData = await getNotionPageAndContentBySlug(databaseIdEnvVar, popupData.slug);

        if (!contentData) {
          // 콘텐츠를 가져오지 못해도 메타데이터는 반환
          return popupData;
        }

        // 3. 메타데이터 + 콘텐츠 통합
        return {
          ...popupData,
          blocks: contentData.blocks,
        };
      } catch {
        return null;
      }
    },
    ['popup-with-content'],
    { revalidate: 300, tags: ['popup-data', 'popup-content'] } // 5분 캐시
  )();
}
