'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import { menuData, snsLinks, prevLinks } from '@/common/data/info';

interface HeaderMoProps {
  isScrolled: boolean;
}

export default function HeaderMo({ isScrolled }: HeaderMoProps) {
  const scrollYRef = useRef(0);

  const { isMobileMenuOpen, toggleMobileMenu, stopLenis, startLenis } = useMobileMenu();
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    // console.log('useEffect triggered, isMobileMenuOpen:', isMobileMenuOpen);
    if (isMobileMenuOpen) {
      scrollYRef.current = window.scrollY;
      document.body.classList.add('mobile-menu-open');
      // console.log(
      //   'Class "mobile-menu-open" added to body. Current body classes:',
      //   document.body.classList.value
      // );
      stopLenis();
    } else {
      const currentScrollY = scrollYRef.current;
      document.body.classList.remove('mobile-menu-open');
      // console.log(
      //   'Class "mobile-menu-open" removed from body. Current body classes:',
      //   document.body.classList.value
      // );
      window.scrollTo(0, currentScrollY);
      startLenis();
    }
  }, [isMobileMenuOpen, stopLenis, startLenis]);

  const handleMobileMenuClick = (menuName: string) => {
    setActiveMobileMenu(activeMobileMenu === menuName ? null : menuName);
  };

  return (
    <div
      className={`${h.mobileMenuOverlay} ${isMobileMenuOpen ? h.open : ''} ${isScrolled ? h.scroll : ''}`}
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
                          <div className={h.mobileVisualImage}></div>
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
