import type { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { notionTableBlockToHtml } from '@/lib/notionTableToHtml';

/**
 * Notion → Markdown 변환 시 테이블만 HTML로 출력해
 * has_column_header / has_row_header 를 반영한다. (notion-to-md 기본은 항상 첫 행을 헤더로 취급)
 */
export function createNotionToMarkdownWithSemanticTables(notionClient: Client): NotionToMarkdown {
  const n2m = new NotionToMarkdown({ notionClient });
  n2m.setCustomTransformer('table', async (block) => notionTableBlockToHtml(block, notionClient));
  return n2m;
}
