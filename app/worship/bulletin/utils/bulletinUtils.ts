// 날짜 형식 변환 함수
export const formatDate = (dateString: string) => {
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

// 텍스트 추출 헬퍼 함수
export const extractText = (richText: unknown) => {
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
export const flushCurrentList = (
  currentList: string[],
  currentListType: 'bulleted' | 'numbered' | null,
  result: string[]
) => {
  if (currentList.length > 0) {
    const listTag = currentListType === 'numbered' ? 'ol' : 'ul';
    result.push(`<${listTag}>${currentList.join('')}</${listTag}>`);
  }
};

// 중첩 리스트 처리를 위한 재귀 함수
export const renderChildren = (children: unknown[]): string => {
  if (!Array.isArray(children) || children.length === 0) return '';

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
