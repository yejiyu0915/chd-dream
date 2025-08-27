import React from 'react';

// Icon 컴포넌트 Props 인터페이스
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

// 아이콘 컴포넌트 생성 함수
function createIcon(iconName: string) {
  return function IconComponent({
    size = 24,
    color = 'currentColor',
    className = '',
    onClick,
  }: IconProps) {
    return <i className={`icon icon--${iconName} ${className}`} onClick={onClick} />;
  };
}

// Icon 객체 생성
const Icon = {
  info: createIcon('info'),
  arrowUpRight: createIcon('arrow-up-right'),
  map: createIcon('map'),
  externalLink: createIcon('external-link'),
  bookOpen: createIcon('book-open'),
  book: createIcon('book'),
  phone: createIcon('phone'),
};

export default Icon;
