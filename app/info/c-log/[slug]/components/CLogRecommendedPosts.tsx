'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { CLogItem } from '@/lib/notion';
import ImageWithTheme from '@/common/components/utils/ImageWithTheme';
import s from '@/app/info/c-log/[slug]/CLogRecommendedPosts.module.scss';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface CLogRecommendedPostsProps {
  currentPost: {
    id: string;
    category: string;
    tags: string[];
    slug: string;
  };
  allPosts: CLogItem[];
}

/**
 * 추천글 필터링 및 정렬 함수
 * 우선순위: 1) 카테고리 동일 2) 태그 유사 3) 최신 글 4) 연관 없음
 */
function getRecommendedPosts(
  currentPost: { id: string; category: string; tags: string[]; slug: string },
  allPosts: CLogItem[]
): CLogItem[] {
  // 현재 글 제외
  const filteredPosts = allPosts.filter(
    (post) => post.id !== currentPost.id && post.slug !== currentPost.slug
  );

  if (filteredPosts.length === 0) {
    return [];
  }

  // 1순위: 카테고리 동일한 글
  const sameCategoryPosts = filteredPosts.filter((post) => post.category === currentPost.category);

  // 2순위: 태그가 유사한 글 (최소 1개 이상 공통 태그)
  const similarTagPosts = filteredPosts.filter(
    (post) =>
      post.category !== currentPost.category &&
      post.tags.some((tag) => currentPost.tags.includes(tag))
  );

  // 3순위: 최신 글 (카테고리도 다르고 태그도 다른 글)
  const otherPosts = filteredPosts.filter(
    (post) =>
      post.category !== currentPost.category &&
      !post.tags.some((tag) => currentPost.tags.includes(tag))
  );

  // 각 그룹을 날짜 내림차순으로 정렬
  const sortByDateDesc = (a: CLogItem, b: CLogItem) => {
    const dateA = new Date(a.rawDate || a.date).getTime();
    const dateB = new Date(b.rawDate || b.date).getTime();
    return dateB - dateA; // 내림차순
  };

  sameCategoryPosts.sort(sortByDateDesc);
  similarTagPosts.sort(sortByDateDesc);
  otherPosts.sort(sortByDateDesc);

  // 우선순위에 따라 합치기 (최대 5개)
  const recommended: CLogItem[] = [];

  // 1순위: 카테고리 동일
  recommended.push(...sameCategoryPosts.slice(0, 5 - recommended.length));

  // 2순위: 태그 유사
  if (recommended.length < 5) {
    recommended.push(...similarTagPosts.slice(0, 5 - recommended.length));
  }

  // 3순위: 최신 글
  if (recommended.length < 5) {
    recommended.push(...otherPosts.slice(0, 5 - recommended.length));
  }

  return recommended.slice(0, 5); // 최대 5개만 반환
}

/**
 * C-log 추천글 컴포넌트
 */
export default function CLogRecommendedPosts({ currentPost, allPosts }: CLogRecommendedPostsProps) {
  const recommendedPosts = useMemo(
    () => getRecommendedPosts(currentPost, allPosts),
    [currentPost, allPosts]
  );

  // 추천글이 없으면 렌더링하지 않음
  if (recommendedPosts.length === 0) {
    return null;
  }

  // 섹션 애니메이션 variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  // 그리드 아이템 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.section
      className={s.recommended}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={sectionVariants}
    >
      <div className={`${s.recommended__inner} detail-inner`}>
        <h2 className={s.recommended__title}>추천글</h2>

        {/* PC: 그리드 뷰 (5개 자동 배치, 내비게이션/인디케이터 없음) */}
        <motion.div className={s.recommended__grid} variants={containerVariants}>
          {recommendedPosts.map((post, index) => (
            <motion.div key={post.id} variants={itemVariants} custom={index}>
              <Link href={post.link || `/info/c-log/${post.slug}`} className={s.recommended__item}>
                <div className={s.recommended__imageWrapper}>
                  <ImageWithTheme
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title}
                    width={500}
                    height={300}
                    className={s.recommended__image}
                    loading="lazy"
                  />
                </div>
                <div className={s.recommended__content}>
                  <h3 className={s.recommended__itemTitle}>{post.title}</h3>
                  <div className={s.recommended__date}>{post.date}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 모바일: 슬라이드 뷰 (내비게이션/인디케이터 있음) */}
        <div className={s.recommended__slider}>
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            spaceBetween={16}
            slidesPerView="auto"
            className={s.recommended__swiper}
            breakpoints={{
              0: {
                spaceBetween: 16,
              },
              768: {
                spaceBetween: 20,
              },
            }}
          >
            {recommendedPosts.map((post) => (
              <SwiperSlide key={post.id} className={s.recommended__slide}>
                <Link
                  href={post.link || `/info/c-log/${post.slug}`}
                  className={s.recommended__item}
                >
                  <div className={s.recommended__imageWrapper}>
                    <ImageWithTheme
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      width={500}
                      height={300}
                      className={s.recommended__image}
                      loading="lazy"
                    />
                  </div>
                  <div className={s.recommended__content}>
                    <h3 className={s.recommended__itemTitle}>{post.title}</h3>
                    <div className={s.recommended__date}>{post.date}</div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
}
