'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CLogItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';
import CLogTagFilter from '@/app/info/c-log/components/CLogTagFilter'; // 경로 변경
import CLogListDisplay from '@/app/info/c-log/components/CLogListDisplay'; // 경로 변경
import CLogCategoryFilter from '@/app/info/c-log/components/CLogCategoryFilter'; // CLogCategoryFilter 컴포넌트 임포트 (경로 변경)
import CLogSortFilter from '@/app/info/c-log/components/CLogSortFilter'; // CLogSortFilter 컴포넌트 임포트 (경로 변경)
import CLogViewModeFilter from '@/app/info/c-log/components/CLogViewModeFilter'; // CLogViewModeFilter 컴포넌트 임포트 (경로 변경)
import c from '@/app/info/c-log/CLogList.module.scss';
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter와 useSearchParams 임포트
import { usePageTitle } from '@/app/info/utils/title-context'; // usePageTitle 훅 임포트 (경로 변경 반영)
// import Lenis from '@studio-freight/lenis'; // Lenis 타입 임포트 (window.lenis 사용을 위해)

// declare global {
//   interface Window {
//     lenis?: Lenis | null; // Lenis 인스턴스를 window 객체에 접근 가능하도록 선언 (null도 허용)
//   }
// }

export default function CLogListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPageTitle } = usePageTitle(); // setPageTitle 함수 가져오기

  // 페이지 제목 설정
  useEffect(() => {
    setPageTitle('C-Log'); // C-Log 리스트 페이지 제목 설정
    // 페이지 마운트 시 스크롤을 최상단으로 이동 (0.3초 딜레이 추가)
    const timer = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        window.lenis &&
        typeof window.lenis.scrollTo === 'function'
      ) {
        window.lenis.scrollTo(0, { duration: 0.7 }); // Lenis 스크롤 사용 (부드러운 이동을 위해 duration 0.7초로 조정)
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 일반 스크롤 사용 시 부드럽게 이동
      }
    }, 300); // 0.3초 (300ms) 딜레이

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [setPageTitle]);

  // URL 파라미터에서 초기 상태 설정
  const initialCategory = searchParams.get('category')
    ? decodeURIComponent(searchParams.get('category') as string)
    : null;
  const initialTag = searchParams.get('tag')
    ? decodeURIComponent(searchParams.get('tag') as string)
    : null;
  const initialSortOrder: 'asc' | 'desc' = (searchParams.get('sort') as 'asc' | 'desc') || 'desc';
  const initialViewMode: 'grid' | 'list' = (searchParams.get('view') as 'grid' | 'list') || 'grid';

  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  // URL 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    const currentCategory = searchParams.get('category')
      ? decodeURIComponent(searchParams.get('category') as string)
      : null;
    const currentTag = searchParams.get('tag')
      ? decodeURIComponent(searchParams.get('tag') as string)
      : null;
    const currentSortOrder: 'asc' | 'desc' = (searchParams.get('sort') as 'asc' | 'desc') || 'desc';
    const currentViewMode: 'grid' | 'list' =
      (searchParams.get('view') as 'grid' | 'list') || 'grid';

    setSelectedCategory((prev) => (prev !== currentCategory ? currentCategory : prev));
    setSelectedTag((prev) => (prev !== currentTag ? currentTag : prev));
    setSortOrder((prev) => (prev !== currentSortOrder ? currentSortOrder : prev));
    setViewMode((prev) => (prev !== currentViewMode ? currentViewMode : prev));
  }, [searchParams]);

  const fetchCLogItems = async (): Promise<CLogItem[]> => {
    const response = await fetch('/api/c-log');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const {
    data: allCLogData,
    isLoading,
    isError,
    error,
  } = useQuery<CLogItem[], Error>({
    queryKey: ['cLogListItems'],
    queryFn: fetchCLogItems,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시된 데이터 사용
    // onError는 useQuery의 옵션이 아니므로 제거합니다. 에러는 isError와 error 반환 값으로 처리합니다.
    // onError: (_err) => {
    //   // console.error('C-log 데이터 fetch 중 오류 발생:', _err);
    // },
  });

  // 카테고리 개수 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allCLogData) {
      counts['전체보기'] = allCLogData.length; // '전체보기' 항목에 대한 총 개수
      allCLogData.forEach((item: CLogItem) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
    }
    return counts;
  }, [allCLogData]);

  // 사용 가능한 카테고리 목록 (개수 내림차순 정렬)
  const availableCategories = useMemo(() => {
    if (!allCLogData) return [];
    const categories = new Set<string>();
    allCLogData.forEach((item: CLogItem) => categories.add(item.category));
    return Array.from(categories).sort((a, b) => {
      const countA = categoryCounts[a] || 0;
      const countB = categoryCounts[b] || 0;
      return countB - countA;
    });
  }, [allCLogData, categoryCounts]);

  const filteredCLogData = useMemo(() => {
    if (!allCLogData) return [];

    let filteredByTag: CLogItem[] = allCLogData; // 명시적으로 CLogItem[] 타입 지정
    if (selectedTag) {
      filteredByTag = allCLogData.filter((item: CLogItem) => item.tags.includes(selectedTag));
    }

    let filteredByCategory: CLogItem[] = filteredByTag; // 명시적으로 CLogItem[] 타입 지정
    if (selectedCategory) {
      filteredByCategory = filteredByTag.filter(
        (item: CLogItem) => item.category === selectedCategory
      );
    }

    let finalFilteredData: CLogItem[] = filteredByCategory; // 명시적으로 CLogItem[] 타입 지정

    // 정렬 로직 적용
    finalFilteredData = [...finalFilteredData].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return finalFilteredData;
  }, [allCLogData, selectedTag, selectedCategory, sortOrder]); // sortOrder 의존성 추가

  // 카테고리에 따라 동적으로 태그 목록과 개수 재계산
  const dataForTags = useMemo(() => {
    if (!allCLogData) return [];
    // 선택된 카테고리가 있다면 해당 카테고리로 필터링된 데이터를 사용하고,
    // 없으면 전체 데이터를 사용합니다.
    return selectedCategory
      ? allCLogData.filter((item: CLogItem) => item.category === selectedCategory)
      : allCLogData; // 명시적으로 CLogItem[] 타입 지정
  }, [allCLogData, selectedCategory]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (dataForTags) {
      // '전체보기' 항목에 대한 총 개수
      counts['전체보기'] = dataForTags.length; // dataForTags는 이미 CLogItem[] 또는 undefined
      dataForTags.forEach((item: CLogItem) => {
        item.tags.forEach((tag: string) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });
    }
    return counts;
  }, [dataForTags]); // dataForTags를 의존성 배열에 추가

  const availableTags = useMemo(() => {
    if (!dataForTags) return [];
    const tags = new Set<string>();
    dataForTags.forEach((item: CLogItem) => {
      item.tags.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => {
      // 태그 개수를 기준으로 내림차순 정렬
      const countA = tagCounts[a] || 0;
      const countB = tagCounts[b] || 0;
      return countB - countA;
    });
  }, [dataForTags, tagCounts]); // dataForTags와 tagCounts를 의존성 배열에 추가

  const updateURLParams = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, encodeURIComponent(value));
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleTagSelect = (tag: string | null) => {
    updateURLParams({ tag: tag });
  };

  const handleCategorySelect = (category: string | null) => {
    updateURLParams({ category: category, tag: null }); // 카테고리 변경 시 태그 초기화
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    updateURLParams({ sort: order });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    updateURLParams({ view: mode });
  };

  return (
    <section className={c.cLogListMain}>
      <div className={c.cLogListInner}>
        <CLogCategoryFilter
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <CLogTagFilter
          tags={availableTags}
          selectedTag={selectedTag}
          onSelectTag={handleTagSelect}
          tagCounts={tagCounts}
        />
        <div className={`${c.filterGroup} detail-inner`}>
          {' '}
          {/* 새로운 필터 그룹 컨테이너 */}
          <CLogSortFilter sortOrder={sortOrder} onSortChange={handleSortChange} />
          <CLogViewModeFilter viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
        <CLogListDisplay
          cLogData={filteredCLogData}
          isLoading={isLoading}
          isError={isError}
          error={error}
          viewMode={viewMode} // viewMode prop 전달
        />
      </div>
    </section>
  );
}
