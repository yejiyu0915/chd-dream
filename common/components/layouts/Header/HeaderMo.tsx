'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/common/components/utils/Icons';
import h from '@/common/components/layouts/Header/Header.module.scss';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import { menuData, snsLinks, prevLinks } from '@/common/data/info';
import MobileSchedulePreview from '@/common/components/layouts/Header/MobileSchedulePreview';
import MobileCLogPreview from '@/common/components/layouts/Header/MobileCLogPreview';

interface HeaderMoProps {
  isScrolled: boolean;
}

export default function HeaderMo({ isScrolled }: HeaderMoProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const pathname = usePathname();

  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null); // 하나만 열리도록 단일 값으로 변경

  // pathname 변경 시 메뉴 닫기
  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      setActiveMobileMenu(null); // 서브메뉴도 모두 닫기
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // activeMobileMenu 변경 시 스타일 초기화 및 높이 계산
  useEffect(() => {
    if (!isMobileMenuOpen) return; // 모바일 메뉴가 닫혀있으면 실행하지 않음

    // 모든 서브메뉴의 인라인 스타일 초기화
    const allSubMenus = document.querySelectorAll(`[data-menu-name]`) as NodeListOf<HTMLElement>;
    allSubMenus.forEach((subMenu) => {
      const menuName = subMenu.getAttribute('data-menu-name');
      if (menuName !== activeMobileMenu) {
        // 닫힌 메뉴는 스타일 초기화
        subMenu.style.maxHeight = '';
      }
    });

    // 열린 메뉴의 실제 높이 계산
    if (activeMobileMenu) {
      requestAnimationFrame(() => {
        const subMenu = document.querySelector(`[data-menu-name="${activeMobileMenu}"]`) as HTMLElement;
        if (subMenu) {
          // CSS 모듈 클래스명을 직접 사용하지 않고 일반 클래스 선택자 사용
          const content = subMenu.querySelector('[class*="mobileSubMenu__content"]') as HTMLElement;
          if (content) {
            // 임시로 높이를 auto로 설정하여 실제 높이 측정
            subMenu.style.maxHeight = 'none';
            const actualHeight = content.scrollHeight;
            // 다시 0으로 리셋 후 실제 높이로 애니메이션
            subMenu.style.maxHeight = '0px';
            // 다음 프레임에서 실제 높이로 설정 (애니메이션 트리거)
            requestAnimationFrame(() => {
              subMenu.style.maxHeight = `${actualHeight}px`;
            });
          }
        }
      });
    }
  }, [activeMobileMenu, isMobileMenuOpen]);

  // 모바일 메뉴 열림/닫힘에 따른 body 스크롤 제어 및 아코디언 초기화
  useEffect(() => {
    if (isMobileMenuOpen) {
      // 메뉴 열릴 때 body 스크롤 차단
      document.body.classList.add('mobile-menu-open');
      // 메뉴가 열릴 때는 상태를 유지 (사용자가 클릭하기 전까지)
    } else {
      // 메뉴 닫힐 때 body 스크롤 복원 및 아코디언 상태 초기화
      document.body.classList.remove('mobile-menu-open');
      setActiveMobileMenu(null);
      // 모든 서브메뉴의 인라인 스타일도 초기화
      const allSubMenus = document.querySelectorAll(`[data-menu-name]`) as NodeListOf<HTMLElement>;
      allSubMenus.forEach((subMenu) => {
        subMenu.style.maxHeight = '';
      });
    }
  }, [isMobileMenuOpen]);

  const handleMobileMenuClick = (menuName: string) => {
    // 하나만 열리도록: 같은 메뉴면 닫고, 다른 메뉴면 기존 닫고 새로 열기
    if (activeMobileMenu === menuName) {
      setActiveMobileMenu(null);
    } else {
      setActiveMobileMenu(menuName);
      // useEffect에서 높이 계산 처리
    }
  };

  return (
    <>
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
                    className={`${h.mobileMenu__button} ${activeMobileMenu === menuItem.name ? h.active : ''}`}
                    onClick={() => handleMobileMenuClick(menuItem.name)}
                  >
                    <span>{menuItem.name}</span>
                    <Icon name="accordion" className={h.mobileMenu__icon} />
                  </button>

                  {menuItem.subMenu && (
                    <div
                      className={`${h.mobileSubMenu} ${activeMobileMenu === menuItem.name ? h.show : ''}`}
                      data-menu-name={menuItem.name}
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
                                      setActiveMobileMenu(null);
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
                {snsLinks
                  .filter((snsLink) => !snsLink.disabled) // 준비중인 SNS는 모바일에서 노출하지 않음
                  .map((snsLink, index) => (
                    <li key={index} className={h.mobileSns__item}>
                      <Link href={snsLink.href} className={h.mobileSns__link} target="_blank">
                        <span className="sr-only">행복으로가는교회 {snsLink.name} 바로가기</span>
                        <Icon name={snsLink.icon} className={h.mobileSns__icon} />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* C-log 미리보기 영역 */}
            <MobileCLogPreview />

            {/* <div className={h.mobilePrev__links}>
              {prevLinks.map((prevInfo, index) => {
                // 활성화된 링크만 필터링
                const activeLinks = prevInfo.links.filter((link) => !link.disabled);

                // 활성화된 링크가 없으면 해당 그룹 자체를 렌더링하지 않음
                if (activeLinks.length === 0) return null;

                return (
                  <div key={index} className={h.mobilePrev__group}>
                    <div className={h.mobilePrev__row}>
                      <p className={h.mobilePrev__title}>{prevInfo.name}</p>
                      <ul className={h.mobilePrev__list}>
                        {activeLinks.map((link, linkIndex) => (
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
                );
              })}
            </div> */}
          </nav>
        </div>
        <div className={h.mobileSchedulePreview__wrapper}>
          <MobileSchedulePreview />
        </div>
      </div>
    </>
  );
}
