'use client';

import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';

export default function NotFound() {
  return (
    <div className="not-found-container inner">
      <h1 className="not-found-title">
        <Icon name="info" className="not-found-icon" />
        404
      </h1>
      <h2 className="not-found-subtitle">페이지를 찾을 수 없습니다.</h2>
      <p className="not-found-message">
        요청하신 페이지를 찾을 수 없거나 삭제되었습니다. <br />
        아래 버튼을 눌러 메인 페이지로 이동해주세요.
      </p>
      <Link href="/" className="not-found-link">
        메인으로 돌아가기 <Icon name="arrow-up-right" />
      </Link>
    </div>
  );
}
