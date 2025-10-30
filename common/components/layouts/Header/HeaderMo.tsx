'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import { menuData, snsLinks, prevLinks } from '@/common/data/info';

interface HeaderMoProps {
  isScrolled: boolean;
}

export default function HeaderMo({ isScrolled }: HeaderMoProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const pathname = usePathname();

  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();
  const [activeMobileMenu, setActiveMobileMenu] = useState<string[]>([]); // 배열로 변경 (여러 개 열기 가능)

  // pathname 변경 시 메뉴 닫기
  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      setActiveMobileMenu([]); // 서브메뉴도 모두 닫기
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 모바일 메뉴 열림/닫힘에 따른 body 스크롤 제어
  useEffect(() => {
    if (isMobileMenuOpen) {
      // 메뉴 열릴 때 body 스크롤 차단
      document.body.classList.add('mobile-menu-open');
    } else {
      // 메뉴 닫힐 때 body 스크롤 복원
      document.body.classList.remove('mobile-menu-open');
    }
  }, [isMobileMenuOpen]);

  const handleMobileMenuClick = (menuName: string) => {
    const isOpen = activeMobileMenu.includes(menuName);

    // 토글: 열려있으면 닫고, 닫혀있으면 열기
    if (isOpen) {
      setActiveMobileMenu(activeMobileMenu.filter((name) => name !== menuName));
    } else {
      setActiveMobileMenu([...activeMobileMenu, menuName]);
    }
  };

  return (
    <div
      className={`${h.mobileMenuOverlay} ${isMobileMenuOpen ? h.open : ''} ${isMobileMenuOpen || isScrolled ? h.scroll : ''}`}
    >
      <div className={h.mobileMenuContent}>
        <nav className={h.mobileNav}>
          <ul className={h.mobileMenuList}>
            {menuData.map((menuItem, index) => (
              <li key={index} className={h.mobileMenuItem}>
                <button
                  type="button"
                  className={`${h.mobileMenuButton} ${activeMobileMenu.includes(menuItem.name) ? h.active : ''}`}
                  onClick={() => handleMobileMenuClick(menuItem.name)}
                >
                  <span>{menuItem.name}</span>
                  <Icon name="accordion" className={h.mobileMenuIcon} />
                </button>

                {menuItem.subMenu && (
                  <div
                    className={`${h.mobileSubMenu} ${activeMobileMenu.includes(menuItem.name) ? h.show : ''}`}
                  >
                    <div className={h.mobileSubMenuContent}>
                      <div className={h.mobileSubMenuTop}>
                        <ul className={h.mobileSubMenuList}>
                          {menuItem.subMenu.map((subItem, subIndex) => (
                            <li key={subIndex} className={h.mobileSubMenuItem}>
                              <Link
                                href={subItem.href}
                                className={h.mobileSubMenuLink}
                                onClick={(e) => {
                                  // 같은 페이지 링크인 경우 메뉴 닫기
                                  if (pathname === subItem.href) {
                                    e.preventDefault();
                                    closeMobileMenu();
                                    setActiveMobileMenu([]);
                                  }
                                }}
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
