'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PageTitleContextType {
  currentPageTitle: string;
  setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [currentPageTitle, setCurrentPageTitle] = useState<string>('');

  const setPageTitle = (title: string) => {
    setCurrentPageTitle(title);
  };

  return (
    <PageTitleContext.Provider value={{ currentPageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
}
