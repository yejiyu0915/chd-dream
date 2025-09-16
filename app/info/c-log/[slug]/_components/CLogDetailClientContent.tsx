'use client';

import Link from 'next/link';
// import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'; // MDX 관련 임포트 제거
import styles from '../CLogDetail.module.scss';
// import TableOfContents from './TableOfContents'; // TableOfContents 컴포넌트 임포트 제거
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'; // Notion 블록 타입 임포트

interface CLogDetailClientContentProps {
  // mdxSource: MDXRemoteSerializeResult; // MDX 관련 props 제거
  category: string;
  title: string;
  date: string;
  imageUrl: string; // imageUrl props 추가
  prevPost: { title: string; slug: string } | null;
  nextPost: { title: string; slug: string } | null;
  // toc: any; // MDX 관련 props 제거
  rawContentBlocks: BlockObjectResponse[]; // 원시 블록 데이터 props 추가
}

// Notion 블록을 렌더링하는 헬퍼 함수 (간단화된 버전)
const renderNotionBlock = (block: BlockObjectResponse) => {
  switch (block.type) {
    case 'paragraph':
      // @ts-ignore
      return <p>{block.paragraph.rich_text[0]?.plain_text}</p>;
    case 'heading_1':
      // @ts-ignore
      return <h1>{block.heading_1.rich_text[0]?.plain_text}</h1>;
    case 'heading_2':
      // @ts-ignore
      return <h2>{block.heading_2.rich_text[0]?.plain_text}</h2>;
    case 'heading_3':
      // @ts-ignore
      return <h3>{block.heading_3.rich_text[0]?.plain_text}</h3>;
    case 'bulleted_list_item':
      // @ts-ignore
      return <li>{block.bulleted_list_item.rich_text[0]?.plain_text}</li>;
    case 'numbered_list_item':
      // @ts-ignore
      return <li>{block.numbered_list_item.rich_text[0]?.plain_text}</li>;
    case 'image':
      // @ts-ignore
      const imageUrl =
        block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      // return <img src={imageUrl} alt="Notion Image" style={{ maxWidth: '100%', height: 'auto' }} />;
      return (
        <div
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <img src={imageUrl} alt="Notion Image" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      );
    case 'code':
      // @ts-ignore
      return (
        <pre
          style={{
            backgroundColor: '#f6f8fa',
            padding: '15px',
            borderRadius: '5px',
            overflowX: 'auto',
          }}
        >
          <code style={{ fontSize: '14px' }}>{block.code.rich_text[0]?.plain_text}</code>
        </pre>
      );
    // 다른 블록 타입에 대한 렌더링 로직 추가
    default:
      // console.log('Unhandled block type:', block.type);
      return null;
  }
};

export default function CLogDetailClientContent({
  // mdxSource, // MDX 관련 props 제거
  category,
  title,
  date,
  imageUrl, // imageUrl props 받기
  prevPost,
  nextPost,
  // toc, // MDX 관련 props 제거
  rawContentBlocks, // 원시 블록 데이터 받기
}: CLogDetailClientContentProps) {
  return (
    <div className={styles.clogDetailPage}>
      {/* 타이틀 영역 (이미지 배경 포함) */}
      <div className={styles.titleArea} style={{ backgroundImage: `url(${imageUrl})` }}>
        <h2 className={styles.category}>{category}</h2>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>{date}</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* 목차 (제거됨) */}
        {/* 상세 내용 */}
        <div className={styles.notionContent}>
          {rawContentBlocks.map((block) => renderNotionBlock(block))}
        </div>
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
