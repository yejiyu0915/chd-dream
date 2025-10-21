'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 페이지 제목 상태를 관리하는 컨텍스트 타입 정의
interface PageTitleContextType {
  currentPageTitle: string;
  setPageTitle: (title: string) => void;
}

// 컨텍스트 생성
const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

// 컨텍스트 프로바이더 컴포넌트
interface PageTitleProviderProps {
  children: ReactNode;
}

export function PageTitleProvider({ children }: PageTitleProviderProps) {
  const [currentPageTitle, setCurrentPageTitle] = useState<string>('예배');

  const setPageTitle = (title: string) => {
    setCurrentPageTitle(title);
  };

  return (
    <PageTitleContext.Provider value={{ currentPageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

// 컨텍스트를 사용하는 커스텀 훅
export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
}
