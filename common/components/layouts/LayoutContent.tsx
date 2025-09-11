'use client';

import React from 'react';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import SmoothScroll from '@/common/components/utils/SmoothScroll';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { setLenisInstance } = useMobileMenu();
  return (
    <SmoothScroll setLenisInstance={setLenisInstance}>
      <div className="wrapper">
        <Header />
        {children}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
