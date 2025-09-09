'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis'; // Lenis 타입 임포트

interface MobileMenuContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  lenisInstance: Lenis | null; // Lenis 인스턴스 추가
  setLenisInstance: (lenis: Lenis | null) => void; // Lenis 인스턴스 설정 함수 추가
  stopLenis: () => void; // Lenis 스크롤 중지 함수 추가
  startLenis: () => void; // Lenis 스크롤 시작 함수 추가
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null); // Lenis 인스턴스 상태 추가

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Lenis 스크롤 중지 함수
  const stopLenis = () => {
    lenisInstance?.stop();
  };

  // Lenis 스크롤 시작 함수
  const startLenis = () => {
    lenisInstance?.start();
  };

  return (
    <MobileMenuContext.Provider
      value={{
        isMobileMenuOpen,
        toggleMobileMenu,
        lenisInstance,
        setLenisInstance,
        stopLenis,
        startLenis,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
}
