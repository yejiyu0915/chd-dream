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
  contentParam: string | null; // 서버에서 받은 searchParams
  initialLatestBulletinContent?: {
    bulletinId: string;
    blocks: unknown[];
  } | null; // 서버에서 미리 로드한 최신 주보 내용
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

export default function BulletinClient({
  initialBulletinList,
  contentParam,
  initialLatestBulletinContent,
}: BulletinClientProps) {
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

  // 무한 루프 방지를 위한 ref (함수 재생성 방지)
  const contentLoadingRef = useRef(false);
  const selectedBulletinIdRef = useRef<string | null>(null);
  const bulletinContentRef = useRef<string>('');

  // 주보 내용 캐시 (bulletinId -> content) - 이미 로드한 주보는 즉시 표시
  const bulletinContentCache = useRef<Map<string, string>>(new Map());

  // 프리로드 중인 주보 추적 (중복 프리로드 방지)
  const prefetchingBulletins = useRef<Set<string>>(new Set());

  // ref 동기화 (최신 상태 유지)
  useEffect(() => {
    contentLoadingRef.current = contentLoading;
    selectedBulletinIdRef.current = selectedBulletin?.id || null;
    bulletinContentRef.current = bulletinContent;
  }, [contentLoading, selectedBulletin?.id, bulletinContent]);

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

  // 서버에서 미리 로드한 최신 주보 내용을 안정적인 값으로 변환 (dependency array 크기 일관성 유지)
  const initialLatestBulletinId = useMemo(
    () => initialLatestBulletinContent?.bulletinId || null,
    [initialLatestBulletinContent?.bulletinId]
  );

  // 최신 주보 설정 및 서버에서 미리 로드한 내용 처리
  useEffect(() => {
    if (bulletinList.length > 0 && !latestBulletin) {
      const latest = bulletinList[0];
      setLatestBulletin(latest);

      // 서버에서 미리 로드한 최신 주보 내용이 있으면 즉시 변환하여 캐시에 저장 및 표시
      if (initialLatestBulletinContent && initialLatestBulletinContent.bulletinId === latest.id) {
        // 변환 작업 (동기적으로 빠르게 처리)
        const mdxHtml = convertBlocksToMdxHtml(initialLatestBulletinContent.blocks);
        const processedHtml = processHtmlTags(mdxHtml);

        // 캐시에 저장
        bulletinContentCache.current.set(latest.id, processedHtml);

        // 즉시 표시 (로딩 없이)
        setSelectedBulletin(latest);
        setBulletinContent(processedHtml);
        setContentLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulletinList, latestBulletin, initialLatestBulletinId]); // 안정적인 값 사용

  // URL 파라미터 처리 (중복 실행 방지)
  useEffect(() => {
    // 이미 처리한 파라미터면 스킵
    if (contentParam === lastProcessedParam.current) {
      return;
    }

    if (contentParam && bulletinList.length > 0) {
      const bulletin = findBulletinByParam(contentParam);
      // ref를 사용하여 중복 체크 (함수 재생성 방지)
      if (bulletin && bulletin.id !== selectedBulletinIdRef.current) {
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
  }, [contentParam, bulletinList.length]); // loadBulletinContent와 findBulletinByParam 제거 (무한 루프 방지)

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

  // 필터링된 아이템들 (메모이제이션 - 복잡한 필터링이므로 수동 최적화)
  const filteredItems = useMemo(() => {
    return bulletinList.filter((item) => {
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
  }, [bulletinList, selectedYear, selectedMonth]);

  // 현재 페이지의 아이템들 (메모이제이션)
  const currentItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredItems, currentPage, itemsPerPage]
  );

  // 네트워크 상태 확인 (느린 연결에서는 프리로드 제한)
  const shouldPrefetch = useMemo(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return true; // 네트워크 정보를 알 수 없으면 프리로드 허용
    }

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (!connection) return true;

    // 느린 연결에서는 프리로드 제한
    const slowConnection =
      connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    const saveData = connection.saveData === true;

    return !slowConnection && !saveData; // 느린 연결이거나 데이터 절약 모드면 프리로드 안 함
  }, []);

  // 현재 페이지의 주보들을 백그라운드에서 프리로드 (클릭 시 즉시 표시)
  // 네트워크 상태를 고려하여 최신 3개만 프리로드 (네트워크 사용량 최적화)
  useEffect(() => {
    if (!shouldPrefetch) return; // 느린 연결이면 프리로드 안 함

    // 현재 페이지의 주보 중 최신 3개만 프리로드 (네트워크 사용량 절약)
    const itemsToPrefetch = currentItems.slice(0, 3);

    itemsToPrefetch.forEach((item) => {
      // 이미 캐시에 있거나 프리로드 중이면 스킵
      if (bulletinContentCache.current.has(item.id) || prefetchingBulletins.current.has(item.id)) {
        return;
      }

      // 프리로드 시작
      prefetchingBulletins.current.add(item.id);

      // 백그라운드에서 조용히 로드 (에러는 무시)
      fetch(`/api/bulletin/${item.slug}`, {
        headers: {
          'Cache-Control': 'max-age=3600',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.blocks) {
            // 변환 작업
            const mdxHtml = convertBlocksToMdxHtml(data.blocks);
            const processedHtml = processHtmlTags(mdxHtml);

            // 캐시에 저장 (사용자가 클릭하면 즉시 표시)
            bulletinContentCache.current.set(item.id, processedHtml);
          }
        })
        .catch(() => {
          // 프리로드 실패는 무시 (사용자가 클릭할 때 다시 시도)
        })
        .finally(() => {
          // 프리로드 완료 후 추적에서 제거
          prefetchingBulletins.current.delete(item.id);
        });
    });
  }, [currentItems, shouldPrefetch]); // currentItems가 변경될 때마다 프리로드

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
  // ref를 사용하여 함수 재생성 방지 및 무한 루프 방지
  // 캐싱 처리로 이미 로드한 주보는 즉시 표시
  const loadBulletinContent = useCallback(
    async (item: BulletinItem) => {
      // ref를 사용하여 최신 상태 확인 (함수 재생성 방지)
      if (contentLoadingRef.current) return;
      if (selectedBulletinIdRef.current === item.id && bulletinContentRef.current) {
        return;
      }

      // 캐시 확인 - 이미 로드한 주보는 캐시에서 즉시 가져오기
      const cachedContent = bulletinContentCache.current.get(item.id);
      if (cachedContent) {
        setSelectedBulletin(item);
        setBulletinContent(cachedContent);
        setContentLoading(false);
        setLoadingStep('');
        return; // 캐시에서 가져왔으므로 API 요청 불필요
      }

      // 캐시에 없으면 API 요청
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

          // 캐시에 저장 (다음에 같은 주보를 열 때 즉시 표시)
          bulletinContentCache.current.set(item.id, processedHtml);

          setBulletinContent(processedHtml);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          const errorMessage = '요청 시간이 초과되었습니다.';
          setBulletinContent(errorMessage);
          // 에러 메시지는 캐시에 저장하지 않음
        } else {
          const errorMessage = '내용을 불러올 수 없습니다.';
          setBulletinContent(errorMessage);
          // 에러 메시지는 캐시에 저장하지 않음
        }
      } finally {
        setContentLoading(false);
        setLoadingStep('');
      }
    },
    [] // dependency 제거하여 함수 재생성 방지 (ref 사용으로 최신 상태 접근)
  );

  // 주보 아이템 호버 핸들러 (프리로드 - 클릭 전에 미리 로드)
  // 네트워크 상태를 고려하여 호버 프리로드도 제한
  const handleBulletinHover = useCallback(
    (item: BulletinItem) => {
      // 느린 연결이면 호버 프리로드 안 함
      if (!shouldPrefetch) return;

      // 이미 캐시에 있거나 프리로드 중이면 스킵
      if (bulletinContentCache.current.has(item.id) || prefetchingBulletins.current.has(item.id)) {
        return;
      }

      // 프리로드 시작
      prefetchingBulletins.current.add(item.id);

      // 백그라운드에서 조용히 로드
      fetch(`/api/bulletin/${item.slug}`, {
        headers: {
          'Cache-Control': 'max-age=3600',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.blocks) {
            // 변환 작업
            const mdxHtml = convertBlocksToMdxHtml(data.blocks);
            const processedHtml = processHtmlTags(mdxHtml);

            // 캐시에 저장
            bulletinContentCache.current.set(item.id, processedHtml);
          }
        })
        .catch(() => {
          // 프리로드 실패는 무시
        })
        .finally(() => {
          prefetchingBulletins.current.delete(item.id);
        });
    },
    [shouldPrefetch]
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
    [bulletinParamMap, loadBulletinContent, router] // loadBulletinContent는 이제 안정적이므로 포함 가능
  );

  // itemsPerPage나 필터가 변경될 때 totalPages 재계산
  useEffect(() => {
    if (bulletinList.length > 0) {
      setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));
    }
  }, [bulletinList.length, itemsPerPage, filteredItems.length]);

  // 최신 주보 자동 로드 (URL 파라미터 없을 때만, 서버에서 미리 로드하지 않은 경우)
  useEffect(() => {
    // ref를 사용하여 중복 체크 (함수 재생성 방지)
    // 서버에서 이미 로드한 경우는 스킵 (위의 useEffect에서 처리됨)
    if (
      latestBulletin &&
      !selectedBulletinIdRef.current &&
      !contentParam &&
      initialLatestBulletinId !== latestBulletin.id
    ) {
      loadBulletinContent(latestBulletin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBulletin, contentParam, initialLatestBulletinId]); // 안정적인 값 사용 (무한 루프 방지)

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
          onBulletinHover={handleBulletinHover}
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
