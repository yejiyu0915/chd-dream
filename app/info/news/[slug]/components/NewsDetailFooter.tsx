'use client';

import l from '@/common/styles/mdx/MdxLayout.module.scss';
import { PrevNextNewsPosts } from '@/lib/notion'; // PrevNextNewsPosts 타입 임포트
import Button from '@/common/components/utils/Button'; // Button 컴포넌트 임포트
import ListNavButtons from '@/common/components/utils/ListNavButtons'; // ListNavButtons 컴포넌트 임포트

interface NewsDetailFooterProps {
  prevPost: PrevNextNewsPosts['prev'];
  nextPost: PrevNextNewsPosts['next'];
}

export default function NewsDetailFooter({ prevPost, nextPost }: NewsDetailFooterProps) {
  return (
    <div className={`${l.footer} detail-inner`}>
      {/* 목록으로 돌아가기 버튼 */}
      <div className="footer-button__wrapper">
        <Button href="/info/news" variant="footer-button">
          목록으로
        </Button>
      </div>

      {/* 이전/다음 포스트 네비게이션 */}
      <ListNavButtons prevPost={prevPost} nextPost={nextPost} basePath="/info/news" />
    </div>
  );
}
