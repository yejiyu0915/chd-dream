'use client';

import { useState, useEffect } from 'react';
import Icon from '@/common/components/utils/Icons';

export default function ShareButton() {
  const [isSupported, setIsSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // Web Share API 지원 여부 확인 (주로 모바일 브라우저에서 지원)
    setIsSupported(!!navigator.share);
  }, []);

  // 공유하기 핸들러
  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('공유 실패:', error);
          setStatusMessage('공유를 완료하지 못했습니다. 잠시 후 다시 눌러 주세요.');
          window.setTimeout(() => setStatusMessage(null), 4000);
        }
      }
    }
  };

  // Web Share API 미지원 시 버튼 렌더링 안 함
  if (!isSupported) {
    return null;
  }

  return (
    <span className="share-button__wrap">
      <button type="button" className="share-button" onClick={handleShare} aria-label="페이지 공유하기">
        <Icon name="share" />
      </button>
      {statusMessage ? (
        <span className="share-button__status" role="status">
          {statusMessage}
        </span>
      ) : null}
    </span>
  );
}
