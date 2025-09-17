'use client';

import React, { ButtonHTMLAttributes } from 'react';
import Icon, { IconName } from '@/common/components/utils/Icons';
import Link from 'next/link'; // Link 컴포넌트 임포트

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: IconName; // 선택적으로 아이콘 이름을 받을 수 있도록 추가
  iconPosition?: 'left' | 'right'; // 아이콘 위치 (기본값: right)
  href?: string; // Link 컴포넌트를 위한 href 속성 추가
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'footer-button'; // 버튼 스타일 분기 처리
}

export default function Button({
  children,
  icon,
  iconPosition = 'right',
  className = '',
  href,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const baseClasses = `button-base ${className}`;

  const getVariantClasses = (buttonVariant: string) => {
    switch (buttonVariant) {
      case 'primary':
        return 'button-primary';
      case 'secondary':
        return 'button-secondary';
      case 'ghost':
        return 'button-ghost';
      case 'link':
        return 'button-link';
      case 'footer-button': // 새로운 variant 추가
        return 'footer-button';
      default:
        return '';
    }
  };

  const variantClasses = getVariantClasses(variant);
  const allClasses = `${baseClasses} ${variantClasses}`.trim();

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && <Icon name={icon} />}
      {children}
      {icon && iconPosition === 'right' && <Icon name={icon} />}
    </>
  );

  if (href) {
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

  return (
    <button className={allClasses} {...props}>
      {buttonContent}
    </button>
  );
}
