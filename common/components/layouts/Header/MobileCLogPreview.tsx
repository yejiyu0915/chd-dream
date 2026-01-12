'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { CLogItem } from '@/lib/notion';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';

// 전역 캐시 (컴포넌트 간 공유)
const cLogDataCache = {
  data: null as CLogItem[] | null,
  timestamp: 0,
  TTL: 5 * 60 * 1000, // 5분 캐시
};

/**
 * 모바일 헤더 하단 C-log 미리보기 컴포넌트
 */
export default function MobileCLogPreview() {
  const [cLogData, setCLogData] = useState<CLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false); // 중복 요청 방지

  // C-log 데이터 가져오기 (캐싱 적용)
  useEffect(() => {
    async function fetchCLogData() {
      // 중복 요청 방지
      if (isFetchingRef.current) return;

      // 캐시 확인
      const now = Date.now();
      if (cLogDataCache.data && now - cLogDataCache.timestamp < cLogDataCache.TTL) {
        setCLogData(cLogDataCache.data);
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/c-log-main', {
          headers: {
            'Cache-Control': 'max-age=300', // 5분 캐시
          },
        });

        if (!response.ok) {
          throw new Error('C-log 데이터를 가져오는 데 실패했습니다.');
        }

        const data = await response.json();
        const cLogList = data || [];

        // 캐시 업데이트
        cLogDataCache.data = cLogList;
        cLogDataCache.timestamp = now;

        setCLogData(cLogList);
      } catch (err) {
        console.error('C-log 데이터 가져오기 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    }

    fetchCLogData();
  }, []);

  // 최신 3개 글 선택
  const latestPosts = useMemo(() => {
    if (!cLogData || cLogData.length === 0) {
      return [];
    }

    // 날짜 기준으로 정렬 (최신순)
    const sorted = [...cLogData].sort((a, b) => {
      const dateA = new Date(a.rawDate || a.date).getTime();
      const dateB = new Date(b.rawDate || b.date).getTime();
      return dateB - dateA; // 내림차순
    });

    return sorted.slice(0, 3);
  }, [cLogData]);

  // 데이터가 없고 로딩도 완료되었을 때만 표시하지 않음 (깜빡임 방지)
  if (!isLoading && !error && latestPosts.length === 0) {
    return null;
  }

  // 로딩 중이거나 에러가 있어도 구조는 유지하되, 내용만 조건부 렌더링 (깜빡임 방지)
  return (
    <div className={h.mobileCLogPreview}>
      {!isLoading && !error && latestPosts.length > 0 && (
        <>
          <div className={h.mobileCLogPreview__list}>
            {/* 최신글 3개의 타이틀을 태그 버튼 스타일로 표시 */}
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={post.link || `/info/c-log/${post.slug}`}
                className={h.mobileCLogPreview__tagButton}
              >
                <span className={h.mobileCLogPreview__tagText}># {post.title}</span>
              </Link>
            ))}
            {/* 더보기 버튼 */}
            <Link href="/info/c-log" className={h.mobileCLogPreview__tagButton}>
              <span className={h.mobileCLogPreview__tagText}>
                더보기
                <Icon name="arrow-up-right" className={h.mobileCLogPreview__tagIcon} />
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
