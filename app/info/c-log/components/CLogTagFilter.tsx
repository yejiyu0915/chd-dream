'use client';

import React, { useRef, useState, useEffect } from 'react'; // useRef, useState, useEffect 임포트
import c from '@/app/info/c-log/CLogList.module.scss';
import Icon from '@/common/components/utils/Icons'; // Icon 컴포넌트 임포트

interface CLogTagFilterProps {
  tags: string[];
  selectedTag: string | null;

  onSelectTag: (tag: string | null) => void;
  tagCounts: Record<string, number>;
}

// 모바일에서 태그 목록의 한 줄 높이를 추정 (폰트 크기, 패딩 등을 고려하여 조정 필요)

export default function CLogTagFilter({
  tags,
  selectedTag,
  onSelectTag,
  tagCounts,
}: CLogTagFilterProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (listRef.current) {
      // 모바일 환경에서만 작동하도록 체크
      const isMobile = window.innerWidth <= 768; // 768px을 모바일 기준으로 가정
      if (isMobile) {
        const currentHeight = listRef.current.scrollHeight;
        // 대략적인 한 줄 높이 (폰트 크기, 라인 높이, 패딩 등을 고려)
        // 여기서는 임시로 MOBILE_TAG_LINE_HEIGHT를 사용합니다.
        if (currentHeight > 40 * 1.5) {
          // SCSS에서 vw(40) 사용하므로 직접 값 지정
          // 1.5배 이상이면 버튼 표시
          setShowToggleButton(true);
          // 초기 로드 시 `is-collapsed` 클래스를 적용하여 한 줄만 보이도록
        } else {
          setShowToggleButton(false);
          setIsExpanded(false); // 버튼이 없으면 항상 축소 상태 해제
        }
      } else {
        setShowToggleButton(false);
        setIsExpanded(false); // PC에서는 확장/축소 기능 비활성화
      }
    }
  }, [tags, isExpanded]); // tags가 변경되거나 isExpanded가 변경될 때 재측정

  return (
    <div className={`${c.tagFilter} detail-inner`}>
      <div className={c.tagFilter__expandableContainer}>
        {' '}
        {/* 확장/축소 컨테이너 */}
        <ul
          ref={listRef}
          className={`${c.tagFilter__list} ${showToggleButton && !isExpanded ? c['is-collapsed'] : ''} ${showToggleButton && isExpanded ? c['is-expanded'] : ''}`}
        >
          <li className={c.tagFilter__item}>
            <button
              type="button"
              onClick={() => onSelectTag(null)}
              className={`${c.tagFilter__button} ${!selectedTag ? c.active : ''}`}
            >
              ALL TAG <span className={c.tagFilter__count}>({tagCounts['전체보기'] || 0})</span>
            </button>
          </li>
          {tags.map((tag) => (
            <li key={tag} className={c.tagFilter__item}>
              <button
                type="button"
                onClick={() => onSelectTag(tag)}
                className={`${c.tagFilter__button} ${selectedTag === tag ? c.active : ''}`}
              >
                # {tag} <span className={c.tagFilter__count}>({tagCounts[tag] || 0})</span>
              </button>
            </li>
          ))}
        </ul>
        {/* {showToggleButton && !isExpanded && <div className={c.tagFilter__fadeOverlay}></div>} 페이드 오버레이 */}
        {showToggleButton && (
          <button
            type="button"
            onClick={handleToggleExpand}
            className={c.tagFilter__toggleButton}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? '태그 목록 접기' : '태그 목록 펼치기'}
          >
            <Icon name={isExpanded ? 'arrow-up' : 'arrow-down'} size="md" />
          </button>
        )}
      </div>
    </div>
  );
}
