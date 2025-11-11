'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import PopupModal from '@/common/components/layouts/Popup/PopupModal';
import TopButton from '@/common/components/utils/TopButton';
import { PopupData } from '@/lib/notion';

interface LayoutContentProps {
  children: React.ReactNode;
  initialPopupData: PopupData | null; // 서버에서 받은 팝업 데이터
}

export default function LayoutContent({ children, initialPopupData }: LayoutContentProps) {
  const [popupNews, setPopupNews] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const scrollYRef = useRef(0);

  // localStorage 체크 및 팝업 표시 (서버에서 받은 데이터 사용)
  useEffect(() => {
    // 데이터가 있고, 빈 객체가 아니며, id가 있는 경우에만 팝업 표시
    if (initialPopupData && initialPopupData.id) {
      // 팝업 ID와 기간 정보를 기반으로 "다시 보지 않기" 상태 확인
      const popupKey = `popupClosed_${initialPopupData.id}`;
      const popupEndDate =
        initialPopupData.popupEndDate || initialPopupData.rawDate || initialPopupData.date;

      // 저장된 "다시 보지 않기" 정보 확인
      const storedPopupData = localStorage.getItem(popupKey);

      if (storedPopupData) {
        try {
          const { endDate, permanentlyClosed } = JSON.parse(storedPopupData);

          // 기간이 변경되었거나 영구적으로 닫지 않은 경우에만 팝업 표시
          if (endDate === popupEndDate && permanentlyClosed) {
            return; // 동일한 기간이고 영구적으로 닫았다면 표시하지 않음
          }
        } catch {
          // JSON 파싱 실패 시 기존 데이터 삭제
          localStorage.removeItem(popupKey);
        }
      }

      // 팝업 표시
      setPopupNews(initialPopupData);
      setShowPopup(true);
    }
  }, [initialPopupData]);

  // 팝업 상태에 따른 스크롤 제어
  useEffect(() => {
    if (showPopup) {
      // 스크롤 위치 저장
      scrollYRef.current = window.scrollY;

      // body 스크롤 차단
      document.body.classList.add('popup-open');
      document.body.style.top = `-${scrollYRef.current}px`;
    } else if (scrollYRef.current > 0) {
      // 팝업이 열렸다가 닫힌 경우에만 스크롤 복원
      // (페이지 전환 시에는 scrollYRef가 0이므로 실행 안 됨)
      
      // body 스크롤 복원
      document.body.classList.remove('popup-open');
      document.body.style.top = '';

      // 스크롤 위치 복원
      const currentScrollY = scrollYRef.current;
      window.scrollTo(0, currentScrollY);
      
      // 복원 후 ref 초기화
      scrollYRef.current = 0;
    } else {
      // 팝업이 없는 경우 (초기 진입 시)
      document.body.classList.remove('popup-open');
      document.body.style.top = '';
    }
  }, [showPopup]);

  // 팝업 닫기 핸들러
  const handleClosePopup = (dontShowAgain: boolean = false) => {
    setShowPopup(false);

    if (dontShowAgain && popupNews) {
      // 팝업 ID와 기간 정보를 기반으로 "다시 보지 않기" 상태 저장
      const popupKey = `popupClosed_${popupNews.id}`;
      const popupEndDate = popupNews.popupEndDate || popupNews.rawDate || popupNews.date;

      const popupData = {
        endDate: popupEndDate,
        permanentlyClosed: true,
        closedAt: new Date().toISOString(),
      };

      localStorage.setItem(popupKey, JSON.stringify(popupData));
    }
    // X 버튼만 누른 경우(dontShowAgain이 false)에는 세션 처리하지 않음
    // 팝업이 다시 뜰 수 있도록 아무것도 저장하지 않음
  };

  return (
    <div className="wrapper">
      <Header />
      {children}
      <Footer />

      {/* 팝업 모달 */}
      {showPopup && <PopupModal newsItem={popupNews} onClose={handleClosePopup} />}

      {/* Top 버튼 */}
      <TopButton />
    </div>
  );
}
