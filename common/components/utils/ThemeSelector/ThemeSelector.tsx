'use client';

import { useEffect, useState, useRef } from 'react';
import Icon from '@/common/components/utils/Icons';
import t from '@/common/components/utils/ThemeSelector/ThemeSelector.module.scss';
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
  // 스크린 리더 알림용 상태
  const [announcement, setAnnouncement] = useState('');

  // 포커스 관리를 위한 ref
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 컴포넌트 마운트 시 localStorage에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setSelectedTheme(savedTheme as Season | 'auto');
    }
  }, []);

  // 모달 열림/닫힘 시 포커스 관리 및 키보드 이벤트 처리
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 닫기 버튼으로 포커스 이동
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      // ESC 키로 모달 닫기
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };

      // 포커스 트랩: Tab 키로 모달 내에서만 이동하도록
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const modal = modalRef.current;
        if (!modal) return;

        // 모달 내 포커스 가능한 모든 요소 찾기
        const focusableElements = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab: 첫 번째 요소에서 마지막 요소로
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
        // Tab: 마지막 요소에서 첫 번째 요소로
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      };

      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  // 모달 열기
  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add('theme-modal-open');
    // 스크린 리더에 모달 열림 알림
    setAnnouncement('테마 선택 대화상자가 열렸습니다.');
  };

  // 모달 닫기 (포커스 복귀 포함)
  const closeModal = () => {
    setIsOpen(false);
    document.body.classList.remove('theme-modal-open');
    // 스크린 리더에 모달 닫힘 알림
    setAnnouncement('테마 선택 대화상자가 닫혔습니다.');
    // 모달 닫을 때 트리거 버튼으로 포커스 복귀
    setTimeout(() => {
      triggerButtonRef.current?.focus();
      setAnnouncement(''); // 알림 초기화
    }, 100);
  };

  // 테마 선택 핸들러
  const handleThemeSelect = (theme: Season | 'auto') => {
    setSelectedTheme(theme);
    // 스크린 리더에 선택 변경 알림
    const selectedLabel = THEME_OPTIONS.find((opt) => opt.value === theme)?.label;
    setAnnouncement(`${selectedLabel} 테마가 선택되었습니다.`);
    // 알림 메시지는 잠시 후 자동 초기화
    setTimeout(() => setAnnouncement(''), 1000);
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
      {/* 스크린 리더 알림용 live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Floating 테마 변경 버튼 */}
      <button
        ref={triggerButtonRef}
        className={t.theme__button}
        onClick={openModal}
        aria-label="테마 변경 (현재 테마 열기)"
        aria-haspopup="dialog"
      >
        <Icon name="palette" />
      </button>

      {/* 테마 선택 모달 */}
      {isOpen && (
        <div className={t.theme__overlay} onClick={handleOverlayClick} role="presentation">
          <div
            ref={modalRef}
            className={t.theme__modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-modal-title"
            aria-describedby="theme-modal-desc"
          >
            {/* 모달 헤더 */}
            <div className={t.theme__header}>
              <h2 id="theme-modal-title" className={t.theme__title}>
                테마 선택
              </h2>
              <button
                ref={closeButtonRef}
                className={t.theme__close}
                onClick={closeModal}
                aria-label="테마 선택 모달 닫기 (ESC 키로도 닫을 수 있습니다)"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* 테마 옵션 리스트 */}
            <fieldset className={t.theme__options} aria-label="테마 옵션">
              <legend className="sr-only">
                원하는 테마를 선택하세요. 현재 선택:{' '}
                {THEME_OPTIONS.find((opt) => opt.value === selectedTheme)?.label}
              </legend>
              {THEME_OPTIONS.map((option) => (
                <label key={option.value} className={t.theme__option}>
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={selectedTheme === option.value}
                    onChange={() => handleThemeSelect(option.value)}
                    className={t.theme__radio}
                    aria-label={`${option.label} 테마 선택`}
                    aria-checked={selectedTheme === option.value}
                  />
                  <span className={t.theme__label} aria-hidden="true">
                    {option.label}
                  </span>
                </label>
              ))}
            </fieldset>

            {/* 설명 텍스트 */}
            <p id="theme-modal-desc" className={t.theme__desc}>
              테마를 변경하면 페이지가 새로고침됩니다.
            </p>

            {/* 저장 버튼 */}
            <button
              className={t.theme__save}
              onClick={handleSave}
              aria-label={`${THEME_OPTIONS.find((opt) => opt.value === selectedTheme)?.label} 테마로 저장하고 페이지 새로고침`}
            >
              저장하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
