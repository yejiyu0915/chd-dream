'use client';

import l from '@/common/styles/mdx/MdxLayout.module.scss';
import { PrevNextNoticePosts } from '@/lib/notion';
import Button from '@/common/components/utils/Button';
import ListNavButtons from '@/common/components/utils/ListNavButtons';

interface NoticeDetailFooterProps {
  prevPost: PrevNextNoticePosts['prev'];
  nextPost: PrevNextNoticePosts['next'];
}

export default function NoticeDetailFooter({ prevPost, nextPost }: NoticeDetailFooterProps) {
  return (
    <div className={`${l.footer} detail-inner`}>
      {/* 목록으로 돌아가기 버튼 */}
      <div className="footer-button-wrapper">
        <Button href="/info/notice" variant="footer-button">
          목록으로
        </Button>
      </div>

      {/* 이전/다음 포스트 네비게이션 */}
      <ListNavButtons prevPost={prevPost} nextPost={nextPost} basePath="/info/notice" />
    </div>
  );
}
