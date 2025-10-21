'use client';

import React, { useState, useEffect } from 'react';
import PageTitleSetter from '@/app/worship/components/PageTitleSetter';
import Spinner from '@/common/components/utils/Spinner';
import b from '@/app/worship/bulletin/Bulletin.module.scss';
import mdx from '@/common/styles/mdx/MdxContent.module.scss';

interface BulletinItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  praise: string;
  slug: string;
  content?: string; // 노션 본문 내용
  thumbnail?: string;
}

export default function BulletinPage() {
  const [bulletinList, setBulletinList] = useState<BulletinItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [latestBulletin, setLatestBulletin] = useState<BulletinItem | null>(null);
  const [selectedBulletin, setSelectedBulletin] = useState<BulletinItem | null>(null);
  const [bulletinContent, setBulletinContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const itemsPerPage = 6; // 2x3 그리드

  // 날짜 형식 변환 함수
  const formatDate = (dateString: string) => {
    // "2025.10.05 (2025년 10월 1주차)" 형식을 파싱
    const match = dateString.match(/^(\d{4}\.\d{2}\.\d{2})\s*\((.+)\)$/);
    if (match) {
      return {
        date: match[1],
        weekInfo: `(${match[2]})`,
      };
    }
    // 매치되지 않으면 원본 반환
    return {
      date: dateString,
      weekInfo: '',
    };
  };

  // 주보 데이터 가져오기
  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bulletin');
        const data = await response.json();

        // API 응답이 배열인 경우와 객체인 경우 모두 처리
        const items = Array.isArray(data) ? data : data.items || [];
        setBulletinList(items);
        setTotalPages(Math.ceil(items.length / itemsPerPage));

        // 최신 주보 설정 (첫 번째 아이템)
        if (items.length > 0) {
          setLatestBulletin(items[0]);
          // 최신 주보 내용 자동 로드
          handleBulletinClick(items[0]);
        }
      } catch {
        // console.error('주보 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBulletins();
  }, []);

  // 현재 페이지의 아이템들
  const currentItems = bulletinList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 주보 아이템 클릭 핸들러
  const handleBulletinClick = async (item: BulletinItem) => {
    setSelectedBulletin(item);
    setContentLoading(true);
    setLoadingStep('주보 데이터를 가져오는 중...');

    try {
      setLoadingStep('Notion에서 내용을 불러오는 중...');
      const response = await fetch(`/api/bulletin/${item.slug}`);
      const data = await response.json();

      if (data && data.blocks) {
        // 디버깅: 블록 구조 확인 (테이블과 중첩 리스트 확인용)
        const tableBlocks = data.blocks.filter((block: any) => block.type === 'table');
        const listBlocks = data.blocks.filter(
          (block: any) => block.type === 'bulleted_list_item' || block.type === 'numbered_list_item'
        );
        console.log('Table blocks found:', tableBlocks.length);
        console.log('List blocks found:', listBlocks.length);
        if (tableBlocks.length > 0) {
          console.log('Table structure:', JSON.stringify(tableBlocks[0], null, 2));
        }

        setLoadingStep('내용을 변환하는 중...');
        // 노션 블록을 MDX 형식의 HTML 문자열로 변환 (중첩 리스트 및 테이블 지원)
        const convertBlocksToMdxHtml = (blocks: unknown[]): string => {
          const result: string[] = [];
          let currentList: string[] = [];
          let currentListType: 'bulleted' | 'numbered' | null = null;

          // 텍스트 추출 헬퍼 함수
          const extractText = (richText: unknown) => {
            if (Array.isArray(richText)) {
              const result = richText
                .map((text: unknown) => {
                  const textObj = text as Record<string, unknown>;
                  return textObj.plain_text || '';
                })
                .join('');
              if (result === '') {
                console.log('Empty text extracted from:', JSON.stringify(richText, null, 2));
              }
              return result;
            }
            console.log('Non-array richText:', JSON.stringify(richText, null, 2));
            return '';
          };

          // 현재 리스트를 결과에 추가하는 함수
          const flushCurrentList = () => {
            if (currentList.length > 0) {
              const listTag = currentListType === 'numbered' ? 'ol' : 'ul';
              result.push(`<${listTag}>${currentList.join('')}</${listTag}>`);
              currentList = [];
              currentListType = null;
            }
          };

          // 중첩 리스트 처리를 위한 재귀 함수
          const renderChildren = (children: unknown[]): string => {
            if (!Array.isArray(children) || children.length === 0) return '';

            // console.log('Rendering children:', children.length, 'items');

            const childResult: string[] = [];
            let childList: string[] = [];
            let childListType: 'bulleted' | 'numbered' | null = null;

            const flushChildList = () => {
              if (childList.length > 0) {
                const listTag = childListType === 'numbered' ? 'ol' : 'ul';
                childResult.push(`<${listTag}>${childList.join('')}</${listTag}>`);
                childList = [];
                childListType = null;
              }
            };

            children.forEach((child: unknown) => {
              const childObj = child as Record<string, unknown>;

              if (
                childObj.type === 'bulleted_list_item' &&
                childObj.bulleted_list_item &&
                typeof childObj.bulleted_list_item === 'object'
              ) {
                if (childListType !== 'bulleted') {
                  flushChildList();
                  childListType = 'bulleted';
                }
                const listItem = childObj.bulleted_list_item as Record<string, unknown>;
                const text = extractText(listItem.rich_text);
                const grandchildren = Array.isArray(childObj.children)
                  ? renderChildren(childObj.children as unknown[])
                  : '';
                childList.push(`<li>${text}${grandchildren}</li>`);
              } else if (
                childObj.type === 'numbered_list_item' &&
                childObj.numbered_list_item &&
                typeof childObj.numbered_list_item === 'object'
              ) {
                if (childListType !== 'numbered') {
                  flushChildList();
                  childListType = 'numbered';
                }
                const listItem = childObj.numbered_list_item as Record<string, unknown>;
                const text = extractText(listItem.rich_text);
                const grandchildren = Array.isArray(childObj.children)
                  ? renderChildren(childObj.children as unknown[])
                  : '';
                childList.push(`<li>${text}${grandchildren}</li>`);
              }
            });

            flushChildList();
            return childResult.join('');
          };

          // 테이블 처리 함수
          const renderTable = (table: Record<string, unknown>): string => {
            console.log('Processing table:', JSON.stringify(table, null, 2));

            if (!table.table || typeof table.table !== 'object') {
              console.log('No table property found');
              return '';
            }

            const tableObj = table.table as Record<string, unknown>;
            const hasColumnHeader = tableObj.has_column_header === true;
            const hasRowHeader = tableObj.has_row_header === true;

            // table_rows가 별도로 가져와진 경우 사용
            const tableRows = table.table_rows || tableObj.table_rows;
            console.log('Table properties:', {
              hasColumnHeader,
              hasRowHeader,
              tableRows: tableRows,
            });

            // 테이블 행 구조 확인
            if (tableRows.length > 0) {
              console.log('First table row structure:', JSON.stringify(tableRows[0], null, 2));
            }

            if (!Array.isArray(tableRows) || tableRows.length === 0) {
              console.log('No table rows found');
              return '';
            }

            let tableHtml = '<table>';

            // 테이블 헤더 처리
            if (hasColumnHeader && tableRows.length > 0) {
              const headerRow = tableRows[0] as Record<string, unknown>;
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
            for (let i = startRow; i < tableRows.length; i++) {
              const row = tableRows[i] as Record<string, unknown>;
              if (row.table_row && typeof row.table_row === 'object') {
                const rowObj = row.table_row as Record<string, unknown>;
                if (Array.isArray(rowObj.cells)) {
                  tableHtml += '<tr>';
                  rowObj.cells.forEach((cell: unknown, cellIndex: number) => {
                    const cellObj = cell as Record<string, unknown>;
                    console.log(`Cell ${cellIndex} structure:`, JSON.stringify(cellObj, null, 2));

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

            console.log('Generated table HTML:', tableHtml);
            return tableHtml;
          };

          blocks.forEach((block: unknown) => {
            const blockObj = block as Record<string, unknown>;

            if (
              blockObj.type === 'paragraph' &&
              blockObj.paragraph &&
              typeof blockObj.paragraph === 'object'
            ) {
              flushCurrentList();
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
              flushCurrentList();
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
              flushCurrentList();
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
              flushCurrentList();
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
                flushCurrentList();
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
                flushCurrentList();
                currentListType = 'numbered';
              }
              const listItem = blockObj.numbered_list_item as Record<string, unknown>;
              const text = extractText(listItem.rich_text);
              const children = Array.isArray(blockObj.children)
                ? renderChildren(blockObj.children as unknown[])
                : '';
              currentList.push(`<li>${text}${children}</li>`);
            } else if (
              blockObj.type === 'table' &&
              blockObj.table &&
              typeof blockObj.table === 'object'
            ) {
              flushCurrentList();
              const tableHtml = renderTable(blockObj);
              if (tableHtml) {
                result.push(tableHtml);
              }
            }
          });

          // 마지막 리스트 플러시
          flushCurrentList();

          return result.join('');
        };

        const mdxHtml = convertBlocksToMdxHtml(data.blocks);

        // HTML 태그 매핑 (h1→h2, h2→h3, h3→h4)
        // 순서 중요: 뒤에서부터 치환해야 함
        const processedHtml = mdxHtml
          .replace(/<h3>/g, '<h5>')
          .replace(/<\/h3>/g, '</h5>')
          .replace(/<h2>/g, '<h4>')
          .replace(/<\/h2>/g, '</h4>')
          .replace(/<h1>/g, '<h3>')
          .replace(/<\/h1>/g, '</h3>');

        setLoadingStep('완료!');
        setBulletinContent(processedHtml);
      }
    } catch {
      // console.error('주보 내용을 가져오는데 실패했습니다:', error);
      setBulletinContent('내용을 불러올 수 없습니다.');
    } finally {
      setContentLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <>
      <PageTitleSetter title="온라인 주보" />
      <div className="detail-inner">
        <div className={b.inner}>
          <div className={b.content}>
            {(selectedBulletin || latestBulletin) &&
              (() => {
                const displayBulletin = selectedBulletin || latestBulletin;
                const formattedDate = formatDate(displayBulletin.date);
                return (
                  <div className={b.latest}>
                    <div className={b.latest__title}>
                      <span className={b.latest__dateMain}>{formattedDate.date}</span>
                      {formattedDate.weekInfo && (
                        <span className={b.latest__dateWeek}>{formattedDate.weekInfo}</span>
                      )}
                    </div>
                    <h2 className={b.latest__titleText}>주일 오전 예배</h2>
                    <h3 className={b.latest__bulletinTitle}>{displayBulletin.title}</h3>

                    <div className={b.latest__sections}>
                      <div className={b.latest__section}>
                        <p className={b.latest__sectionTitle}>본문 말씀:</p>
                        <p className={b.latest__summary}>{displayBulletin.summary}</p>
                      </div>

                      <div className={b.latest__section}>
                        <p className={b.latest__sectionTitle}>해피니스 찬양대:</p>
                        <p className={b.latest__praise}>{displayBulletin.praise}</p>
                      </div>
                    </div>

                    {/* 선택된 주보의 본문 내용 */}
                    {selectedBulletin && (
                      <div className={b.latest__content}>
                        <h2 className={b.latest__contentTitle}>
                          {selectedBulletin.slug === latestBulletin.slug
                            ? '이번 주 주보'
                            : '주보 내용'}
                        </h2>
                        {contentLoading ? (
                          <div className={b.latest__contentLoading}>
                            <Spinner />
                            <span>{loadingStep || '내용을 불러오는 중...'}</span>
                          </div>
                        ) : (
                          <div className={`${mdx.mdxContent} ${b.latest__contentBody}`}>
                            <div dangerouslySetInnerHTML={{ __html: bulletinContent }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
          </div>

          <div className={b.items}>
            {loading ? (
              <div className={b.loading}>
                <Spinner />
                <span>로딩 중...</span>
              </div>
            ) : (
              <>
                <ul className={b.items__list}>
                  {currentItems.map((item) => {
                    const formattedDate = formatDate(item.date);
                    return (
                      <li
                        key={item.id}
                        className={`${b.items__item} ${selectedBulletin?.id === item.id ? b.items__itemActive : ''}`}
                        onClick={() => handleBulletinClick(item)}
                      >
                        <div className={b.item__info}>
                          <div className={b.item__date}>
                            <span className={b.item__dateMain}>{formattedDate.date}</span>
                            {formattedDate.weekInfo && (
                              <span className={b.item__dateWeek}>{formattedDate.weekInfo}</span>
                            )}
                          </div>
                          <h3 className={b.item__title}>{item.title}</h3>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {totalPages > 1 && (
                  <div className={b.items__controls}>
                    <button
                      className={b.control__prev}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>

                    <div className={b.control__pages}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`${b.control__page} ${currentPage === page ? b.control__pageActive : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className={b.control__next}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
