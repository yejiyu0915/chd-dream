'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 서비스로 에러를 보고할 수 있습니다.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="not-found-container inner">
      <h1 className="not-found-title">
        <Icon name="info" className="not-found-icon" />
        오류 발생
      </h1>
      <h2 className="not-found-subtitle">문제가 발생했습니다.</h2>
      <p className="not-found-message">
        페이지를 로드하는 중 오류가 발생했습니다. <br />
        잠시 후 다시 시도하거나 메인 페이지로 이동해주세요.
      </p>
      <div
        style={{
          display: 'flex',
          gap: '1em',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => reset()} // 에러를 복구하고 다시 시도하는 버튼
          className="not-found-link not-found-link--reload"
        >
          다시 시도 <Icon name="arrow-reload" />
        </button>
        <Link href="/" className="not-found-link">
          메인으로 돌아가기 <Icon name="arrow-up-right" />
        </Link>
      </div>
    </div>
  );
}
