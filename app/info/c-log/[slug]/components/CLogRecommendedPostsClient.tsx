'use client';

import { useEffect, useState, useRef } from 'react';
import CLogRecommendedPosts from './CLogRecommendedPosts';
import { CLogItem } from '@/lib/notion';

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
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer로 뷰포트 진입 감지
  useEffect(() => {
    if (!containerRef.current || allPosts || isLoading) return;

    // Observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !allPosts && !isLoading) {
            setIsLoading(true);
            // 경량 API 사용 (필요한 필드만 반환)
            fetch('/api/c-log/recommended')
              .then((res) => res.json())
              .then((data: CLogItem[]) => {
                setAllPosts(data);
                setIsLoading(false);
                // Observer 해제
                if (observerRef.current && containerRef.current) {
                  observerRef.current.unobserve(containerRef.current);
                }
              })
              .catch((error) => {
                console.error('추천글 데이터 로딩 실패:', error);
                setIsLoading(false);
              });
          }
        });
      },
      {
        rootMargin: '50px', // 50px 전부터 미리 로드 (더 늦게 로드하여 메인 콘텐츠 우선)
        threshold: 0.1, // 10% 보이면 트리거
      }
    );

    // Observer 시작
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current);
      }
    };
  }, [allPosts, isLoading]);

  const currentPost = {
    id: slug,
    category,
    tags,
    slug,
  };

  // 데이터가 없으면 빈 div만 반환 (레이아웃 유지)
  if (!allPosts) {
    return <div ref={containerRef} style={{ minHeight: '200px' }} />;
  }

  return (
    <div ref={containerRef}>
      <CLogRecommendedPosts currentPost={currentPost} allPosts={allPosts} />
    </div>
  );
}
