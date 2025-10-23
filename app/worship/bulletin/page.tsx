'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageTitleSetter from '@/app/worship/components/PageTitleSetter';
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
  content?: string; // 노션 본문 내용
  thumbnail?: string;
}

export default function BulletinPage() {
  const queryClient = useQueryClient();
  const lastModifiedHeaderValue = useRef<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestBulletin, setLatestBulletin] = useState<BulletinItem | null>(null);
  const [selectedBulletin, setSelectedBulletin] = useState<BulletinItem | null>(null);
  const [bulletinContent, setBulletinContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // 필터 상태 (UI용)
  const [tempYear, setTempYear] = useState<string>('all');
  const [tempMonth, setTempMonth] = useState<string>('all');

  // 실제 적용된 필터 상태
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const itemsPerPage = 6; // 2x3 그리드

  // 주보 리스트 데이터 가져오기 (If-Modified-Since 헤더 사용)
  const fetchBulletinListData = async (): Promise<BulletinItem[]> => {
    const headers: HeadersInit = {};
    if (lastModifiedHeaderValue.current) {
      headers['If-Modified-Since'] = lastModifiedHeaderValue.current;
    }

    const response = await fetch('/api/bulletin', { headers });

    // 304 응답: 데이터가 변경되지 않음 - 캐시된 데이터 반환
    if (response.status === 304) {
      return (queryClient.getQueryData(['bulletin-list']) as BulletinItem[]) || [];
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Last-Modified 헤더 저장
    const newLastModified = response.headers.get('Last-Modified');
    if (newLastModified) {
      lastModifiedHeaderValue.current = newLastModified;
    }

    const data = await response.json();
    // API 응답이 배열인 경우와 객체인 경우 모두 처리
    return Array.isArray(data) ? data : data.items || [];
  };

  // React Query로 주보 리스트 관리
  const {
    data: bulletinList = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery<BulletinItem[], Error>({
    queryKey: ['bulletin-list'],
    queryFn: fetchBulletinListData,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 최신 주보 설정
  useEffect(() => {
    if (bulletinList.length > 0 && !latestBulletin) {
      setLatestBulletin(bulletinList[0]);
    }
  }, [bulletinList, latestBulletin]);

  // 사용 가능한 연도/월 목록 생성
  const availableYears = React.useMemo(() => {
    const years = new Set<string>();
    bulletinList.forEach((item) => {
      const dateMatch = item.date.match(/^(\d{4})\.\d{2}\.\d{2}/);
      if (dateMatch) {
        years.add(dateMatch[1]);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // 최신순 정렬
  }, [bulletinList]);

  const availableMonths = React.useMemo(() => {
    const months = new Set<string>();
    bulletinList.forEach((item) => {
      const dateMatch = item.date.match(/^\d{4}\.(\d{2})\.\d{2}/);
      if (dateMatch) {
        months.add(dateMatch[1]);
      }
    });
    return Array.from(months).sort((a, b) => a.localeCompare(b)); // 월순 정렬
  }, [bulletinList]);

  // 필터링된 아이템들
  const filteredItems = bulletinList.filter((item) => {
    if (selectedYear === 'all' && selectedMonth === 'all') {
      return true;
    }

    // 날짜 파싱 (예: "2025.01.05 (2025년 1월 1주차)" 형식)
    const dateMatch = item.date.match(/^(\d{4})\.(\d{2})\.\d{2}/);
    if (!dateMatch) return true;

    const [, year, month] = dateMatch;
    const itemYear = year;
    const itemMonth = month;

    // 연도 필터
    if (selectedYear !== 'all' && itemYear !== selectedYear) {
      return false;
    }

    // 월 필터
    if (selectedMonth !== 'all' && itemMonth !== selectedMonth) {
      return false;
    }

    return true;
  });

  // 현재 페이지의 아이템들
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 필터 적용 핸들러
  const handleFilterApply = () => {
    setSelectedYear(tempYear);
    setSelectedMonth(tempMonth);
    setCurrentPage(1); // 필터 적용 시 첫 페이지로 이동
  };

  // 주보 아이템 클릭 핸들러
  const handleBulletinClick = useCallback(
    async (item: BulletinItem) => {
      // 이미 같은 주보가 선택되어 있고 내용이 있다면 데이터 로드 생략
      if (selectedBulletin?.id === item.id && bulletinContent) {
        return;
      }

      setSelectedBulletin(item);
      setContentLoading(true);
      setLoadingStep('주보 데이터를 가져오는 중...');

      try {
        setLoadingStep('내용을 불러오는 중...');

        // AbortController로 요청 취소 가능하게 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

        const response = await fetch(`/api/bulletin/${item.slug}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=3600', // 1시간 캐시
          },
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data && data.blocks) {
          setLoadingStep('내용을 변환하는 중...');

          // 큰 블록 데이터의 경우 청크 단위로 처리
          const mdxHtml = convertBlocksToMdxHtml(data.blocks);
          const processedHtml = processHtmlTags(mdxHtml);

          setLoadingStep('완료!');
          setBulletinContent(processedHtml);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setBulletinContent('요청 시간이 초과되었습니다.');
        } else {
          setBulletinContent('내용을 불러올 수 없습니다.');
        }
      } finally {
        setContentLoading(false);
        setLoadingStep('');
      }
    },
    [selectedBulletin?.id, bulletinContent]
  );

  // itemsPerPage나 필터가 변경될 때 totalPages 재계산
  useEffect(() => {
    if (bulletinList.length > 0) {
      setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));
    }
  }, [bulletinList.length, itemsPerPage, filteredItems.length]);

  // 필터 변경 시 첫 페이지로 이동 (이제 handleFilterApply에서 처리)

  // 최신 주보 자동 로드 (단, 스크롤은 하지 않음)
  useEffect(() => {
    if (latestBulletin && !selectedBulletin) {
      // 약간의 지연을 두어 초기 로딩 완료 후 실행
      const timer = setTimeout(() => {
        // 스크롤 없이 컨텐츠만 로드
        handleBulletinClick(latestBulletin);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [latestBulletin, selectedBulletin, handleBulletinClick]);

  // 로딩 상태 처리 (초기 로드 시에만)
  if (loading && bulletinList.length === 0) {
    return (
      <>
        <PageTitleSetter title="온라인 주보" />
        <div className={`${b.bulletin} detail-inner`}>
          <div className={b.inner}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: '20px',
                width: '100%',
              }}
            >
              <Spinner size="lg" />
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
                주보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <>
        <PageTitleSetter title="온라인 주보" />
        <div className={`${b.bulletin} detail-inner`}>
          <div className={b.inner}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ marginBottom: '10px' }}>주보 데이터를 가져오는데 실패했습니다.</p>
              <p style={{ color: '#999', fontSize: '14px' }}>
                {error?.message || '알 수 없는 오류가 발생했습니다.'}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitleSetter title="온라인 주보" />
      <div className={`${b.bulletin} detail-inner`}>
        <div className={b.inner}>
          <BulletinContent
            selectedBulletin={selectedBulletin}
            latestBulletin={latestBulletin}
            bulletinContent={bulletinContent}
            contentLoading={contentLoading}
            loadingStep={loadingStep}
            formatDate={formatDate}
          />

          <BulletinList
            loading={loading}
            currentItems={currentItems}
            selectedBulletin={selectedBulletin}
            totalPages={totalPages}
            currentPage={currentPage}
            onBulletinClick={handleBulletinClick}
            onPageChange={handlePageChange}
            formatDate={formatDate}
            selectedYear={tempYear}
            selectedMonth={tempMonth}
            onYearChange={setTempYear}
            onMonthChange={setTempMonth}
            onFilterApply={handleFilterApply}
            availableYears={availableYears}
            availableMonths={availableMonths}
          />
        </div>
      </div>
    </>
  );
}
