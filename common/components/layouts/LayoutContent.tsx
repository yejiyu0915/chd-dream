'use client'; // 클라이언트 컴포넌트 지시문

import React from 'react';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import SmoothScroll from '@/common/components/utils/SmoothScroll';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { setLenisInstance } = useMobileMenu(); // MobileMenuContext에서 setLenisInstance 가져오기
  return (
    <SmoothScroll setLenisInstance={setLenisInstance}>
      {' '}
      // SmoothScroll 컴포넌트 다시 활성화 {/* setLenisInstance prop 전달 */}
      <div className="wrapper">
        <Header />
        {children}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
