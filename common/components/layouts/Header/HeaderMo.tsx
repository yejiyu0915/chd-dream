'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import { MenuItem, menuData, SnsLink, snsLinks } from '@/common/data/info';

export default function HeaderMo() {
  const scrollYRef = useRef(0);

  const { isMobileMenuOpen, toggleMobileMenu, stopLenis, startLenis } = useMobileMenu();
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      scrollYRef.current = window.scrollY;
      document.body.classList.add('mobile-menu-open');
      stopLenis();
    } else {
      const currentScrollY = scrollYRef.current;
      document.body.classList.remove('mobile-menu-open');
      window.scrollTo(0, currentScrollY);
      startLenis();
    }
  }, [isMobileMenuOpen]);

  const handleMobileMenuClick = (menuName: string) => {
    setActiveMobileMenu(activeMobileMenu === menuName ? null : menuName);
  };

  return (
    <div className={`${h.mobileMenuOverlay} ${isMobileMenuOpen ? h.open : ''}`}>
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
        </nav>

        <div className={h.mobileSns}>
          <ul className={h.mobileSnsList}>
            {snsLinks.map((snsLink, index) => (
              <li key={index} className={h.mobileSnsItem}>
                <Link href={snsLink.href} className={h.mobileSnsLink}>
                  <span className="sr-only">{snsLink.name}</span>{' '}
                  <Icon name={snsLink.icon} className={h.mobileSnsIcon} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
