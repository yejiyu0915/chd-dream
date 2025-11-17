'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CLogItem } from '@/lib/notion';
import Spinner from '@/common/components/utils/Spinner'; // Spinner 컴포넌트 임포트
import c from '@/app/info/c-log/CLogList.module.scss'; // infoLayout.module.scss 사용
import Button from '@/common/components/utils/Button'; // Button 컴포넌트 임포트
import ImageWithTheme from '@/common/components/utils/ImageWithTheme'; // 테마 반응형 이미지 컴포넌트

interface CLogListProps {
  cLogData: CLogItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  viewMode: 'grid' | 'list'; // viewMode prop 추가
}

const PC_ITEMS_PER_LOAD = 6; // PC 버전에서 한 번에 불러올 아이템 개수
const MO_ITEMS_PER_LOAD = 4; // 모바일 버전에서 한 번에 불러올 아이템 개수

export default function CLogList({
  cLogData,
  isLoading,
  isError,
  error,
  viewMode: _viewMode, // viewMode prop을 _viewMode로 변경하여 사용되지 않음을 명시
}: CLogListProps) {
  const router = useRouter();
  const [itemsPerPage, setItemsPerPage] = useState(PC_ITEMS_PER_LOAD);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);
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

    // 이미 observer가 있으면 정리
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
        rootMargin: '150px', // 뷰포트 150px 전부터 프리패치 시작
        threshold: 0.1, // 10%만 보여도 트리거
      }
    );

    // 모든 링크 요소를 observe
    const linkElements = document.querySelectorAll('[data-prefetch-href]');
    linkElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [router, visibleItemCount, cLogData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 모바일 기준 (예: 768px 미만)
        setItemsPerPage(MO_ITEMS_PER_LOAD);
      } else {
        // PC 기준 (예: 768px 이상)
        setItemsPerPage(PC_ITEMS_PER_LOAD);
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // itemsPerPage가 변경될 때 visibleItemCount 초기화 및 cLogData 로드 시점 조정
  useEffect(() => {
    if (cLogData && cLogData.length > 0) {
      setVisibleItemCount(Math.min(itemsPerPage, cLogData.length));
    } else if (cLogData && cLogData.length === 0) {
      setVisibleItemCount(0);
    } else {
      setVisibleItemCount(itemsPerPage); // 데이터가 로드되기 전 초기 값 설정
    }
  }, [itemsPerPage, cLogData]);

  const handleLoadMore = () => {
    setVisibleItemCount((prevCount) => {
      const newCount = prevCount + itemsPerPage;
      return cLogData ? Math.min(newCount, cLogData.length) : newCount;
    });
  };

  const hasMoreItems = cLogData && visibleItemCount < cLogData.length;

  // C-log 아이템 애니메이션 variants
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

  // 디버깅을 위한 console.log 추가 (임시)
  // console.log('CLogList Debug:', {
  //   cLogDataLength: cLogData?.length,
  //   visibleItemCount,
  //   itemsPerPage,
  //   hasMoreItems,
  // });

  if (isLoading) {
    return (
      <div className={c.cLogList}>
        <div className={c.loadingState}>
          {' '}
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    let errorMessage = 'C-log 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={c.cLogList}>
        <div className={c.error}>
          {errorMessage}
          <div className={c.loadMoreWrapper}>
            {' '}
            {/* wrapper는 유지 */}
            <Button onClick={handleLoadMore} className="load-more__button" icon="arrow-down">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={c.cLogList}>
      {' '}
      {/* viewMode prop에 따라 클래스 추가 가능 */}
      <div className={`detail-inner`}>
        {cLogData && cLogData.length > 0 ? (
          <>
            {/* viewMode prop에 따라 c.list--grid 또는 c.list--list 클래스 추가 */}
            <ul className={`${c[`list--${_viewMode}`]}`}>
              {cLogData.slice(0, visibleItemCount).map((item, index) => (
                <motion.li
                  key={item.id}
                  className={c.list__item}
                  data-prefetch-href={item.link || '#'}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '100px' }}
                  variants={itemVariants}
                >
                  <Link
                    href={item.link || '#'}
                    className={c.list__link}
                    prefetch={true}
                    onMouseEnter={() => handleMouseEnter(item.link || '#')}
                    onTouchStart={() => handleTouchStart(item.link || '#')}
                  >
                    {item.imageUrl && (
                      <ImageWithTheme
                        src={item.imageUrl}
                        alt={item.imageAlt || 'C-log 이미지'}
                        width={500}
                        height={300}
                        className={c.list__image}
                        priority={index < 2} // 처음 2개 이미지는 우선 로드
                        loading={index < 2 ? undefined : 'lazy'}
                      />
                    )}
                    <div className={c.list__content}>
                      <h3 className={c.list__title}>{item.title}</h3>
                      {item.description && <p>{item.description}</p>}
                      <div className={c.list__info}>
                        {item.category && <span className={c.list__category}>{item.category}</span>}
                        {item.date && <span className={c.list__date}>{item.date}</span>}
                      </div>
                      <div className={c.list__tag}>
                        {item.tags &&
                          item.tags.map((tag) => (
                            <span key={tag} className={c.list__tagItem}>
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
            {hasMoreItems && (
              <div className="load-more__wrapper">
                <Button
                  type="button"
                  onClick={handleLoadMore}
                  className="load-more__button"
                  icon="arrow-down"
                >
                  더보기
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className={c.emptyMessage}>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
