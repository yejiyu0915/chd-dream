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
      className={`${h.mobileMenu__overlay} ${isMobileMenuOpen ? h.open : ''} ${isMobileMenuOpen || isScrolled ? h.scroll : ''}`}
    >
      <div className={h.mobileMenu__content}>
        <nav className={h.mobileNav} aria-label="모바일 메뉴">
          <ul className={h.mobileMenu__list}>
            {menuData.map((menuItem, index) => (
              <li key={index} className={h.mobileMenu__item}>
                <button
                  type="button"
                  className={`${h.mobileMenu__button} ${activeMobileMenu.includes(menuItem.name) ? h.active : ''}`}
                  onClick={() => handleMobileMenuClick(menuItem.name)}
                >
                  <span>{menuItem.name}</span>
                  <Icon name="accordion" className={h.mobileMenu__icon} />
                </button>

                {menuItem.subMenu && (
                  <div
                    className={`${h.mobileSubMenu} ${activeMobileMenu.includes(menuItem.name) ? h.show : ''}`}
                  >
                    <div className={h.mobileSubMenu__content}>
                      <div className={h.mobileSubMenu__top}>
                        <ul className={h.mobileSubMenu__list}>
                          {menuItem.subMenu.map((subItem, subIndex) => (
                            <li key={subIndex} className={h.mobileSubMenu__item}>
                              <Link
                                href={subItem.href}
                                className={h.mobileSubMenu__link}
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
                      <div className={h.mobileSubMenu__bottom}>
                        <div className={h.mobileSubMenu__visual}>
                          <div
                            className={h.mobileSubMenu__visualImage}
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
                          <div className={h.mobileSubMenu__visualContent}>
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
            <ul className={h.mobileSns__list}>
              {snsLinks.map((snsLink, index) => (
                <li key={index} className={h.mobileSns__item}>
                  <Link href={snsLink.href} className={h.mobileSns__link} target="_blank">
                    <span className="sr-only">행복으로가는교회 {snsLink.name} 바로가기</span>{' '}
                    <Icon name={snsLink.icon} className={h.mobileSns__icon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={h.mobilePrev__links}>
            {prevLinks.map((prevInfo, index) => (
              <div key={index} className={h.mobilePrev__group}>
                <div className={h.mobilePrev__row}>
                  <p className={h.mobilePrev__title}>{prevInfo.name}</p>
                  <ul className={h.mobilePrev__list}>
                    {prevInfo.links.map((link, linkIndex) => (
                      <li key={linkIndex} className={h.mobilePrev__item}>
                        <Link
                          href={link.href}
                          className={h.mobilePrev__link}
                          target="_blank"
                          title={`${prevInfo.name} ${link.name} 바로가기`}
                        >
                          <span className="sr-only">{link.name}</span>
                          <Icon name={link.icon} className={h.mobilePrev__icon} />
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
