import type { RichTextItemResponse } from '@notionhq/client';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

/**
 * Notion rich_text 배열을 인라인 HTML로 변환 (MDX 본문에 삽입용, 이스케이프 처리).
 * notion-to-md paragraph 변환 순서(코드→굵게→기울임→취소선→밑줄)와 맞춤.
 */
export function richTextItemsToHtml(items: RichTextItemResponse[] | undefined): string {
  if (!items?.length) {
    return '';
  }

  const inner = items.map((item) => richTextItemToHtml(item)).join('');
  // MDX 본문에서 `{` `}` 는 표현식으로 해석되므로 테이블 셀 등에 포함되면 파싱 실패 → 엔티티로 이스케이프
  return inner.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}

function richTextItemToHtml(item: RichTextItemResponse): string {
  if (item.type === 'equation') {
    const expr = item.equation?.expression ?? '';
    return `<code>${escapeHtml(expr)}</code>`;
  }

  if (item.type === 'mention') {
    return escapeHtml(item.plain_text);
  }

  let text = escapeHtml(item.plain_text);
  const a = item.annotations;

  if (a?.code) {
    text = `<code>${text}</code>`;
  }
  if (a?.bold) {
    text = `<strong>${text}</strong>`;
  }
  if (a?.italic) {
    text = `<em>${text}</em>`;
  }
  if (a?.strikethrough) {
    text = `<del>${text}</del>`;
  }
  if (a?.underline) {
    text = `<u>${text}</u>`;
  }

  if (item.href) {
    text = `<a href="${escapeAttr(item.href)}">${text}</a>`;
  }

  return text;
}
