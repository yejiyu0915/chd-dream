'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { historyData } from './historyData';
import h from './history.module.scss';

export default function HistoryPage() {
  const [activeSection, setActiveSection] = useState<string>(historyData[0]?.id || '');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const sidebarRef = useRef<HTMLElement>(null); // sidebar 참조
  const isClickScrolling = useRef(false); // 클릭으로 스크롤 중인지 플래그
  const clickedSection = useRef<string | null>(null); // 클릭된 섹션 ID

  // activeSection 자동 추적 (스크롤 위치 기반)
  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      // 클릭으로 스크롤 중에는 감지 로직 실행 안 함
      if (isClickScrolling.current) {
        ticking = false;
        return;
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // 반응형 triggerPoint 계산 (모든 값 정수로 반올림)
      let triggerPoint: number;

      if (windowWidth <= 768) {
        // 모바일: sidebar 하단 기준
        if (sidebarRef.current) {
          const sidebarRect = sidebarRef.current.getBoundingClientRect();
          triggerPoint = Math.round(scrollTop + sidebarRect.bottom);
        } else {
          triggerPoint = Math.round(scrollTop + windowHeight * 0.25);
        }
      } else {
        // 데스크톱/태블릿: 화면 상단 1/3 지점
        triggerPoint = Math.round(scrollTop + windowHeight / 3);
      }

      // 각 섹션의 위치를 확인하여 현재 보이는 섹션 찾기
      let currentSection = historyData[0]?.id || '';

      sectionRefs.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        const elementTop = Math.round(rect.top + scrollTop);

        // 모바일: 섹션 시작점 - 80 (여백 절반) 지점에서 전환
        // PC: 섹션 시작점 기준
        const sectionTriggerPoint = windowWidth <= 768 ? elementTop - 80 : elementTop;

        if (sectionTriggerPoint <= triggerPoint) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    // 초기 실행
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  // 섹션 ref 등록
  const setSectionRef = (id: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(id, element);
    } else {
      sectionRefs.current.delete(id);
    }
  };

  // 타임라인 클릭 시 해당 섹션으로 스크롤
  const handleTimelineClick = (sectionId: string) => {
    const section = sectionRefs.current.get(sectionId);
    if (!section) return;

    // 클릭 플래그 설정 및 섹션 즉시 활성화
    isClickScrolling.current = true;
    clickedSection.current = sectionId;
    setActiveSection(sectionId);

    // sidebar 리렌더링 후 스크롤 계산
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const windowWidth = window.innerWidth;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const sectionTop = section.getBoundingClientRect().top + scrollTop;

        let offset: number;

        if (windowWidth <= 768) {
          // 모바일: sidebar 하단 + 섹션 여백 절반(80)
          if (sidebarRef.current) {
            const sidebarRect = sidebarRef.current.getBoundingClientRect();
            // 섹션 시작 - 80(여백 절반) 지점이 sidebar 하단에 오도록
            offset = sidebarRect.bottom + 80;
          } else {
            offset = 250; // fallback
          }
        } else {
          // PC: 헤더 + 타임라인 높이
          offset = 200;
        }

        const targetScroll = sectionTop - offset;
        window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });

        // 스크롤 완료 후 플래그 해제 (1초 후)
        setTimeout(() => {
          isClickScrolling.current = false;
          clickedSection.current = null;
        }, 1000);
      });
    });
  };

  // 날짜 포맷팅 함수
  const formatDate = (year: number, month: number, day: number): string => {
    if (!month && !day) return `${year}`;
    if (!day) return `${year}.${String(month).padStart(2, '0')}`;
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  };

  // Sidebar 컨텐츠 memoization (activeSection이 변경될 때만 재계산)
  const activeSectionData = useMemo(() => {
    return historyData.find((group) => group.id === activeSection);
  }, [activeSection]);

  return (
    <section className={h.historyPage}>
      {/* 상단 타임라인 네비게이션 */}
      <nav className={h.timeline}>
        {historyData.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`${h.timeline__item} ${activeSection === group.id ? h.active : ''}`}
            onClick={() => handleTimelineClick(group.id)}
            aria-label={`${group.period} 섹션으로 이동`}
          >
            <span className={h.timeline__year}>{group.startYear} ~</span>
            {group.periodLabel && <span className={h.timeline__label}>{group.periodLabel}</span>}
          </button>
        ))}
      </nav>

      <div className="detail-inner">
        <div className={h.history}>
          {/* 왼쪽 사이드바 */}
          <aside className={h.sidebar} ref={sidebarRef}>
            {activeSectionData && (
              <div className={h.sidebarContent} key={activeSection}>
                <header className={h.periodHeader}>
                  <div className={h.periodHeader__period}>{activeSectionData.period}</div>
                  {activeSectionData.periodLabel && (
                    <div className={h.periodHeader__label}>{activeSectionData.periodLabel}</div>
                  )}
                  {activeSectionData.mainTitle && (
                    <h3 className={h.periodHeader__title}>{activeSectionData.mainTitle}</h3>
                  )}
                </header>

                {/* 이미지 (있을 경우만 표시) */}
                {activeSectionData.image && (
                  <figure className={h.periodImage}>
                    <Image
                      src={activeSectionData.image}
                      alt={activeSectionData.mainTitle || activeSectionData.period}
                      width={480}
                      height={360}
                      className={h.periodImage__img}
                    />
                    {activeSectionData.imageCaption && (
                      <figcaption className={h.periodImage__caption}>
                        {activeSectionData.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            )}
          </aside>

          {/* 중앙: 구분선 */}
          <div className={h.divider} aria-hidden="true" />

          {/* 오른쪽: 전체 연혁 리스트 */}
          <div className={h.main}>
            {historyData.map((group) => (
              <section
                key={group.id}
                ref={(el) => setSectionRef(group.id, el)}
                className={h.section}
                data-section-id={group.id}
              >
                <ul className={h.list}>
                  {group.items.map((item, index) => (
                    <li key={index} className={h.list__item}>
                      <time
                        className={h.list__date}
                        dateTime={`${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`}
                      >
                        {formatDate(item.year, item.month, item.day)}
                      </time>
                      <div className={h.list__content}>
                        <p className={h.list__title}>{item.title}</p>
                        {/* 2depth 항목들 */}
                        {item.subItems && item.subItems.length > 0 && (
                          <ul className={h.list__subItems}>
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className={h.list__subItem}>
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
