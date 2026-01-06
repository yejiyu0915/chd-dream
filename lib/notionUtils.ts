import type { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/**
 * Notion 속성에서 텍스트 추출
 */
export function extractPlainText(property: any): string {
  if (!property) return '';

  if (property.type === 'title' && property.title?.[0]?.plain_text) {
    return property.title[0].plain_text;
  }

  if (property.type === 'rich_text' && property.rich_text?.[0]?.plain_text) {
    return property.rich_text[0].plain_text;
  }

  return '';
}

/**
 * Notion 날짜 속성에서 날짜 추출
 */
export function extractDate(property: any): string {
  if (!property || property.type !== 'date' || !property.date?.start) {
    return '';
  }
  return property.date.start;
}

/**
 * Notion 페이지에서 기본 메타데이터 추출 (API용)
 */
export function extractPageMetadata(page: PageObjectResponse, slug: string) {
  const titleProperty = page.properties.Title;
  const dateProperty = page.properties.Date;

  const title =
    titleProperty?.type === 'title' && titleProperty.title?.[0]?.plain_text
      ? titleProperty.title[0].plain_text
      : '제목 없음';

  const date =
    dateProperty?.type === 'date' && dateProperty.date?.start ? dateProperty.date.start : '';

  return {
    id: page.id,
    title,
    date,
    slug,
  };
}

/**
 * 상세 페이지용 메타데이터 추출 (카테고리 제외)
 */
export function extractDetailPageMetadata(page: PageObjectResponse, currentSeason: string) {
  const titleProperty = page.properties.Title;
  const dateProperty = page.properties.Date;
  const tagsProperty = page.properties.Tags;

  const title =
    titleProperty?.type === 'title' && titleProperty.title?.[0]?.plain_text
      ? titleProperty.title[0].plain_text
      : '제목 없음';

  const date =
    dateProperty?.type === 'date' && dateProperty.date?.start
      ? new Date(dateProperty.date.start)
          .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
          .replace(/\. /g, '.')
          .replace(/\.$/, '')
      : '날짜 없음';

  const tags =
    tagsProperty?.type === 'multi_select' && tagsProperty.multi_select
      ? tagsProperty.multi_select.map((tag: { name: string }) => tag.name)
      : [];

  // 이미지 URL 추출
  const defaultImageUrl = `/images/title/${currentSeason}/info.jpg`;
  let imageUrl = defaultImageUrl;

  if (page.cover) {
    if (page.cover.type === 'external') {
      imageUrl = page.cover.external.url || defaultImageUrl;
    } else if (page.cover.type === 'file') {
      imageUrl = `/api/notion-image?pageId=${page.id}&type=cover`;
    }
  }

  return { title, date, tags, imageUrl };
}

/**
 * 상세 페이지용 메타데이터 추출 (카테고리 포함 - C-LOG용)
 */
export function extractDetailPageMetadataWithCategory(
  page: PageObjectResponse,
  currentSeason: string
) {
  const baseMetadata = extractDetailPageMetadata(page, currentSeason);
  const categoryProperty = page.properties.Category;
  const band1Property = page.properties.Band1;
  const band2Property = page.properties.Band2;

  const category =
    categoryProperty?.type === 'select' && categoryProperty.select?.name
      ? categoryProperty.select.name
      : '기타';

  // Band1, Band2 URL 추출
  const band1 =
    band1Property?.type === 'url' && band1Property.url ? band1Property.url : null;
  const band2 =
    band2Property?.type === 'url' && band2Property.url ? band2Property.url : null;

  return {
    ...baseMetadata,
    category,
    band1,
    band2,
  };
}

/**
 * Notion 블록을 클라이언트용 형태로 변환
 */
export function processNotionBlocks(blocks: BlockObjectResponse[], pageId: string) {
  return blocks.map((block) => {
    const baseBlock = {
      id: block.id,
      type: block.type,
    };

    // 블록 타입별로 필요한 데이터만 추출
    switch (block.type) {
      case 'paragraph':
        return {
          ...baseBlock,
          content: block.paragraph?.rich_text?.map((text: any) => text.plain_text).join('') || '',
        };

      case 'heading_1':
        return {
          ...baseBlock,
          content: block.heading_1?.rich_text?.map((text: any) => text.plain_text).join('') || '',
        };

      case 'heading_2':
        return {
          ...baseBlock,
          content: block.heading_2?.rich_text?.map((text: any) => text.plain_text).join('') || '',
        };

      case 'heading_3':
        return {
          ...baseBlock,
          content: block.heading_3?.rich_text?.map((text: any) => text.plain_text).join('') || '',
        };

      case 'bulleted_list_item':
        return {
          ...baseBlock,
          content:
            block.bulleted_list_item?.rich_text?.map((text: any) => text.plain_text).join('') ||
            '',
        };

      case 'numbered_list_item':
        return {
          ...baseBlock,
          content:
            block.numbered_list_item?.rich_text?.map((text: any) => text.plain_text).join('') ||
            '',
        };

      case 'quote':
        return {
          ...baseBlock,
          content: block.quote?.rich_text?.map((text: any) => text.plain_text).join('') || '',
        };

      case 'code':
        return {
          ...baseBlock,
          content: block.code?.rich_text?.map((text: any) => text.plain_text).join('') || '',
          language: block.code?.language || 'plain',
        };

      case 'image':
        return {
          ...baseBlock,
          url:
            block.image?.type === 'external'
              ? block.image.external.url
              : block.image?.type === 'file'
                ? `/api/notion-image?pageId=${pageId}&blockId=${block.id}`
                : '',
          caption: block.image?.caption?.map((text: any) => text.plain_text).join('') || '',
        };

      default:
        return baseBlock;
    }
  });
}

