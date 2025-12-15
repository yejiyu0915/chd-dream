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
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 후에만 계절별 이미지 적용 (hydration mismatch 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // src가 default 이미지 패턴인지 확인 (/images/title/{season}/info.jpg)
  const isDefaultImage = /\/images\/title\/(spring|summer|autumn|winter)\/info\.jpg/.test(src);

  // 마운트된 후에만 계절에 맞는 이미지로 변경 (서버와 클라이언트 일치)
  const finalSrc = mounted && isDefaultImage ? `/images/title/${getClientSeason()}/info.jpg` : src;

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
