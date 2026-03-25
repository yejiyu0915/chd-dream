'use client';

import { useEffect, useState, useRef } from 'react';
import CLogRecommendedPosts from './CLogRecommendedPosts';
import { CLogItem } from '@/lib/notion';
import { fetchJson } from '@/common/utils/safeFetchJson';

interface CLogRecommendedPostsClientProps {
  slug: string;
  category: string;
  tags: string[];
}

/**
 * 클라이언트 컴포넌트로 추천글 지연 로드
 * 뷰포트에 들어올 때만 데이터를 가져와서 서버 렌더링 블로킹 방지
 * 최적화: 경량 API 사용 + 더 늦은 로드
 */
export default function CLogRecommendedPostsClient({
  slug,
  category,
  tags,
}: CLogRecommendedPostsClientProps) {
  const [allPosts, setAllPosts] = useState<CLogItem[] | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasFetchedRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit || hasFetchedRef.current) return;

        hasFetchedRef.current = true;
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        fetchJson<CLogItem[]>('/api/c-log/recommended', { signal: ac.signal })
          .then((data) => {
            if (ac.signal.aborted) return;
            setAllPosts(Array.isArray(data) ? data : []);
          })
          .catch((err) => {
            if (err instanceof Error && err.name === 'AbortError') return;
            console.error('추천글 데이터 로딩 실패:', err);
            setAllPosts([]);
          })
          .finally(() => {
            if (observerRef.current && containerRef.current) {
              observerRef.current.unobserve(containerRef.current);
            }
          });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observerRef.current.observe(el);

    return () => {
      abortRef.current?.abort();
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current);
      }
    };
  }, []);

  const currentPost = {
    id: slug,
    category,
    tags,
    slug,
  };

  return (
    <div ref={containerRef} style={{ minHeight: allPosts ? undefined : '200px' }}>
      {allPosts ? <CLogRecommendedPosts currentPost={currentPost} allPosts={allPosts} /> : null}
    </div>
  );
}
