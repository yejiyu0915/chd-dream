'use client';

import { useEffect, useState } from 'react';
import Icon from '../Icons';
import t from './ThemeSelector.module.scss';
import type { Season } from '@/common/utils/season';

// 테마 옵션 정의
const THEME_OPTIONS = [
  { value: 'auto', label: '자동 (현재 계절)' },
  { value: 'spring', label: '봄 🌸' },
  { value: 'summer', label: '여름 🌊' },
  { value: 'autumn', label: '가을 🍂' },
  { value: 'winter', label: '겨울 ❄️' },
] as const;

export default function ThemeSelector() {
  // 모달 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);
  // 선택된 테마 (localStorage에서 불러옴)
  const [selectedTheme, setSelectedTheme] = useState<Season | 'auto'>('auto');

  // 컴포넌트 마운트 시 localStorage에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setSelectedTheme(savedTheme as Season | 'auto');
    }
  }, []);

  // 모달 열기
  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add('theme-modal-open');
  };

  // 모달 닫기
  const closeModal = () => {
    setIsOpen(false);
    document.body.classList.remove('theme-modal-open');
  };

  // 테마 선택 핸들러
  const handleThemeSelect = (theme: Season | 'auto') => {
    setSelectedTheme(theme);
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    // localStorage에 선택한 테마 저장
    localStorage.setItem('theme-preference', selectedTheme);
    // 모달 닫기
    closeModal();
    // 페이지 새로고침하여 테마 적용
    window.location.reload();
  };

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Floating 테마 변경 버튼 */}
      <button className={t.theme__button} onClick={openModal} aria-label="테마 변경">
        <Icon name="palette" />
      </button>

      {/* 테마 선택 모달 */}
      {isOpen && (
        <div className={t.theme__overlay} onClick={handleOverlayClick}>
          <div className={t.theme__modal}>
            {/* 모달 헤더 */}
            <div className={t.theme__header}>
              <h2 className={t.theme__title}>테마 선택</h2>
              <button
                className={t.theme__close}
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* 테마 옵션 리스트 */}
            <div className={t.theme__options}>
              {THEME_OPTIONS.map((option) => (
                <label key={option.value} className={t.theme__option}>
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={selectedTheme === option.value}
                    onChange={() => handleThemeSelect(option.value)}
                    className={t.theme__radio}
                  />
                  <span className={t.theme__label}>{option.label}</span>
                </label>
              ))}
            </div>

            {/* 설명 텍스트 */}
            <p className={t.theme__desc}>
              테마를 변경하면 페이지가 새로고침됩니다.
            </p>

            {/* 저장 버튼 */}
            <button className={t.theme__save} onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

