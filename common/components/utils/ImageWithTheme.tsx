'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getClientSeason } from '@/common/utils/season';

interface ImageWithThemeProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

/**
 * 테마에 반응하는 이미지 컴포넌트
 * default 이미지인 경우 현재 테마(계절)에 맞는 이미지로 자동 변경
 */
export default function ImageWithTheme({
  src,
  alt,
  width,
  height,
  className,
  priority,
  loading,
  sizes,
}: ImageWithThemeProps) {
  // 클라이언트에서 현재 테마에 맞는 이미지 URL 계산
  const [finalSrc, setFinalSrc] = useState(src);

  useEffect(() => {
    // src가 default 이미지 패턴인지 확인 (/images/title/{season}/info.jpg)
    const isDefaultImage = /\/images\/title\/(spring|summer|autumn|winter)\/info\.jpg/.test(src);
    
    if (isDefaultImage) {
      // 현재 테마에 맞는 계절로 이미지 URL 업데이트
      const currentSeason = getClientSeason();
      setFinalSrc(`/images/title/${currentSeason}/info.jpg`);
    }
  }, [src]);

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      sizes={sizes}
    />
  );
}

