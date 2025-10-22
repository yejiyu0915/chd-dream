import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // 스피너 크기 조절 (small, medium, large)
  color?: string; // 스피너 색상 (CSS 색상 값)
  className?: string; // 추가 클래스명
}

export default function Spinner({
  size = 'md',
  color = 'var(--accent-brand)',
  className = '',
}: SpinnerProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const sizeMap = {
    sm: '20px',
    md: '40px',
    lg: '60px',
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  // CSS 변수로 스타일 전달
  const spinnerVars: React.CSSProperties = {
    '--spinner-size': spinnerSize,
    '--spinner-color': color,
  } as React.CSSProperties; // 타입 단언으로 Custom Property 허용

  return (
    <div className={`spinner-wrapper ${className}`} style={spinnerVars}>
      <div className="spinner-dot spinner-dot-1"></div>
      <div className="spinner-dot spinner-dot-2"></div>
      <div className="spinner-dot spinner-dot-3"></div>
    </div>
  );
}
