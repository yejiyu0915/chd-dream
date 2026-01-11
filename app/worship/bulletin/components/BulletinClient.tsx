'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BulletinList from '@/app/worship/bulletin/components/BulletinList';
import BulletinContent from '@/app/worship/bulletin/components/BulletinContent';
import Spinner from '@/common/components/utils/Spinner';
import { formatDate } from '@/app/worship/bulletin/utils/bulletinUtils';
import {
  convertBlocksToMdxHtml,
  processHtmlTags,
} from '@/app/worship/bulletin/utils/htmlConverter';
import b from '@/app/worship/bulletin/Bulletin.module.scss';

interface BulletinItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  praise: string;
  slug: string;
  content?: string;
  thumbnail?: string;
}

interface BulletinClientProps {
  initialBulletinList: BulletinItem[];
  contentParam: string | null;
}

// URL 파라미터 → 날짜
const paramToDate = (param: string): string => {
  const match = param.match(/^(\d{4})(\d{2})(\d{2})/);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : '';
};

// 날짜 인덱스 추출
const extractDateIndex = (param: string): number => {
  const match = param.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
};

export default function BulletinClient({
  initialBulletinList,
  contentParam,
}: BulletinClientProps) {
  const router = useRouter();
  const bulletinList = initialBulletinList ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBulletin, setSelectedBulletin] = useState<BulletinItem | null>(null);
  const [bulletinContent, setBulletinContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const [tempYear, setTempYear] = useState('all');
  const [tempMonth, setTempMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const itemsPerPage = 6;
  const lastProcessedParam = useRef<string | null>(null);

  /* ----------------------------------------
   * URL 파라미터 매핑
   * -------------------------------------- */
  const bulletinParamMap = useMemo(() => {
    const map = new Map<string, string>();
    const dateGroups = new Map<string, BulletinItem[]>();

    bulletinList.forEach((item) => {
      const date = item.date.substring(0, 10);
      if (!dateGroups.has(date)) dateGroups.set(date, []);
      dateGroups.get(date)!.push(item);
    });

    dateGroups.forEach((items, date) => {
      const base = date.replace(/\./g, '');
      items.forEach((item, idx) => {
        map.set(item.id, items.length === 1 ? base : `${base}-${idx + 1}`);
      });
    });

    return map;
  }, [bulletinList]);

  /* ----------------------------------------
   * URL → 주보 찾기
   * -------------------------------------- */
  const findBulletinByParam = useCallback(
    (param: string) => {
      const targetDate = paramToDate(param);
      if (!targetDate) return null;

      const sameDate = bulletinList.filter((b) =>
        b.date.startsWith(targetDate)
      );
      if (!sameDate.length) return null;

      const index = extractDateIndex(param) - 1;
      return sameDate[index] ?? sameDate[0];
    },
    [bulletinList]
  );

  /* ----------------------------------------
   * 주보 내용 로드 (단일 진입점)
   * -------------------------------------- */
  const loadBulletinContent = useCallback(
    async (item: BulletinItem) => {
      if (contentLoading) return;
      if (selectedBulletin?.id === item.id && bulletinContent) return;

      setSelectedBulletin(item);
      setContentLoading(true);
      setLoadingStep('주보 내용을 불러오는 중...');

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`/api/bulletin/${item.slug}`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);
        const data = await res.json();

        if (data?.blocks) {
          const html = convertBlocksToMdxHtml(data.blocks);
          setBulletinContent(processHtmlTags(html));
        }
      } catch {
        setBulletinContent('내용을 불러올 수 없습니다.');
      } finally {
        setContentLoading(false);
        setLoadingStep('');
      }
    },
    [contentLoading, selectedBulletin?.id, bulletinContent]
  );

  /* ----------------------------------------
   * 초기 로드 (URL 기준 단 1회)
   * -------------------------------------- */
  useEffect(() => {
    if (!bulletinList.length) return;

    // URL 파라미터 우선
    if (contentParam && lastProcessedParam.current !== contentParam) {
      const bulletin = findBulletinByParam(contentParam);
      if (bulletin) {
        lastProcessedParam.current = contentParam;
        loadBulletinContent(bulletin);
        return;
      }
    }

    // URL 없으면 최신 1개
    if (!contentParam && !selectedBulletin) {
      loadBulletinContent(bulletinList[0]);
    }
  }, [bulletinList, contentParam, selectedBulletin, findBulletinByParam, loadBulletinContent]);

  /* ----------------------------------------
   * 필터 & 페이지네이션
   * -------------------------------------- */
  const filteredItems = bulletinList.filter((item) => {
    const match = item.date.match(/^(\d{4})\.(\d{2})/);
    if (!match) return true;

    const [_, y, m] = match;
    if (selectedYear !== 'all' && y !== selectedYear) return false;
    if (selectedMonth !== 'all' && m !== selectedMonth) return false;
    return true;
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));
  }, [filteredItems.length]);

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ----------------------------------------
   * 클릭 핸들러
   * -------------------------------------- */
  const handleBulletinClick = useCallback(
    (item: BulletinItem) => {
      const param = bulletinParamMap.get(item.id);
      if (param) {
        lastProcessedParam.current = param;
        router.push(`/worship/bulletin?content=${param}`, { scroll: false });
      }
      loadBulletinContent(item);
    },
    [bulletinParamMap, loadBulletinContent, router]
  );

  /* ----------------------------------------
   * 렌더
   * -------------------------------------- */
  return (
    <div className={`${b.bulletin} detail-inner`}>
      <div className={b.inner}>
        <BulletinContent
          selectedBulletin={selectedBulletin}
          latestBulletin={bulletinList[0]}
          bulletinContent={bulletinContent}
          contentLoading={contentLoading}
          loadingStep={loadingStep}
          formatDate={formatDate}
        />

        <BulletinList
          loading={false}
          currentItems={currentItems}
          selectedBulletin={selectedBulletin}
          totalPages={totalPages}
          currentPage={currentPage}
          onBulletinClick={handleBulletinClick}
          onPageChange={setCurrentPage}
          formatDate={formatDate}
          selectedYear={tempYear}
          selectedMonth={tempMonth}
          onYearChange={setTempYear}
          onMonthChange={setTempMonth}
          onFilterApply={() => {
            setSelectedYear(tempYear);
            setSelectedMonth(tempMonth);
            setCurrentPage(1);
          }}
          availableYears={[...new Set(bulletinList.map(b => b.date.slice(0, 4)))]}
          availableMonths={[...new Set(bulletinList.map(b => b.date.slice(5, 7)))]}
        />
      </div>
    </div>
  );
}
