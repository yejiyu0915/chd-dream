'use client';

import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import { PrevNextCLogPosts } from '@/lib/notion';

interface ListNavButtonsProps {
  prevPost: PrevNextCLogPosts['prev'];
  nextPost: PrevNextCLogPosts['next'];
}

export default function ListNavButtons({ prevPost, nextPost }: ListNavButtonsProps) {
  return (
    <div className="list-nav-buttons">
      {prevPost ? (
        <Link href={`/info/c-log/${prevPost.slug}`} className="list-nav-link">
          <Icon name="arrow-up" />
          이전글: <span className="list-nav-link__title">{prevPost.title}</span>
        </Link>
      ) : (
        ''
      )}
      {nextPost ? (
        <Link href={`/info/c-log/${nextPost.slug}`} className="list-nav-link">
          <Icon name="arrow-down" />
          다음글: <span className="list-nav-link__title">{nextPost.title}</span>
        </Link>
      ) : (
        ''
      )}
    </div>
  );
}
