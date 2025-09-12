'use client';

import React, { useState, useMemo } from 'react';
import { CLogItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';
import CLogTagFilter from './CLogTagFilter';
import CLogListDisplay from './CLogListDisplay';
import CLogCategoryFilter from './CLogCategoryFilter'; // CLogCategoryFilter 컴포넌트 임포트
import c from '@/app/info/c-log/CLogList.module.scss';

export default function CLogListPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 선택된 카테고리 상태 추가

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

    return filteredByCategory;
  }, [allCLogData, selectedTag, selectedCategory]); // selectedCategory 의존성 추가

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

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleCategorySelect = (category: string | null) => {
    // 카테고리 선택 핸들러 추가
    setSelectedCategory(category);
    setSelectedTag(null); // 카테고리가 변경되면 태그 선택 초기화
  };

  return (
    <section className={c.cLogListMain}>
      <div className={c.cLogListInner}>
        <CLogCategoryFilter // CLogCategoryFilter 컴포넌트 추가
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          // categoryCounts={categoryCounts} // 개수 표기 제거로 인한 prop 삭제
        />
        <CLogTagFilter
          tags={availableTags}
          selectedTag={selectedTag}
          onSelectTag={handleTagSelect}
          tagCounts={tagCounts}
        />
        <CLogListDisplay
          cLogData={filteredCLogData}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </section>
  );
}
