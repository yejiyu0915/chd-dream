'use client';

import Link from 'next/link';
import l from '@/common/styles/mdx/MdxLayout.module.scss';
import { NotionPage } from '@/lib/notion';
import Icon from '@/common/components/utils/Icons';

interface CLogDetailFooterProps {
  prevPost: NotionPage | null;
  nextPost: NotionPage | null;
}

export default function CLogDetailFooter({ prevPost, nextPost }: CLogDetailFooterProps) {
  return (
    <div className={`${l.footer} detail-inner`}>
      {/* 목록으로 돌아가기 버튼 */}
      <div className={l.buttonWrapper}>
        <Link href="/info/c-log" className={l.button}>
          목록으로
        </Link>
      </div>

      {/* 이전/다음 포스트 네비게이션 */}
      <div className={l.navButtons}>
        {prevPost ? (
          <Link href={`/info/c-log/${prevPost.slug}`} className={`${l.navLink} ${l.navLinkPrev}`}>
            <Icon name="arrow-up" />
            이전글: <span className={l.navLinkTitle}>{prevPost.title}</span>
          </Link>
        ) : (
          ''
        )}
        {nextPost ? (
          <Link href={`/info/c-log/${nextPost.slug}`} className={`${l.navLink} ${l.navLinkNext}`}>
            <Icon name="arrow-down" />
            다음글: <span className={l.navLinkTitle}>{nextPost.title}</span>
          </Link>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
