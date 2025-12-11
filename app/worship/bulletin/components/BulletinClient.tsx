'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  contentParam: string | null; // 서버에서 받은 searchParams
}

// 날짜를 URL 파라미터 형식으로 변환 (2025.01.05 → 20250105)
const dateToParam = (dateString: string): string => {
  const match = dateString.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    return `${match[1]}${match[2]}${match[3]}`;
  }
  return '';
};

// URL 파라미터를 날짜 형식으로 변환 (20250105 → 2025.01.05)
const paramToDate = (param: string): string => {
  // 기본 형식: 20251130 또는 20251130-1
  const match = param.match(/^(\d{4})(\d{2})(\d{2})(-\d+)?$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}`;
  }
  return '';
};

// 같은 날짜의 주보 인덱스 추출 (20251130-2 → 2번째)
const extractDateIndex = (param: string): number => {
  const match = param.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
};

export default function BulletinClient({ initialBulletinList, contentParam }: BulletinClientProps) {
  const router = useRouter();

  // 서버에서 받은 데이터를 직접 사용
  const bulletinList = initialBulletinList || [];
  const loading = false;
  const isError = false;
  const error = null;

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

  // 마지막으로 처리한 URL 파라미터 추적 (중복 실행 방지)
  const lastProcessedParam = useRef<string | null>(null);

  // 각 주보의 URL 파라미터를 미리 계산 (성능 최적화)
  const bulletinParamMap = React.useMemo(() => {
    const map = new Map<string, string>(); // bulletinId -> urlParam

    // 날짜별로 그룹화
    const dateGroups = new Map<string, BulletinItem[]>();
    bulletinList.forEach((item) => {
      const targetDate = item.date.substring(0, 10);
      if (!dateGroups.has(targetDate)) {
        dateGroups.set(targetDate, []);
      }
      dateGroups.get(targetDate)!.push(item);
    });

    // 각 그룹의 주보에 파라미터 할당
    dateGroups.forEach((items, date) => {
      const dateParam = date.replace(/\./g, ''); // "2025.01.05" -> "20250105"

      if (items.length === 1) {
        // 날짜에 주보가 1개만 있으면 날짜만
        map.set(items[0].id, dateParam);
      } else {
        // 여러 개면 인덱스 추가
        items.forEach((item, index) => {
          map.set(item.id, `${dateParam}-${index + 1}`);
        });
      }
    });

    return map;
  }, [bulletinList]);

  // URL 파라미터에서 주보 찾기
  const findBulletinByParam = useCallback(
    (contentParam: string) => {
      const targetDate = paramToDate(contentParam);
      if (!targetDate) return null;

      // 해당 날짜의 모든 주보 찾기
      const sameDateBulletins = bulletinList.filter((item) => item.date.startsWith(targetDate));

      if (sameDateBulletins.length === 0) return null;

      // 인덱스 추출 (기본값 1)
      const targetIndex = extractDateIndex(contentParam);

      // 인덱스에 맞는 주보 반환 (1부터 시작하므로 -1)
      return sameDateBulletins[targetIndex - 1] || sameDateBulletins[0];
    },
    [bulletinList]
  );

  // 최신 주보 설정
  useEffect(() => {
    if (bulletinList.length > 0 && !latestBulletin) {
      setLatestBulletin(bulletinList[0]);
    }
  }, [bulletinList, latestBulletin]);

  // URL 파라미터 처리 (중복 실행 방지)
  useEffect(() => {
    // 이미 처리한 파라미터면 스킵
    if (contentParam === lastProcessedParam.current) {
      return;
    }

    if (contentParam && bulletinList.length > 0) {
      const bulletin = findBulletinByParam(contentParam);
      if (bulletin && bulletin.id !== selectedBulletin?.id) {
        // 마지막 처리한 파라미터 기록
        lastProcessedParam.current = contentParam;

        // 내용 로드 (URL 업데이트 없이)
        loadBulletinContent(bulletin);

        // 해당 주보가 있는 페이지로 이동
        const bulletinIndex = bulletinList.findIndex((item) => item.id === bulletin.id);
        if (bulletinIndex !== -1) {
          const targetPage = Math.floor(bulletinIndex / itemsPerPage) + 1;
          setCurrentPage(targetPage);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentParam]);

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

  // 주보 내용 로드 함수 (URL 업데이트 없이 내용만 로드)
  const loadBulletinContent = useCallback(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBulletin?.id, bulletinContent]
  );

  // 주보 아이템 클릭 핸들러 (URL 파라미터 업데이트 + 내용 로드)
  const handleBulletinClick = useCallback(
    (item: BulletinItem) => {
      // 미리 계산된 URL 파라미터 가져오기 (즉시 실행)
      const finalParam = bulletinParamMap.get(item.id);

      if (finalParam) {
        // 마지막 처리한 파라미터 기록 (useEffect 중복 실행 방지)
        lastProcessedParam.current = finalParam;

        // URL 파라미터 업데이트
        router.push(`/worship/bulletin?content=${finalParam}`, { scroll: false });
      }

      // 내용 로드 (병렬 처리)
      loadBulletinContent(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bulletinParamMap, loadBulletinContent]
  );

  // itemsPerPage나 필터가 변경될 때 totalPages 재계산
  useEffect(() => {
    if (bulletinList.length > 0) {
      setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));
    }
  }, [bulletinList.length, itemsPerPage, filteredItems.length]);

  // 최신 주보 자동 로드 (URL 파라미터 없을 때만)
  useEffect(() => {
    if (latestBulletin && !selectedBulletin && !contentParam) {
      loadBulletinContent(latestBulletin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBulletin, selectedBulletin, contentParam]);

  // 로딩 상태 처리 (초기 로드 시에만)
  if (loading && bulletinList.length === 0) {
    return (
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
    );
  }

  // 에러 상태 처리
  if (isError) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : '알 수 없는 오류가 발생했습니다.';
    return (
      <div className={`${b.bulletin} detail-inner`}>
        <div className={b.inner}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ marginBottom: '10px' }}>주보 데이터를 가져오는데 실패했습니다.</p>
            <p style={{ color: '#999', fontSize: '14px' }}>{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}
