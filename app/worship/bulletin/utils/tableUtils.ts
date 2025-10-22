import { extractText } from '@/app/worship/bulletin/utils/bulletinUtils';

// 테이블 처리 함수
export const renderTable = (table: Record<string, unknown>): string => {
  if (!table.table || typeof table.table !== 'object') {
    return '';
  }

  const tableObj = table.table as Record<string, unknown>;
  const hasColumnHeader = tableObj.has_column_header === true;
  const hasRowHeader = tableObj.has_row_header === true;

  // table_rows가 별도로 가져와진 경우 사용
  const tableRows = (table.table_rows || tableObj.table_rows) as unknown[];

  if (!Array.isArray(tableRows) || (tableRows as unknown[]).length === 0) {
    return '';
  }

  let tableHtml = '<table>';

  // 테이블 헤더 처리
  if (hasColumnHeader && (tableRows as unknown[]).length > 0) {
    const headerRow = (tableRows as unknown[])[0] as Record<string, unknown>;
    if (headerRow.table_row && typeof headerRow.table_row === 'object') {
      const rowObj = headerRow.table_row as Record<string, unknown>;
      if (Array.isArray(rowObj.cells)) {
        tableHtml += '<thead><tr>';
        rowObj.cells.forEach((cell: unknown) => {
          const cellObj = cell as Record<string, unknown>;
          const cellText = extractText(cellObj.rich_text);
          tableHtml += `<th>${cellText}</th>`;
        });
        tableHtml += '</tr></thead>';
      }
    }
  }

  // 테이블 바디 처리
  tableHtml += '<tbody>';
  const startRow = hasColumnHeader ? 1 : 0;
  for (let i = startRow; i < (tableRows as unknown[]).length; i++) {
    const row = (tableRows as unknown[])[i] as Record<string, unknown>;
    if (row.table_row && typeof row.table_row === 'object') {
      const rowObj = row.table_row as Record<string, unknown>;
      if (Array.isArray(rowObj.cells)) {
        tableHtml += '<tr>';
        rowObj.cells.forEach((cell: unknown, cellIndex: number) => {
          const cellObj = cell as Record<string, unknown>;

          // 셀이 배열인 경우 직접 처리
          let cellText = '';
          if (Array.isArray(cellObj)) {
            cellText = cellObj
              .map((textItem: unknown) => {
                const textObj = textItem as Record<string, unknown>;
                return textObj.plain_text || '';
              })
              .join('');
          } else {
            // 기존 방식 (rich_text 속성 사용)
            cellText = extractText(cellObj.rich_text);
          }

          const cellTag = hasRowHeader && cellIndex === 0 ? 'th' : 'td';
          tableHtml += `<${cellTag}>${cellText}</${cellTag}>`;
        });
        tableHtml += '</tr>';
      }
    }
  }
  tableHtml += '</tbody></table>';

  return tableHtml;
};
