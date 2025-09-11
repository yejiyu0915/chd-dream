'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface MobileMenuContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  lenisInstance: Lenis | null;
  setLenisInstance: (lenis: Lenis | null) => void;
  stopLenis: () => void;
  startLenis: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const stopLenis = () => {
    lenisInstance?.stop();
  };

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
