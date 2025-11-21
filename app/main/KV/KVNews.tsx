'use client';

import kv from '@/app/main/KV/KV.module.scss';
import { NewsItem } from '@/lib/notion';
import { motion } from 'framer-motion';

interface NewsSectionProps {
  initialNewsData: NewsItem[];
}

export default function NewsSection({ initialNewsData }: NewsSectionProps) {
  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const newsData = initialNewsData;
  const isLoading = false;
  const isError = false;

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.9,
      transition: {
        staggerChildren: 0.1, // 각 뉴스 아이템이 0.1초 간격으로 등장
        delayChildren: 0.2, // 제목 나온 후 0.2초 뒤에 시작
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 0.9,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 0.9,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  // 데이터가 아직 없으면서 로딩 중인 경우 (초기 로딩)
  if (isLoading && !newsData) {
    return <div className={kv.news}></div>;
  }

  // 에러 발생 시
  if (isError) {
    return (
      <div className={kv.news}>
        <h2 className={kv.news__title}>NEWS</h2>
        <ul className={kv.news__list}>
          <li>
            <p className={kv.emptyState}>에러: 뉴스 데이터를 가져오는 데 실패했습니다.</p>
          </li>
        </ul>
      </div>
    );
  }

  // 로딩이 완료되었지만 newsData가 비어있거나 없는 경우 (데이터 없음)
  if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
    return (
      <div className={kv.news}>
        <h2 className={kv.news__title}>NEWS</h2>
        <ul className={kv.news__list}>
          <li>
            <p className={kv.emptyState}>최신 뉴스를 불러올 수 없습니다.</p>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <motion.div className={kv.news} initial="hidden" animate="visible" variants={containerVariants}>
      {/* NEWS 제목 - 위에서 살짝 내려오면서 페이드인 */}
      <motion.h2 className={kv.news__title} variants={titleVariants}>
        NEWS
      </motion.h2>

      {/* 뉴스 리스트 - 순차적으로 왼쪽에서 오른쪽으로 등장 */}
      <motion.ul className={kv.news__list} variants={containerVariants}>
        {newsData && Array.isArray(newsData) && newsData.length > 0 ? (
          newsData.map((newsItem: NewsItem) => (
            <motion.li key={newsItem.id} variants={itemVariants}>
              <a href={`/info/news/${newsItem.slug}`} className={kv.news__link}>
                <h3 className={kv.news__listTitle}>{newsItem.title}</h3>
                <p className={kv.news__listDate}>{newsItem.date}</p>
              </a>
            </motion.li>
          ))
        ) : (
          <li>
            <p className={kv.emptyState}>최신 뉴스를 불러올 수 없습니다.</p>
          </li>
        )}
      </motion.ul>
    </motion.div>
  );
}
