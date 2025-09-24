'use client';

import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';

// 범용적인 이전/다음 포스트 타입 정의
interface PostItem {
  title: string;
  slug: string;
}

interface ListNavButtonsProps {
  prevPost: PostItem | null;
  nextPost: PostItem | null;
  basePath: string; // 기본 경로 (예: '/info/c-log' 또는 '/info/news')
}

export default function ListNavButtons({ prevPost, nextPost, basePath }: ListNavButtonsProps) {
  return (
    <div className="list-nav-buttons">
      {prevPost ? (
        <Link href={`${basePath}/${prevPost.slug}`} className="list-nav-link">
          <Icon name="arrow-up" />
          이전글: <span className="list-nav-link__title">{prevPost.title}</span>
        </Link>
      ) : (
        ''
      )}
      {nextPost ? (
        <Link href={`${basePath}/${nextPost.slug}`} className="list-nav-link">
          <Icon name="arrow-down" />
          다음글: <span className="list-nav-link__title">{nextPost.title}</span>
        </Link>
      ) : (
        ''
      )}
    </div>
  );
}
