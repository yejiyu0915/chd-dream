import {
  extractText,
  flushCurrentList,
  renderChildren,
} from '@/app/worship/bulletin/utils/bulletinUtils';
import { renderTable } from '@/app/worship/bulletin/utils/tableUtils';

// 변환 결과 캐시 (메모이제이션)
const conversionCache = new Map<string, string>();

// 노션 블록을 MDX 형식의 HTML 문자열로 변환 (최적화된 버전)
export const convertBlocksToMdxHtml = (blocks: unknown[]): string => {
  // 캐시 키 생성 (블록 구조를 기반으로)
  const cacheKey = JSON.stringify(blocks);

  // 캐시에서 결과 확인
  if (conversionCache.has(cacheKey)) {
    return conversionCache.get(cacheKey)!;
  }

  // 블록 수가 많으면 청크 단위로 처리 (메모리 최적화)
  const CHUNK_SIZE = 50;
  const result: string[] = [];

  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    const chunkResult = processBlockChunk(chunk);
    result.push(chunkResult);
  }

  const finalResult = result.join('');

  // 결과를 캐시에 저장 (캐시 크기 제한)
  if (conversionCache.size > 50) {
    // 캐시가 너무 커지면 가장 오래된 항목 제거
    const firstKey = conversionCache.keys().next().value;
    conversionCache.delete(firstKey);
  }
  conversionCache.set(cacheKey, finalResult);

  return finalResult;
};

// 블록 청크 처리 함수 (메모리 최적화)
const processBlockChunk = (blocks: unknown[]): string => {
  const result: string[] = [];
  let currentList: string[] = [];
  let currentListType: 'bulleted' | 'numbered' | null = null;

  // 현재 리스트를 결과에 추가하는 함수
  const flushCurrentListLocal = () => {
    if (currentList.length > 0) {
      const listTag = currentListType === 'numbered' ? 'ol' : 'ul';
      result.push(`<${listTag}>${currentList.join('')}</${listTag}>`);
      currentList = [];
      currentListType = null;
    }
  };

  blocks.forEach((block: unknown) => {
    const blockObj = block as Record<string, unknown>;

    if (
      blockObj.type === 'paragraph' &&
      blockObj.paragraph &&
      typeof blockObj.paragraph === 'object'
    ) {
      flushCurrentListLocal();
      const paragraph = blockObj.paragraph as Record<string, unknown>;
      const text = extractText(paragraph.rich_text);
      if (text) {
        result.push(`<p>${text}</p>`);
      }
    } else if (
      blockObj.type === 'heading_1' &&
      blockObj.heading_1 &&
      typeof blockObj.heading_1 === 'object'
    ) {
      flushCurrentListLocal();
      const heading = blockObj.heading_1 as Record<string, unknown>;
      const text = extractText(heading.rich_text);
      if (text) {
        result.push(`<h1>${text}</h1>`);
      }
    } else if (
      blockObj.type === 'heading_2' &&
      blockObj.heading_2 &&
      typeof blockObj.heading_2 === 'object'
    ) {
      flushCurrentListLocal();
      const heading = blockObj.heading_2 as Record<string, unknown>;
      const text = extractText(heading.rich_text);
      if (text) {
        result.push(`<h2>${text}</h2>`);
      }
    } else if (
      blockObj.type === 'heading_3' &&
      blockObj.heading_3 &&
      typeof blockObj.heading_3 === 'object'
    ) {
      flushCurrentListLocal();
      const heading = blockObj.heading_3 as Record<string, unknown>;
      const text = extractText(heading.rich_text);
      if (text) {
        result.push(`<h3>${text}</h3>`);
      }
    } else if (
      blockObj.type === 'bulleted_list_item' &&
      blockObj.bulleted_list_item &&
      typeof blockObj.bulleted_list_item === 'object'
    ) {
      if (currentListType !== 'bulleted') {
        flushCurrentListLocal();
        currentListType = 'bulleted';
      }
      const listItem = blockObj.bulleted_list_item as Record<string, unknown>;
      const text = extractText(listItem.rich_text);
      const children = Array.isArray(blockObj.children)
        ? renderChildren(blockObj.children as unknown[])
        : '';
      currentList.push(`<li>${text}${children}</li>`);
    } else if (
      blockObj.type === 'numbered_list_item' &&
      blockObj.numbered_list_item &&
      typeof blockObj.numbered_list_item === 'object'
    ) {
      if (currentListType !== 'numbered') {
        flushCurrentListLocal();
        currentListType = 'numbered';
      }
      const listItem = blockObj.numbered_list_item as Record<string, unknown>;
      const text = extractText(listItem.rich_text);
      const children = Array.isArray(blockObj.children)
        ? renderChildren(blockObj.children as unknown[])
        : '';
      currentList.push(`<li>${text}${children}</li>`);
    } else if (blockObj.type === 'table' && blockObj.table && typeof blockObj.table === 'object') {
      flushCurrentListLocal();
      const tableHtml = renderTable(blockObj);
      if (tableHtml) {
        result.push(tableHtml);
      }
    } else if (
      blockObj.type === 'quote' &&
      blockObj.quote &&
      typeof blockObj.quote === 'object'
    ) {
      flushCurrentListLocal();
      const quote = blockObj.quote as Record<string, unknown>;
      const text = extractText(quote.rich_text);
      if (text) {
        result.push(`<blockquote><p>${text}</p></blockquote>`);
      }
    }
  });

  // 마지막 리스트 플러시
  flushCurrentListLocal();

  return result.join('');
};

// HTML 태그 매핑 (h1→h2, h2→h3, h3→h4)
export const processHtmlTags = (html: string): string => {
  // 순서 중요: 뒤에서부터 치환해야 함
  return html
    .replace(/<h3>/g, '<h5>')
    .replace(/<\/h3>/g, '</h5>')
    .replace(/<h2>/g, '<h4>')
    .replace(/<\/h2>/g, '</h4>')
    .replace(/<h1>/g, '<h3>')
    .replace(/<\/h1>/g, '</h3>');
};

// HTML을 MDX 문자열로 변환 (blockquote 등 MDX 태그 지원)
export const htmlToMdx = (html: string): string => {
  // HTML을 그대로 MDX로 사용 (MDX는 HTML을 지원함)
  // blockquote 태그는 MDX에서 그대로 사용 가능
  return html;
};
