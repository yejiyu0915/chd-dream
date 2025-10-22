'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from '@/common/components/utils/Spinner';
import n from '@/app/info/notice/NoticeList.module.scss';
import { NoticeItem } from '@/lib/notion';
import Button from '@/common/components/utils/Button';

interface NoticeListDisplayProps {
  noticeData: NoticeItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function NoticeListDisplay({
  noticeData,
  isLoading,
  isError,
  error,
}: NoticeListDisplayProps) {
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
  }, [router, noticeData]);

  const initialDisplayCount = 8;
  const loadMoreCount = 8;

  const [displayLimit, setDisplayLimit] = React.useState(initialDisplayCount);

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + loadMoreCount);
  };

  if (isLoading) {
    return (
      <div className={n.noticeList}>
        <div className={n.loadingState}>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    let errorMessage = '공지사항 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={n.noticeList}>
        <div className={n.error}>{errorMessage}</div>
      </div>
    );
  }

  const displayedNotices = noticeData ? noticeData.slice(0, displayLimit) : [];
  const hasMore = noticeData && displayedNotices.length < noticeData.length;

  return (
    <div className={n.noticeList}>
      <div className={`detail-inner`}>
        {noticeData && noticeData.length > 0 ? (
          <>
            <ul className={n.list}>
              {displayedNotices.map((item, _index) => (
                <li key={item.id} className={n.list__item} data-prefetch-href={item.link || '#'}>
                  <Link
                    href={item.link || '#'}
                    className={n.list__link}
                    prefetch={true}
                    onMouseEnter={() => handleMouseEnter(item.link || '#')}
                    onTouchStart={() => handleTouchStart(item.link || '#')}
                  >
                    <span className={n.list__index}>
                      {noticeData.length - noticeData.indexOf(item)}
                    </span>
                    <div className={n.list__content}>
                      <h3 className={n.list__title}>{item.title}</h3>
                      <span className={n.list__date}>{item.date}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {hasMore && (
              <div className="load-more-wrapper">
                <Button onClick={handleLoadMore} className="load-more-button" icon="arrow-down">
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
