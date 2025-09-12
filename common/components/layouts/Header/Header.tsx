'use client';

import HeaderPC from '@/common/components/layouts/Header/HeaderPC';
import HeaderMo from '@/common/components/layouts/Header/HeaderMo';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 200);
    };

    if (pathname !== '/') {
      setIsScrolled(true);
    } else {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (pathname === '/') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pathname]);

  return (
    <>
      <HeaderPC isScrolled={isScrolled} />
      <HeaderMo isScrolled={isScrolled} />
    </>
  );
}
