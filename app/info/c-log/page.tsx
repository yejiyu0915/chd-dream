'use client';

import React, { useState, useMemo } from 'react';
import { CLogItem } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';
import CLogTagFilter from './CLogTagFilter';
import CLogListDisplay from './CLogListDisplay';
import c from '@/app/info/c-log/CLogList.module.scss';

export default function CLogListPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allCLogData) {
      counts['전체보기'] = allCLogData.length; // '전체보기' 항목에 대한 총 개수
      allCLogData.forEach((item) => {
        item.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });
    }
    return counts;
  }, [allCLogData]);

  const availableTags = useMemo(() => {
    if (!allCLogData) return [];
    const tags = new Set<string>();
    allCLogData.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => {
      // 태그 개수를 기준으로 내림차순 정렬
      const countA = tagCounts[a] || 0;
      const countB = tagCounts[b] || 0;
      return countB - countA;
    });
  }, [allCLogData, tagCounts]); // tagCounts를 의존성 배열에 추가

  const filteredCLogData = useMemo(() => {
    if (!allCLogData) return [];
    if (!selectedTag) return allCLogData;
    return allCLogData.filter((item) => item.tags.includes(selectedTag));
  }, [allCLogData, selectedTag]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return (
    <section className={c.cLogListMain}>
      <div className={c.cLogListInner}>
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
