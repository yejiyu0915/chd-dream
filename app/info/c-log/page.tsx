'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CLogItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';
import CLogTagFilter from './CLogTagFilter';
import CLogListDisplay from './CLogListDisplay';
import CLogCategoryFilter from './CLogCategoryFilter'; // CLogCategoryFilter 컴포넌트 임포트
import CLogSortFilter from './CLogSortFilter'; // CLogSortFilter 컴포넌트 임포트
import CLogViewModeFilter from './CLogViewModeFilter'; // CLogViewModeFilter 컴포넌트 임포트
import c from '@/app/info/c-log/CLogList.module.scss';
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter와 useSearchParams 임포트

export default function CLogListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    staleTime: 0, // 데이터가 항상 stale 상태로 간주되어 매번 최신 데이터를 가져옴
    onError: (err) => {
      console.error('C-log 데이터 fetch 중 오류 발생:', err);
    },
  });

  // 카테고리 개수 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allCLogData) {
      counts['전체보기'] = allCLogData.length; // '전체보기' 항목에 대한 총 개수
      allCLogData.forEach((item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
    }
    return counts;
  }, [allCLogData]);

  // 사용 가능한 카테고리 목록 (개수 내림차순 정렬)
  const availableCategories = useMemo(() => {
    if (!allCLogData) return [];
    const categories = new Set<string>();
    allCLogData.forEach((item) => categories.add(item.category));
    return Array.from(categories).sort((a, b) => {
      const countA = categoryCounts[a] || 0;
      const countB = categoryCounts[b] || 0;
      return countB - countA;
    });
  }, [allCLogData, categoryCounts]);

  const filteredCLogData = useMemo(() => {
    if (!allCLogData) return [];

    let filteredByTag = allCLogData;
    if (selectedTag) {
      filteredByTag = allCLogData.filter((item) => item.tags.includes(selectedTag));
    }

    let filteredByCategory = filteredByTag;
    if (selectedCategory) {
      filteredByCategory = filteredByTag.filter((item) => item.category === selectedCategory);
    }

    let finalFilteredData = filteredByCategory;

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
      ? allCLogData.filter((item) => item.category === selectedCategory)
      : allCLogData;
  }, [allCLogData, selectedCategory]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (dataForTags) {
      counts['전체보기'] = dataForTags.length; // '전체보기' 항목에 대한 총 개수
      dataForTags.forEach((item) => {
        item.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });
    }
    return counts;
  }, [dataForTags]); // dataForTags를 의존성 배열에 추가

  const availableTags = useMemo(() => {
    if (!dataForTags) return [];
    const tags = new Set<string>();
    dataForTags.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
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
