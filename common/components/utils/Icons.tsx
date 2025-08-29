'use client';

import React from 'react';

// Icon 컴포넌트 Props 인터페이스
interface IconProps {
  name: string;
  className?: string;
  onClick?: () => void;
}

export default function Icon({ name, className, onClick }: IconProps) {
  return <i className={`icon icon--${name} ${className}`} onClick={onClick} />;
}
