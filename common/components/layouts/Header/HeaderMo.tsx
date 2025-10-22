'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import { menuData, snsLinks, prevLinks } from '@/common/data/info';

interface HeaderMoProps {
  isScrolled: boolean;
}

export default function HeaderMo({ isScrolled }: HeaderMoProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const scrollYRef = useRef(0);

  const { isMobileMenuOpen, toggleMobileMenu, stopLenis, startLenis } = useMobileMenu();
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // 스크롤 위치 저장
      scrollYRef.current = window.scrollY;

      // body에 스크롤 위치를 data 속성으로 저장
      document.body.setAttribute('data-scroll-y', scrollYRef.current.toString());

      // 메뉴 열릴 때 무조건 스크롤 상태 유지 (플리커 방지)
      document.body.style.setProperty('top', `-${scrollYRef.current}px`, 'important');
      document.body.classList.add('mobile-menu-open');
      stopLenis();
    } else {
      // 저장된 스크롤 위치 복원
      const savedScrollY = document.body.getAttribute('data-scroll-y');
      const scrollY = savedScrollY ? parseInt(savedScrollY, 10) : scrollYRef.current;

      // body 스타일 초기화
      document.body.style.removeProperty('top');
      document.body.classList.remove('mobile-menu-open');
      document.body.removeAttribute('data-scroll-y');

      // 다음 프레임에서 스크롤 복원 (DOM 업데이트 후)
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        startLenis();
      });
    }
  }, [isMobileMenuOpen, stopLenis, startLenis]);

  const handleMobileMenuClick = (menuName: string) => {
    setActiveMobileMenu(activeMobileMenu === menuName ? null : menuName);
  };

  return (
    <div
      className={`${h.mobileMenuOverlay} ${isMobileMenuOpen ? h.open : ''} ${isMobileMenuOpen || isScrolled ? h.scroll : ''}`}
    >
      <div className={h.mobileMenuContent} data-lenis-prevent>
        <nav className={h.mobileNav}>
          <ul className={h.mobileMenuList}>
            {menuData.map((menuItem, index) => (
              <li key={index} className={h.mobileMenuItem}>
                <button
                  type="button"
                  className={`${h.mobileMenuButton} ${activeMobileMenu === menuItem.name ? h.active : ''}`}
                  onClick={() => handleMobileMenuClick(menuItem.name)}
                >
                  <span>{menuItem.name}</span>
                  <Icon name="accordion" className={h.mobileMenuIcon} />
                </button>

                {menuItem.subMenu && (
                  <div
                    className={`${h.mobileSubMenu} ${activeMobileMenu === menuItem.name ? h.show : ''}`}
                  >
                    <div className={h.mobileSubMenuContent}>
                      <div className={h.mobileSubMenuTop}>
                        <ul className={h.mobileSubMenuList}>
                          {menuItem.subMenu.map((subItem, subIndex) => (
                            <li key={subIndex} className={h.mobileSubMenuItem}>
                              <Link
                                href={subItem.href}
                                className={h.mobileSubMenuLink}
                                onClick={toggleMobileMenu}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={h.mobileSubMenuBottom}>
                        <div className={h.mobileSubMenuVisual}>
                          <div className={h.mobileVisualImage} style={{ position: 'relative' }}>
                            <Image
                              src={`/common/gnb-${index + 1}.jpg`}
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
                          <div className={h.mobileVisualContent}>
                            <p>
                              {menuItem.content?.description || '하나님의 사랑으로 함께하는 교회'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className={h.mobileSns}>
            <ul className={h.mobileSnsList}>
              {snsLinks.map((snsLink, index) => (
                <li key={index} className={h.mobileSnsItem}>
                  <Link href={snsLink.href} className={h.mobileSnsLink} target="_blank">
                    <span className="sr-only">{snsLink.name}</span>{' '}
                    <Icon name={snsLink.icon} className={h.mobileSnsIcon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={h.mobilePrevLinks}>
            {prevLinks.map((prevInfo, index) => (
              <div key={index} className={h.mobilePrevGroup}>
                <div className={h.mobilePrevRow}>
                  <h4 className={h.mobilePrevTitle}>{prevInfo.name}</h4>
                  <ul className={h.mobilePrevList}>
                    {prevInfo.links.map((link, linkIndex) => (
                      <li key={linkIndex} className={h.mobilePrevItem}>
                        <Link
                          href={link.href}
                          className={h.mobilePrevLink}
                          target="_blank"
                          title={`${link.name} 바로가기`}
                        >
                          <span className="sr-only">{link.name}</span>
                          <Icon name={link.icon} className={h.mobilePrevIcon} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
