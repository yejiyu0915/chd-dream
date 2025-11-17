'use client';

import React, { ButtonHTMLAttributes, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/common/components/utils/Icons';
import Link from 'next/link'; // Link 컴포넌트 임포트

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: string; // 선택적으로 아이콘 이름을 받을 수 있도록 추가
  iconPosition?: 'left' | 'right'; // 아이콘 위치 (기본값: right)
  href?: string; // Link 컴포넌트를 위한 href 속성 추가
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'footer-button'; // 버튼 스타일 분기 처리
  disableAnimation?: boolean; // 애니메이션 비활성화 옵션
}

export default function Button({
  children,
  icon,
  iconPosition = 'right',
  className = '',
  href,
  variant = 'primary',
  disableAnimation = false,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const baseClasses = `button--base ${className}`;

  const getVariantClasses = (buttonVariant: string) => {
    switch (buttonVariant) {
      case 'primary':
        return 'button--primary';
      case 'secondary':
        return 'button--secondary';
      case 'ghost':
        return 'button--ghost';
      case 'link':
        return 'button--link';
      case 'footer-button': // 새로운 variant 추가
        return 'footer-button';
      default:
        return '';
    }
  };

  const variantClasses = getVariantClasses(variant);
  const allClasses = `${baseClasses} ${variantClasses}`.trim();

  // Magnetic 효과: 마우스 위치에 따라 버튼이 살짝 끌려감
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disableAnimation || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // 이동 강도 조절 (0.3 = 30% 이동)
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    if (!disableAnimation) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && <Icon name={icon} />}
      <span className="button__text">{children}</span>
      {icon && iconPosition === 'right' && <Icon name={icon} />}
    </>
  );

  if (href) {
    // Link 버튼도 Magnetic 효과 적용
    if (!disableAnimation) {
      return (
        <motion.div
          ref={linkRef}
          style={{ display: 'inline-block' }}
          animate={{
            x: position.x,
            y: position.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 15,
            mass: 0.1,
          }}
          onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
            if (linkRef.current) {
              const rect = linkRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              setPosition({ x: x * 0.3, y: y * 0.3 });
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={href}
            className={allClasses}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {buttonContent}
          </Link>
        </motion.div>
      );
    }

    // 애니메이션 비활성화된 Link
    return (
      <Link
        href={href}
        className={allClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {buttonContent}
      </Link>
    );
  }

  // 애니메이션이 비활성화된 경우 일반 버튼으로
  if (disableAnimation) {
    return (
      <button className={allClasses} {...props}>
        {buttonContent}
      </button>
    );
  }

  // props에서 motion과 충돌하는 속성들 제거
  const { onDrag, onDragStart, onDragEnd, ...buttonProps } = props as any;

  // Magnetic 애니메이션 버튼
  return (
    <motion.button
      ref={buttonRef}
      className={allClasses}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }} // 클릭 시 살짝 작아지는 효과
      {...buttonProps}
    >
      {buttonContent}
    </motion.button>
  );
}
