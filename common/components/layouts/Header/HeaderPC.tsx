'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import { menuData } from '@/common/data/info';

interface HeaderPCProps {
  isScrolled: boolean;
}

export default function HeaderPC({ isScrolled }: HeaderPCProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // 현재 경로 가져오기

  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  useEffect(() => {
    // 스크롤 로직은 Header.tsx에서 관리하므로 여기서는 제거
    // const handleScroll = () => {
    //   const scrollTop = window.scrollY;
    //   setIsScrolled(scrollTop > 200);
    // };

    // if (pathname !== '/') {
    //   setIsScrolled(true);
    // } else {
    //   handleScroll();
    //   window.addEventListener('scroll', handleScroll);
    // }
    setMounted(true);

    // return () => {
    //   if (pathname === '/') {
    //     window.removeEventListener('scroll', handleScroll);
    //   }
    // };
  }, []); // pathname 의존성 제거

  const handleMenuMouseEnter = (menuName: string) => {
    setActiveMenu(menuName);
    setIsMenuHovered(true);
  };

  const handleMenuMouseLeave = () => {
    setActiveMenu(null);
    setIsMenuHovered(false);
  };

  // 키보드로 메뉴 토글
  const handleMenuKeyDown = (event: React.KeyboardEvent, menuName: string, hasSubMenu: boolean) => {
    if (!hasSubMenu) return;

    // Enter 또는 Space 키로 서브메뉴 토글
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveMenu(activeMenu === menuName ? null : menuName);
      setIsMenuHovered(activeMenu !== menuName);
    }
    
    // ESC 키로 서브메뉴 닫기
    if (event.key === 'Escape') {
      setActiveMenu(null);
      setIsMenuHovered(false);
    }

    // 아래 화살표로 서브메뉴의 첫 번째 항목으로 이동
    if (event.key === 'ArrowDown' && activeMenu === menuName) {
      event.preventDefault();
      const firstSubMenuItem = event.currentTarget.parentElement?.querySelector<HTMLElement>(
        `.${h.subMenu__link}`
      );
      firstSubMenuItem?.focus();
    }
  };

  // 포커스 시 서브메뉴 열기
  const handleMenuFocus = (menuName: string, hasSubMenu: boolean) => {
    if (hasSubMenu) {
      // 다른 메뉴의 서브메뉴가 열려있으면 바로 전환
      setActiveMenu(menuName);
      setIsMenuHovered(true);
    }
  };

  // 메뉴 전체 컨테이너에서 포커스가 벗어날 때만 서브메뉴 닫기
  const handleMenuContainerBlur = (event: React.FocusEvent) => {
    // 포커스가 메뉴 전체(nav)를 벗어났는지 확인
    const currentTarget = event.currentTarget;
    
    // 다음 프레임에서 확인 (포커스 이동이 완료된 후)
    requestAnimationFrame(() => {
      // 포커스가 메뉴 컨테이너 내부에 없으면 모든 서브메뉴 닫기
      if (!currentTarget.contains(document.activeElement)) {
        setActiveMenu(null);
        setIsMenuHovered(false);
      }
    });
  };

  return (
    <header
      className={`${h.header} ${isMenuHovered ? h.hover : ''} ${isMobileMenuOpen || isScrolled ? h.scroll : ''} ${mounted ? h.mounted : ''}`}
    >
      <div className={h.overlay}></div>
      <div className={h.inner}>
        <div className={h.logo} style={{ opacity: mounted ? 1 : 0 }}>
          <Link href="/" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>
            <svg
              width="257"
              height="342"
              viewBox="0 0 257 342"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="행복으로가는교회 로고"
            >
              <title>행복으로가는교회 로고</title>
              <g>
                <path
                  d="M92.08 282.69L91.04 167.42L115.72 128.26C115.72 128.26 119.25 110.36 108.01 117.61L74.12 160.14L75.53 284L92.08 282.69Z"
                  fill="currentColor"
                />
                <path
                  d="M49.79 285.3L49.46 209.55C49.46 209.55 51.9 196.75 67.81 185.25C67.81 185.25 73.05 189.92 71.99 194.2C70.96 198.45 62.86 211.64 62.86 215.46C62.86 219.29 63.9 285.75 63.9 285.75L49.79 285.3Z"
                  fill="currentColor"
                />
                <path
                  d="M166.17 282.69L167.25 167.42L142.52 128.26C142.52 128.26 138.99 110.36 150.31 117.61L184.15 160.14L182.78 284L166.17 282.69Z"
                  fill="currentColor"
                />
                <path
                  d="M208.47 285.3L208.79 209.55C208.79 209.55 206.36 196.75 190.51 185.25C190.51 185.25 185.21 189.92 186.25 194.2C187.3 198.45 195.43 211.64 195.43 215.46C195.43 219.29 194.4 285.75 194.4 285.75L208.47 285.3Z"
                  fill="currentColor"
                />

                <path
                  d="M128.74 341.12C152.56 312.8 185.28 333.38 185.28 333.38L209.9 295.26C210.61 281.31 200.53 292.94 200.53 292.94L181 317.21C161.57 297.51 129.1 320.64 129.1 320.64L128.38 320.96L127.73 320.64C127.73 320.64 95.28 297.51 75.77 317.21L56.33 292.94C56.33 292.94 46.21 281.31 46.91 295.26L71.49 333.38C71.49 333.38 104.59 312.61 128.42 341.48L128.74 341.12Z"
                  fill="currentColor"
                />
                <path
                  d="M121.21 277.62V186.1H99.2V169.93H121.21V139.75H135.32V169.9H155.41V186.1H135.26L135.49 277.62H121.21Z"
                  fill="currentColor"
                />
              </g>
              <g>
                <path
                  d="M47.15 1.28999C47.15 1.28999 47.31 -1.78001 48.44 1.80999C49.49 5.29999 64.74 52.6 54.78 81.18C54.78 81.18 63.86 70.54 61.69 27.71C61.69 27.71 61.85 25.65 62.67 28.2C62.67 28.2 75.97 73.74 65.43 108.98C65.43 108.98 73.83 95.46 74.46 60.08C74.46 60.08 83.54 84.22 78.46 129.59C75.99 151.87 57.26 177.86 57.26 177.86C57.26 177.86 41.08 198.7 36.5 238.32C36.5 238.32 30.3 284.15 57.39 324.97C57.39 324.97 62.96 334.15 73.57 340.06C73.57 340.06 75.3 342.28 67.22 340.06C59.15 337.87 16.69 323.2 3.17997 255.59C3.17997 255.59 -6.31003 204.93 9.39997 161.19C9.39997 161.19 19.58 134.11 29.15 108.54C38.72 83.03 46.34 56.57 47.55 17.31L47.15 1.28999Z"
                  fill="currentColor"
                />
                <path
                  d="M209.01 1.52001C209.01 1.52001 208.85 -1.59 207.77 1.97C206.63 5.5 191.55 52.73 201.55 81.31C201.55 81.31 192.53 70.63 194.54 27.84C194.54 27.84 194.41 25.82 193.56 28.33C193.56 28.33 180.41 73.86 191 109.11C191 109.11 182.59 95.58 181.79 60.18C181.79 60.18 172.81 84.31 177.95 129.62C180.52 151.96 199.3 177.99 199.3 177.99C199.3 177.99 215.53 198.89 220.17 238.52C220.17 238.52 226.44 284.38 199.39 325.11C199.39 325.11 193.9 334.35 183.34 340.2C183.34 340.2 181.61 342.36 189.64 340.2C197.76 338.01 240.18 323.41 253.52 255.86C253.52 255.86 262.94 205.2 247.1 161.47C247.1 161.47 236.87 134.33 227.23 108.78C217.57 83.21 209.94 56.82 208.63 17.45L209.01 1.52001Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <span>행복으로가는교회</span>
          </Link>
        </div>
        <nav 
          className={h.menu} 
          style={{ opacity: mounted ? 1 : 0 }} 
          aria-label="주 메뉴"
          onBlur={handleMenuContainerBlur}
        >
          <ul className={h.menu__list}>
            {menuData.map((menuItem, index) => {
              const hasSubMenu = menuItem.subMenu && menuItem.subMenu.length > 0;
              
              return (
                <li
                  key={index}
                  className={`${h.menu__item} ${activeMenu === menuItem.name ? h.active : ''}`}
                  onMouseEnter={() => handleMenuMouseEnter(menuItem.name)}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  {hasSubMenu ? (
                    <button
                      type="button"
                      className={h.menu__link}
                      onKeyDown={(e) => handleMenuKeyDown(e, menuItem.name, hasSubMenu)}
                      onFocus={() => handleMenuFocus(menuItem.name, hasSubMenu)}
                      aria-expanded={activeMenu === menuItem.name}
                      aria-haspopup="true"
                      aria-label={`${menuItem.name} 메뉴 ${activeMenu === menuItem.name ? '닫기' : '열기'}`}
                    >
                      {menuItem.name}
                    </button>
                  ) : (
                    <Link
                      href={menuItem.href || '#'}
                      className={h.menu__link}
                    >
                      {menuItem.name}
                    </Link>
                  )}
                {menuItem.subMenu && (
                  <div 
                    className={`${h.subMenu} ${activeMenu === menuItem.name ? h.show : ''}`}
                    role="menu"
                    aria-label={`${menuItem.name} 하위 메뉴`}
                  >
                    <div className={h.subMenu__container}>
                      <div className={h.subMenu__content}>
                        <div className={h.subMenu__left}>
                          <div className={h.subMenu__columns}>
                            {(() => {
                              const columns = [];
                              const itemsPerColumn = 3;

                              for (let i = 0; i < menuItem.subMenu.length; i += itemsPerColumn) {
                                const columnItems = menuItem.subMenu.slice(i, i + itemsPerColumn);
                                columns.push(
                                  <ul key={i} className={h.subMenu__list} role="none">
                                    {columnItems.map((subItem, subIndex) => (
                                      <li key={subIndex} className={h.subMenu__item} role="none">
                                        <Link 
                                          href={subItem.href} 
                                          className={h.subMenu__link}
                                          role="menuitem"
                                        >
                                          {subItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                );
                              }

                              return columns;
                            })()}
                          </div>
                        </div>
                        <div className={h.subMenu__right}>
                          <div className={h.subMenu__visual}>
                            <div
                              className={h.subMenu__visualImage}
                              style={{ position: 'relative' }}
                            >
                              <Image
                                src={`/images/common/gnb-${index + 1}.jpg`}
                                alt={`${menuItem.name} 서브메뉴 이미지`}
                                fill
                                style={{
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={false}
                              />
                            </div>
                            <div className={h.subMenu__visualContent}>
                              <p>
                                {menuItem.content?.description || '하나님의 사랑으로 함께하는 교회'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              );
            })}
          </ul>
        </nav>
        <div className={h.util} style={{ opacity: mounted ? 1 : 0 }}>
          <ul>
            <li>
              <Link
                href="/location"
                onClick={(e) => {
                  // 같은 페이지(오시는 길)에서 클릭 시 모바일 메뉴 닫기
                  if (pathname === '/location' && isMobileMenuOpen) {
                    e.preventDefault();
                    closeMobileMenu();
                  }
                }}
              >
                <Icon name="map" className={h.icon} /> <span className="only-pc">오시는 길</span>
              </Link>
            </li>
            <li className={h.mobileMenuToggle}>
              <button
                type="button"
                onClick={toggleMobileMenu}
                className={h.hamburger__button}
                aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={isMobileMenuOpen}
              >
                <Icon name={isMobileMenuOpen ? 'close' : 'hamburger'} className={h.hamburger__icon} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
