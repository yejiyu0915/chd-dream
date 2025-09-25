'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import SmoothScroll from '@/common/components/utils/SmoothScroll';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import PopupModal from '@/common/components/layouts/popup/PopupModal';
import { NewsItem } from '@/lib/notion';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { setLenisInstance, stopLenis, startLenis } = useMobileMenu();
  const [popupNews, setPopupNews] = useState<NewsItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const scrollYRef = useRef(0);

  // 팝업 데이터 가져오기 (News + Notice)
  useEffect(() => {
    const fetchPopupNews = async () => {
      try {
        // 영구적으로 닫힌 상태 확인 (로컬 스토리지)
        const popupPermanentlyClosed = localStorage.getItem('popupNewsPermanentlyClosed');

        if (popupPermanentlyClosed) {
          return; // 영구적으로 닫았다면 표시하지 않음
        }

        // 세션 스토리지에서 팝업 닫힘 상태 확인
        const popupClosed = sessionStorage.getItem('popupNewsClosed');

        if (popupClosed) {
          return; // 이미 팝업을 닫았다면 표시하지 않음
        }

        const response = await fetch('/api/popup-news');

        if (response.ok) {
          const data = await response.json();

          // 데이터가 있고, 빈 객체가 아니며, id가 있는 경우에만 팝업 표시
          if (data && Object.keys(data).length > 0 && data.id) {
            setPopupNews(data);
            setShowPopup(true);
          }
        }
      } catch {
        // 팝업 데이터 가져오기 실패 시 무시
      }
    };

    // 페이지 로드 후 약간의 지연을 두고 팝업 표시
    const timer = setTimeout(fetchPopupNews, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 팝업 상태에 따른 스크롤 제어
  useEffect(() => {
    if (showPopup) {
      // 스크롤 위치 저장 및 Lenis 중지
      scrollYRef.current = window.scrollY;
      stopLenis();

      // body 스크롤 차단
      document.body.classList.add('popup-open');
      document.body.style.top = `-${scrollYRef.current}px`;
    } else {
      // body 스크롤 복원
      document.body.classList.remove('popup-open');
      document.body.style.top = '';

      // 스크롤 위치 복원 및 Lenis 재시작
      const currentScrollY = scrollYRef.current;
      window.scrollTo(0, currentScrollY);
      startLenis();
    }
  }, [showPopup, stopLenis, startLenis]);

  // 팝업 닫기 핸들러
  const handleClosePopup = (dontShowAgain: boolean = false) => {
    setShowPopup(false);

    if (dontShowAgain) {
      // 로컬 스토리지에 영구적으로 저장 (브라우저를 닫아도 유지)
      localStorage.setItem('popupNewsPermanentlyClosed', 'true');
    }
    // X 버튼만 누른 경우(dontShowAgain이 false)에는 세션 처리하지 않음
    // 팝업이 다시 뜰 수 있도록 아무것도 저장하지 않음
  };

  return (
    <SmoothScroll setLenisInstance={setLenisInstance}>
      <div className="wrapper">
        <Header />
        {children}
        <Footer />

        {/* 팝업 모달 */}
        {showPopup && <PopupModal newsItem={popupNews} onClose={handleClosePopup} />}
      </div>
    </SmoothScroll>
  );
}
