'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import SmoothScroll from '@/common/components/utils/SmoothScroll';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';
import PopupModal from '@/common/components/layouts/Popup/PopupModal';
import { NewsItem } from '@/lib/notion';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { setLenisInstance, stopLenis, startLenis } = useMobileMenu();
  const [popupNews, setPopupNews] = useState<NewsItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const scrollYRef = useRef(0);

  // 팝업 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchPopupNews = async () => {
      try {
        console.log('🔍 팝업 뉴스 가져오기 시작');

        // 영구적으로 닫힌 상태 확인 (로컬 스토리지)
        const popupPermanentlyClosed = localStorage.getItem('popupNewsPermanentlyClosed');
        console.log('📝 팝업 영구 닫힘 상태:', popupPermanentlyClosed);

        if (popupPermanentlyClosed) {
          console.log('❌ 영구적으로 팝업을 닫았으므로 표시하지 않음');
          return; // 영구적으로 닫았다면 표시하지 않음
        }

        // 세션 스토리지에서 팝업 닫힘 상태 확인
        const popupClosed = sessionStorage.getItem('popupNewsClosed');
        console.log('📝 팝업 임시 닫힘 상태:', popupClosed);

        if (popupClosed) {
          console.log('❌ 이미 팝업을 닫았으므로 표시하지 않음');
          return; // 이미 팝업을 닫았다면 표시하지 않음
        }

        console.log('🌐 API 호출 시작: /api/popup-news');
        const response = await fetch('/api/popup-news');
        console.log('📡 API 응답 상태:', response.status, response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('📊 받은 데이터:', data);

          // 데이터가 있고, 빈 객체가 아니며, id가 있는 경우에만 팝업 표시
          if (data && Object.keys(data).length > 0 && data.id) {
            console.log('✅ 팝업 뉴스 데이터 있음, 팝업 표시');
            setPopupNews(data);
            setShowPopup(true);
          } else {
            console.log('❌ 팝업 뉴스 데이터 없음 또는 빈 객체');
          }
        } else {
          console.log('❌ API 응답 실패:', response.status);
        }
      } catch (error) {
        console.error('💥 팝업 뉴스 가져오기 실패:', error);
      }
    };

    // 페이지 로드 후 약간의 지연을 두고 팝업 표시
    console.log('⏰ 1초 후 팝업 뉴스 가져오기 예약');
    const timer = setTimeout(fetchPopupNews, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 팝업 상태에 따른 스크롤 제어
  useEffect(() => {
    if (showPopup) {
      console.log('🔒 팝업 표시 - 스크롤 차단');
      // 스크롤 위치 저장 및 Lenis 중지
      scrollYRef.current = window.scrollY;
      stopLenis();

      // body 스크롤 차단
      document.body.classList.add('popup-open');
      document.body.style.top = `-${scrollYRef.current}px`;
    } else {
      console.log('🔓 팝업 숨김 - 스크롤 복원');
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
    console.log('🚪 팝업 닫기 버튼 클릭, 다시 보지 않기:', dontShowAgain);
    setShowPopup(false);

    if (dontShowAgain) {
      // 로컬 스토리지에 영구적으로 저장 (브라우저를 닫아도 유지)
      localStorage.setItem('popupNewsPermanentlyClosed', 'true');
      console.log('💾 로컬 스토리지에 영구적으로 팝업 닫힘 상태 저장');
    } else {
      // 세션 스토리지에 임시로 저장 (브라우저 탭을 닫으면 초기화)
      sessionStorage.setItem('popupNewsClosed', 'true');
      console.log('💾 세션 스토리지에 임시로 팝업 닫힘 상태 저장');
    }
  };

  return (
    <SmoothScroll setLenisInstance={setLenisInstance}>
      <div className="wrapper">
        <Header />
        {children}
        <Footer />

        {/* 팝업 모달 */}
        {showPopup && (
          <>
            {console.log('🎭 팝업 모달 렌더링:', { showPopup, popupNews })}
            <PopupModal newsItem={popupNews} onClose={handleClosePopup} />
          </>
        )}
      </div>
    </SmoothScroll>
  );
}
