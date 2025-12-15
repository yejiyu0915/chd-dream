'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Spinner from '@/common/components/utils/Spinner';
import n from '@/app/info/news/NewsList.module.scss'; // NewsList.module.scss 사용
import { NewsItem } from '@/lib/notion'; // NewsItem 인터페이스 임포트
import Button from '@/common/components/utils/Button'; // Button 컴포넌트 임포트
import { isNewPost } from '@/common/utils/dateUtils'; // NEW 배지 판별 함수

// 임시 뉴스 아이템 타입 (page.tsx에서 정의된 NewsItem과 일치)
interface NewsListDisplayProps {
  newsData: NewsItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// const MOBILE_BREAKPOINT = 768; // 모바일 기준 (px) - 제거

export default function NewsListDisplay({
  newsData,
  isLoading,
  isError,
  error,
}: NewsListDisplayProps) {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const prefetchedLinks = useRef<Set<string>>(new Set());

  // hover 시 페이지 프리패치 (PC용)
  const handleMouseEnter = (link: string) => {
    if (!prefetchedLinks.current.has(link)) {
      router.prefetch(link);
      prefetchedLinks.current.add(link);
    }
  };

  // touchstart 시 페이지 프리패치 (모바일용)
  const handleTouchStart = (link: string) => {
    if (!prefetchedLinks.current.has(link)) {
      router.prefetch(link);
      prefetchedLinks.current.add(link);
    }
  };

  // Intersection Observer로 뷰포트 내 링크 자동 프리패치 (모바일 최적화)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target.getAttribute('data-prefetch-href');
            if (link && !prefetchedLinks.current.has(link)) {
              router.prefetch(link);
              prefetchedLinks.current.add(link);
            }
          }
        });
      },
      {
        rootMargin: '150px',
        threshold: 0.1,
      }
    );

    const linkElements = document.querySelectorAll('[data-prefetch-href]');
    linkElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [router, newsData]);

  // const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false); // 제거
  // React.useEffect(() => { // 제거
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
  //   };
  //   checkMobile(); // 클라이언트에서 마운트될 때 한 번 실행
  //   window.addEventListener('resize', checkMobile);
  //   return () => {
  //     window.removeEventListener('resize', checkMobile);
  //   };
  // }, []); // 제거

  // 서버 렌더링 시에는 항상 PC 기본값을 사용하고, 클라이언트에서 isMobile 상태에 따라 동적으로 결정
  const initialDisplayCount = 8; // 초기에 보여줄 뉴스 개수 (모바일/PC 통일)
  const loadMoreCount = 8; // 더보기 버튼 클릭 시 추가로 로드할 뉴스 개수 (모바일/PC 통일)

  const [displayLimit, setDisplayLimit] = React.useState(initialDisplayCount);

  // isMobile 값 또는 initialDisplayCount 값 변경 시 displayLimit 초기화 - 제거
  // React.useEffect(() => {
  //   setDisplayLimit(initialDisplayCount); // 모바일/PC 전환 시 초기화
  // }, [initialDisplayCount]); // isMobile 대신 initialDisplayCount를 의존성으로

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + loadMoreCount);
  };

  if (isLoading) {
    return (
      <div className={n.newsList}>
        <div className={n.loadingState}>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    let errorMessage = '뉴스 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={n.newsList}>
        <div className={n.error}>{errorMessage}</div>
      </div>
    );
  }

  const displayedNews = newsData ? newsData.slice(0, displayLimit) : [];
  const hasMore = newsData && displayedNews.length < newsData.length;

  // 뉴스 아이템 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.08, // 각 아이템마다 0.08초 간격
      },
    }),
  };

  return (
    <div className={n.newsList}>
      {' '}
      {/* cLogList 대신 newsList 클래스 사용 */}
      <div className={`detail-inner`}>
        {newsData && newsData.length > 0 ? (
          <>
            <ul className={n.list}>
              {' '}
              {/* 리스트 뷰로 고정, c.list--${_viewMode} 대신 n.list 사용 */}
              {displayedNews.map((item, _index) => (
                <motion.li
                  key={item.id}
                  className={n.list__item}
                  data-prefetch-href={item.link || '#'}
                  custom={_index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ margin: '100px' }}
                  variants={itemVariants}
                >
                  <Link
                    href={item.link || '#'}
                    className={n.list__link}
                    prefetch={true}
                    onMouseEnter={() => handleMouseEnter(item.link || '#')}
                    onTouchStart={() => handleTouchStart(item.link || '#')}
                  >
                    <span className={n.list__index}>
                      {newsData.length - newsData.indexOf(item)}
                    </span>{' '}
                    {/* 순번 표시 (원본 newsData 배열에서의 인덱스 사용) */}
                    <div className={n.list__content}>
                      {/* NEW 배지 (30일 이내 게시물) */}
                      {isNewPost(item.rawDate) && <span className={n.list__newBadge}>NEW</span>}
                      <h2 className={n.list__title}>{item.title}</h2>
                      <span className={n.list__date}>{item.date}</span>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
            {hasMore && (
              <div className="load-more__wrapper">
                <Button onClick={handleLoadMore} className="load-more__button" icon="arrow-down">
                  더보기
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className={n.emptyMessage}>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
