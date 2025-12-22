'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CLogItem } from '@/lib/notion';
import CLogTagFilter from '@/app/info/c-log/components/CLogTagFilter';
import CLogListDisplay from '@/app/info/c-log/components/CLogListDisplay';
import CLogCategoryFilter from '@/app/info/c-log/components/CLogCategoryFilter';
import CLogSortFilter from '@/app/info/c-log/components/CLogSortFilter';
import CLogViewModeFilter from '@/app/info/c-log/components/CLogViewModeFilter';
import c from '@/app/info/c-log/CLogList.module.scss';
import { useRouter } from 'next/navigation';

interface CLogListClientProps {
  initialCLogData: CLogItem[];
  searchParams: { category?: string; tag?: string; sort?: string; view?: string };
}

export default function CLogListClient({ initialCLogData, searchParams }: CLogListClientProps) {
  const router = useRouter();

  // 서버에서 받은 데이터를 그대로 사용 (useQuery 제거)
  const allCLogData = initialCLogData;

  // 초기 데이터 존재 여부 확인
  const hasInitialData = !!initialCLogData && initialCLogData.length > 0;

  // 데이터가 아직 로드되지 않았는지 확인 (undefined인 경우만 로딩으로 간주)
  // 빈 배열([])은 데이터가 로드되었지만 결과가 없는 것으로 간주
  const isInitialLoading = initialCLogData === undefined;

  // State 초기값은 고정값으로 설정 (Hydration 에러 방지)
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 초기 마운트 시 URL 파라미터로 상태 초기화
  useEffect(() => {
    const initialCategory = searchParams.category
      ? decodeURIComponent(searchParams.category)
      : null;
    const initialTag = searchParams.tag ? decodeURIComponent(searchParams.tag) : null;
    const initialSortOrder: 'asc' | 'desc' = (searchParams.sort as 'asc' | 'desc') || 'desc';
    const initialViewMode: 'grid' | 'list' = (searchParams.view as 'grid' | 'list') || 'grid';

    setSelectedCategory(initialCategory);
    setSelectedTag(initialTag);
    setSortOrder(initialSortOrder);
    setViewMode(initialViewMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 초기 마운트 시에만 실행

  // URL 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    const currentCategory = searchParams.category
      ? decodeURIComponent(searchParams.category)
      : null;
    const currentTag = searchParams.tag ? decodeURIComponent(searchParams.tag) : null;
    const currentSortOrder: 'asc' | 'desc' = (searchParams.sort as 'asc' | 'desc') || 'desc';
    const currentViewMode: 'grid' | 'list' = (searchParams.view as 'grid' | 'list') || 'grid';

    setSelectedCategory((prev) => (prev !== currentCategory ? currentCategory : prev));
    setSelectedTag((prev) => (prev !== currentTag ? currentTag : prev));
    setSortOrder((prev) => (prev !== currentSortOrder ? currentSortOrder : prev));
    setViewMode((prev) => (prev !== currentViewMode ? currentViewMode : prev));
  }, [searchParams]);

  // 카테고리 개수 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allCLogData) {
      counts['전체보기'] = allCLogData.length;
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

    let filteredByTag: CLogItem[] = allCLogData;
    if (selectedTag) {
      filteredByTag = allCLogData.filter((item: CLogItem) => item.tags.includes(selectedTag));
    }

    let filteredByCategory: CLogItem[] = filteredByTag;
    if (selectedCategory) {
      filteredByCategory = filteredByTag.filter(
        (item: CLogItem) => item.category === selectedCategory
      );
    }

    let finalFilteredData: CLogItem[] = filteredByCategory;

    // 정렬 로직 적용
    finalFilteredData = [...finalFilteredData].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return finalFilteredData;
  }, [allCLogData, selectedTag, selectedCategory, sortOrder]);

  // 카테고리에 따라 동적으로 태그 목록과 개수 재계산
  const dataForTags = useMemo(() => {
    if (!allCLogData) return [];
    // 선택된 카테고리가 있다면 해당 카테고리로 필터링된 데이터를 사용하고,
    // 없으면 전체 데이터를 사용합니다.
    return selectedCategory
      ? allCLogData.filter((item: CLogItem) => item.category === selectedCategory)
      : allCLogData;
  }, [allCLogData, selectedCategory]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (dataForTags) {
      // '전체보기' 항목에 대한 총 개수
      counts['전체보기'] = dataForTags.length;
      dataForTags.forEach((item: CLogItem) => {
        item.tags.forEach((tag: string) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });
    }
    return counts;
  }, [dataForTags]);

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
  }, [dataForTags, tagCounts]);

  const updateURLParams = (params: Record<string, string | null>) => {
    // 현재 searchParams를 URLSearchParams로 변환
    const newSearchParams = new URLSearchParams();

    // 기존 파라미터 추가 (객체에서 직접 가져오기)
    if (searchParams.category) {
      newSearchParams.set('category', searchParams.category);
    }
    if (searchParams.tag) {
      newSearchParams.set('tag', searchParams.tag);
    }
    if (searchParams.sort) {
      newSearchParams.set('sort', searchParams.sort);
    }
    if (searchParams.view) {
      newSearchParams.set('view', searchParams.view);
    }

    // 새로운 파라미터로 업데이트
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
          <CLogSortFilter sortOrder={sortOrder} onSortChange={handleSortChange} />
          <CLogViewModeFilter viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
        <CLogListDisplay
          cLogData={filteredCLogData}
          isLoading={isInitialLoading}
          isError={false}
          error={null}
          viewMode={viewMode}
          hasInitialData={hasInitialData}
          hasAllData={hasInitialData} // 전체 데이터 존재 여부
        />
      </div>
    </section>
  );
}
