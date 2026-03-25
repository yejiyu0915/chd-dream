import type { RichTextItemResponse } from '@notionhq/client';
import type { Client } from '@notionhq/client';
import { richTextItemsToHtml } from '@/lib/notionRichTextToHtml';

/** notion-to-md 커스텀 트랜스포머·API 응답 등에서 오는 테이블 블록 (타입만 좁혀 사용) */
type TableBlockInput = {
  type: 'table';
  id: string;
  has_children: boolean;
  table: { has_column_header: boolean; has_row_header: boolean };
  table_rows?: TableRowInput[];
};

type TableRowInput = {
  type: 'table_row';
  table_row: { cells: RichTextItemResponse[][] };
};

function isTableBlock(b: unknown): b is TableBlockInput {
  return (
    typeof b === 'object' &&
    b !== null &&
    'type' in b &&
    (b as { type: string }).type === 'table' &&
    'table' in b
  );
}

function isTableRowBlock(b: unknown): b is TableRowInput {
  return (
    typeof b === 'object' &&
    b !== null &&
    'type' in b &&
    (b as { type: string }).type === 'table_row' &&
    'table_row' in b
  );
}

/**
 * Notion 테이블 블록을 HTML로 변환.
 * - has_column_header: 첫 행 → thead, 셀은 th(scope=col)
 * - has_row_header: 본문 각 행의 첫 셀 → th(scope=row), 나머지 td
 * - 둘 다 없으면 전체 tbody + td만 사용 (GFM/markdown-table과 달리 첫 행을 헤더로 취급하지 않음)
 */
export async function notionTableBlockToHtml(block: unknown, notionClient: Client): Promise<string> {
  if (!isTableBlock(block)) {
    return '';
  }

  const hasColumnHeader = block.table.has_column_header === true;
  const hasRowHeader = block.table.has_row_header === true;

  let rowBlocks: unknown[] | undefined = block.table_rows;

  if (!rowBlocks?.length && block.has_children) {
    const res = await notionClient.blocks.children.list({ block_id: block.id });
    rowBlocks = res.results;
  }

  const tableRows = (rowBlocks ?? []).filter(isTableRowBlock);

  if (tableRows.length === 0) {
    return '';
  }

  const parts: string[] = ['<div className="table-wrapper">', '<table>'];

  let bodyStart = 0;

  if (hasColumnHeader) {
    const headerRow = tableRows[0];
    parts.push('<thead><tr>');
    for (const cell of headerRow.table_row.cells) {
      parts.push(`<th scope="col">${richTextItemsToHtml(cell)}</th>`);
    }
    parts.push('</tr></thead>');
    bodyStart = 1;
  }

  parts.push('<tbody>');

  for (let r = bodyStart; r < tableRows.length; r++) {
    const row = tableRows[r];
    parts.push('<tr>');
    for (let c = 0; c < row.table_row.cells.length; c++) {
      const cell = row.table_row.cells[c];
      const useRowHeader = hasRowHeader && c === 0;
      if (useRowHeader) {
        parts.push(`<th scope="row">${richTextItemsToHtml(cell)}</th>`);
      } else {
        parts.push(`<td>${richTextItemsToHtml(cell)}</td>`);
      }
    }
    parts.push('</tr>');
  }

  parts.push('</tbody></table></div>');

  return `\n\n${parts.join('')}\n\n`;
}
