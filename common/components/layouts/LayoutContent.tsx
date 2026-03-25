'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/common/components/layouts/Header/Header';
import Footer from '@/common/components/layouts/Footer/Footer';
import PopupModal from '@/common/components/layouts/Popup/PopupModal';
import TopButton from '@/common/components/utils/TopButton';
import ThemeSelector from '@/common/components/utils/ThemeSelector/ThemeSelector';
import ThemeManager from '@/common/components/utils/ThemeManager';
import { PopupData } from '@/lib/notion';
import { fetchJsonSilent } from '@/common/utils/safeFetchJson';

interface LayoutContentProps {
  children: React.ReactNode;
}

function applyPopupFromData(initialPopupData: PopupData | null, setPopupNews: (p: PopupData | null) => void, setShowPopup: (v: boolean) => void) {
  if (!initialPopupData?.id) {
    return;
  }
  const popupKey = `popupClosed_${initialPopupData.id}`;
  const popupEndDate =
    initialPopupData.popupEndDate || initialPopupData.rawDate || initialPopupData.date;

  const storedPopupData = localStorage.getItem(popupKey);

  if (storedPopupData) {
    try {
      const { endDate, permanentlyClosed } = JSON.parse(storedPopupData);
      if (endDate === popupEndDate && permanentlyClosed) {
        return;
      }
    } catch {
      localStorage.removeItem(popupKey);
    }
  }

  setPopupNews(initialPopupData);
  setShowPopup(true);
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const [popupNews, setPopupNews] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // 루트 레이아웃 TTFB 완화: 팝업은 /api/popup-with-content에서 지연 로드
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await fetchJsonSilent<PopupData | null>('/api/popup-with-content');
      if (cancelled || !data) return;
      applyPopupFromData(data, setPopupNews, setShowPopup);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 팝업 상태에 따른 스크롤 제어
  useEffect(() => {
    if (showPopup) {
      // 팝업이 열릴 때: body 스크롤만 차단
      document.body.classList.add('popup-open');
    } else {
      // 팝업이 닫힐 때: body 스크롤 활성화
      document.body.classList.remove('popup-open');
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
      {/* Skip Navigation 링크 */}
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>

      {/* 테마 관리자 (localStorage 확인 및 테마 적용) */}
      <ThemeManager />

      <Header />
      {children}
      <Footer />

      {/* 테마 선택기 (Top 버튼 위) */}
      <ThemeSelector />

      {/* Top 버튼 */}
      <TopButton />

      {/* 팝업 모달 */}
      {showPopup && <PopupModal newsItem={popupNews} onClose={handleClosePopup} />}
    </div>
  );
}
