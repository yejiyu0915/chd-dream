'use client';

import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import styles from '../CLogDetail.module.scss';

interface CLogDetailClientContentProps {
  mdxSource: MDXRemoteSerializeResult;
  category: string;
  title: string;
  date: string;
  imageUrl: string; // imageUrl props 추가
  prevPost: { title: string; slug: string } | null;
  nextPost: { title: string; slug: string } | null;
}

export default function CLogDetailClientContent({
  mdxSource,
  category,
  title,
  date,
  imageUrl, // imageUrl props 받기
  prevPost,
  nextPost,
}: CLogDetailClientContentProps) {
  return (
    <div className={styles.clogDetailPage}>
      {/* 타이틀 영역 (이미지 배경 포함) */}
      <div className={styles.titleArea} style={{ backgroundImage: `url(${imageUrl})` }}>
        <h2 className={styles.category}>{category}</h2>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>{date}</p>
      </div>

      {/* 상세 내용 */}
      <div className={styles.notionContent}>
        <MDXRemote {...mdxSource} />
      </div>

      {/* 목록으로 가는 버튼 */}
      <div className={styles.listButtonWrapper}>
        <Link href="/info/c-log" className={styles.listButton}>
          목록으로
        </Link>
      </div>

      {/* 이전/다음글 내비게이션 */}
      <div className={styles.prevNextNavigation}>
        {prevPost ? (
          <Link
            href={`/info/c-log/${prevPost.slug}`}
            className={`${styles.navButton} ${styles.prevPost}`}
          >
            <span>이전글:</span> {prevPost.title}
          </Link>
        ) : (
          <span className={`${styles.navButton} ${styles.prevPost} ${styles.disabled}`}>
            이전글 없음
          </span>
        )}
        {nextPost ? (
          <Link
            href={`/info/c-log/${nextPost.slug}`}
            className={`${styles.navButton} ${styles.nextPost}`}
          >
            <span>다음글:</span> {nextPost.title}
          </Link>
        ) : (
          <span className={`${styles.navButton} ${styles.nextPost} ${styles.disabled}`}>
            다음글 없음
          </span>
        )}
      </div>
    </div>
  );
}
