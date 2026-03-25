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
    <main className="not-found__container inner">
      <h1 className="not-found__title">
        <Icon name="info" className="not-found__icon" />
        잠시 문제가 생겼어요
      </h1>
      <p className="not-found__message">
        페이지를 불러오지 못했습니다. <br />
        아래에서 다시 시도하거나 메인으로 이동해 주세요.
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
          className="not-found__link not-found__link--reload"
        >
          다시 시도 <Icon name="arrow-reload" />
        </button>
        <Link href="/" className="not-found__link">
          메인으로 돌아가기 <Icon name="arrow-up-right" />
        </Link>
      </div>
    </main>
  );
}
