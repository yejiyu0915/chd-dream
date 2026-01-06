import React, { useRef, useState, useEffect, useCallback } from 'react';
import c from '@/app/info/c-log/CLogList.module.scss'; // 동일한 SCSS 모듈 사용
import Icon from '@/common/components/utils/Icons'; // Icon 컴포넌트 임포트

interface CLogCategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// 요소가 컨테이너 내의 시작 부분에 정렬되어 있는지 확인하는 헬퍼 함수 (허용 오차 포함)
const isElementAlignedToStart = (element: HTMLElement, container: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const tolerance = 1; // 픽셀 단위 허용 오차

  return Math.abs(elementRect.left - containerRect.left) <= tolerance;
};

export default function CLogCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CLogCategoryFilterProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  // const lastItemRef = useRef<HTMLLIElement>(null); // 마지막 항목을 위한 ref
  const [showRightArrow, setShowRightArrow] = useState(false);
  // const [isLastItemVisible, setIsLastItemVisible] = useState(false); // 마지막 항목 가시성 상태

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
      const isScrollable = scrollWidth > clientWidth; // 스크롤 가능 여부
      // 스크롤바가 끝까지 도달했는지 확인
      const atEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) < 1; // 1px 미만의 오차 허용

      // 스크롤 가능하며 끝에 도달하지 않았을 때만 화살표를 표시
      setShowRightArrow(isScrollable && !atEnd);
    }
  }, []); // isLastItemVisible 의존성 제거

  useEffect(() => {
    checkScrollPosition();
    const currentScrollRef = scrollRef.current;
    currentScrollRef?.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    // Intersection Observer 관련 로직 제거
    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     entries.forEach((entry) => {
    //       setIsLastItemVisible(entry.isIntersecting);
    //     });
    //   },
    //   {
    //     root: scrollRef.current, // 스크롤 컨테이너를 root로 설정
    //     rootMargin: '0px',
    //     threshold: 0.1, // 10% 이상 보이면 감지
    //   }
    // );

    // const currentLastItemRef = lastItemRef.current;
    // if (currentLastItemRef) {
    //   observer.observe(currentLastItemRef);
    // }

    return () => {
      currentScrollRef?.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
      // if (currentLastItemRef) {
      //   observer.unobserve(currentLastItemRef);
      // }
    };
  }, [checkScrollPosition, categories]);

  // 마지막 항목 가시성 변경 시 화살표 상태 재확인 로직 제거
  // useEffect(() => {
  //   checkScrollPosition();
  // }, [isLastItemVisible, checkScrollPosition]);

  // 활성화된 카테고리를 맨 왼쪽으로 스크롤
  useEffect(() => {
    // DOM 업데이트 후 실행되도록 requestAnimationFrame 사용
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        // selectedCategory가 null이면 "전체보기" 버튼을 찾고, 있으면 해당 카테고리 버튼을 찾음
        const activeCategoryElement = scrollRef.current.querySelector(`button.${c.active}`);
        if (activeCategoryElement) {
          // 정렬 여부와 관계없이 항상 스크롤 (ALL 선택 시에도 확실히 이동)
          activeCategoryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
          });
        }
      }
    });
  }, [selectedCategory, categories]);

  const handleScroll = () => {
    // direction 인자 제거
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2; // 절반만 스크롤
      scrollRef.current.scrollBy({
        left: scrollAmount, // 오른쪽으로만 스크롤
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`${c.categoryFilter} detail-inner`}>
      <div className={c.categoryFilter__wrapper}>
        {' '}
        {/* 그라데이션과 화살표를 위한 래퍼 */}
        <ul ref={scrollRef} className={c.categoryFilter__list}>
          <li className={c.categoryFilter__item}>
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`${c.categoryFilter__button} ${!selectedCategory ? c.active : ''}`}
            >
              ALL
            </button>
          </li>
          {categories.map(
            (
              category,
              _index // index를 _index로 변경
            ) => (
              <li
                key={category}
                className={c.categoryFilter__item}
                // ref={index === categories.length - 1 ? lastItemRef : null} // 마지막 항목에 ref 할당 제거
              >
                <button
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`${c.categoryFilter__button} ${selectedCategory === category ? c.active : ''}`}
                >
                  {category}
                </button>
              </li>
            )
          )}
        </ul>
        {showRightArrow && (
          <button
            type="button"
            className={`${c.categoryFilter__arrow} ${c['categoryFilter__arrow--right']}`}
            onClick={handleScroll}
            aria-label="다음 카테고리"
          >
            <Icon name="arrow-next" size="lg" />
          </button>
        )}
        {showRightArrow && <div className={c.categoryFilter__gradient}></div>}
      </div>
    </div>
  );
}
