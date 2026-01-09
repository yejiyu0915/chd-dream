'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { CLogItem } from '@/lib/notion';
import ImageWithTheme from '@/common/components/utils/ImageWithTheme';
import h from '@/common/components/layouts/Header/Header.module.scss';

/**
 * 모바일 헤더 하단 C-log 미리보기 컴포넌트
 */
export default function MobileCLogPreview() {
  const [cLogData, setCLogData] = useState<CLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // C-log 데이터 가져오기
  useEffect(() => {
    async function fetchCLogData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/c-log-main');
        if (!response.ok) {
          throw new Error('C-log 데이터를 가져오는 데 실패했습니다.');
        }

        const data = await response.json();
        setCLogData(data || []);
      } catch (err) {
        console.error('C-log 데이터 가져오기 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCLogData();
  }, []);

  // 최신 3개만 선택
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

  // 로딩 중, 에러 발생 시, 또는 데이터가 없을 때 표시하지 않음
  if (isLoading || error || latestPosts.length === 0) {
    return null;
  }

  return (
    <div className={h.mobileCLogPreview}>
      <h3 className={h.mobileCLogPreview__title}>→ 우리 교회는 요즘,</h3>
      <div className={h.mobileCLogPreview__list}>
        {latestPosts.map((post) => (
          <Link
            key={post.id}
            href={post.link || `/info/c-log/${post.slug}`}
            className={h.mobileCLogPreview__item}
          >
            <div className={h.mobileCLogPreview__imageWrapper}>
              <ImageWithTheme
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                width={500}
                height={300}
                className={h.mobileCLogPreview__image}
                loading="lazy"
              />
            </div>
            <div className={h.mobileCLogPreview__content}>
              <h4 className={h.mobileCLogPreview__itemTitle}>{post.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
