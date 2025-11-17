'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PopupData } from '@/lib/notion';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import Icon from '@/common/components/utils/Icons';
import styles from '@/common/components/layouts/Popup/PopupModal.module.scss';

interface PopupModalProps {
  newsItem: PopupData | null;
  onClose: (dontShowAgain?: boolean) => void;
}

export default function PopupModal({ newsItem, onClose }: PopupModalProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 모달 애니메이션
  useEffect(() => {
    if (newsItem) {
      // 현재 포커스된 요소 저장 (모달 닫을 때 복원용)
      const activeEl = document.activeElement as HTMLElement;
      // body나 html 태그는 유효한 포커스 위치가 아니므로 null로 처리
      if (activeEl && activeEl !== document.body && activeEl.tagName !== 'HTML') {
        previousActiveElement.current = activeEl;
      } else {
        previousActiveElement.current = null;
      }

      // 모달이 표시될 때 애니메이션을 위해 약간의 지연
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [newsItem]);

  // 모달이 보이면 포커스 이동
  useEffect(() => {
    if (isVisible && closeButtonRef.current) {
      // 애니메이션 완료 후 포커스 이동
      const focusTimer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 150);

      return () => clearTimeout(focusTimer);
    }
  }, [isVisible]);

  // 모달이 없으면 렌더링하지 않음
  if (!newsItem) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);

    // 애니메이션 완료 후 모달 닫기
    setTimeout(() => {
      // '다시보지 않기'가 선택된 경우에만 세션 처리
      onClose(dontShowAgain);

      // 포커스 복원 로직
      const restoreFocus = () => {
        // 1. 이전 포커스 위치가 유효하면 복원
        if (
          previousActiveElement.current &&
          document.body.contains(previousActiveElement.current) &&
          typeof previousActiveElement.current.focus === 'function'
        ) {
          try {
            previousActiveElement.current.focus();
            return true;
          } catch (e) {
            // 포커스 실패 시 대체 로직으로
            console.log('Failed to restore focus, falling back to default');
          }
        }

        // 2. Skip Navigation 링크로 이동
        const skipLink = document.querySelector<HTMLElement>('.skip-link');
        if (skipLink) {
          skipLink.focus();
          return true;
        }

        // 3. 메인 콘텐츠로 이동
        const mainContent = document.querySelector<HTMLElement>('#main-content');
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
          // 포커스 후 tabindex 제거
          setTimeout(() => {
            mainContent.removeAttribute('tabindex');
          }, 100);
          return true;
        }

        // 4. 헤더의 첫 번째 링크(로고)로 이동
        const headerLogo = document.querySelector<HTMLElement>('header a[href="/"]');
        if (headerLogo) {
          headerLogo.focus();
          return true;
        }

        // 5. 페이지의 첫 번째 포커스 가능한 요소
        const firstFocusable = document.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
          return true;
        }

        return false;
      };

      restoreFocus();
    }, 300);
  };

  // 키보드 이벤트 핸들러 (ESC + 포커스 트랩)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
      return;
    }

    // Tab 키 포커스 트랩
    if (event.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: 첫 번째 요소에서 마지막 요소로
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          event.preventDefault();
        }
      } else {
        // Tab: 마지막 요소에서 첫 번째 요소로
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          event.preventDefault();
        }
      }
    }
  };

  // 블록 렌더링 함수 (Notion BlockObjectResponse를 받아서 렌더링)
  const renderBlock = (block: BlockObjectResponse) => {
    const blockType = block.type;

    // 타입별로 콘텐츠 추출 및 렌더링
    switch (blockType) {
      case 'paragraph': {
        const paragraph = block.paragraph;
        const text = paragraph.rich_text.map((t) => t.plain_text).join('');
        return text ? <p className={styles.paragraph}>{text}</p> : null;
      }
      case 'heading_1': {
        const heading = block.heading_1;
        const text = heading.rich_text.map((t) => t.plain_text).join('');
        return text ? <h1 className={styles.heading1}>{text}</h1> : null;
      }
      case 'heading_2': {
        const heading = block.heading_2;
        const text = heading.rich_text.map((t) => t.plain_text).join('');
        return text ? <h2 className={styles.heading2}>{text}</h2> : null;
      }
      case 'heading_3': {
        const heading = block.heading_3;
        const text = heading.rich_text.map((t) => t.plain_text).join('');
        return text ? <h3 className={styles.heading3}>{text}</h3> : null;
      }
      case 'bulleted_list_item': {
        const listItem = block.bulleted_list_item;
        const text = listItem.rich_text.map((t) => t.plain_text).join('');
        return text ? <li className={styles.listItem}>• {text}</li> : null;
      }
      case 'numbered_list_item': {
        const listItem = block.numbered_list_item;
        const text = listItem.rich_text.map((t) => t.plain_text).join('');
        return text ? <li className={styles.listItem}>{text}</li> : null;
      }
      case 'quote': {
        const quote = block.quote;
        const text = quote.rich_text.map((t) => t.plain_text).join('');
        return text ? <blockquote className={styles.quote}>{text}</blockquote> : null;
      }
      case 'code': {
        const code = block.code;
        const text = code.rich_text.map((t) => t.plain_text).join('');
        return text ? (
          <pre className={styles.code}>
            <code>{text}</code>
          </pre>
        ) : null;
      }
      case 'image': {
        const image = block.image;
        let imageUrl = '';
        let caption = '';

        if (image.type === 'external') {
          imageUrl = image.external.url;
        } else if (image.type === 'file') {
          imageUrl = image.file.url;
        }

        if (image.caption && image.caption.length > 0) {
          caption = image.caption.map((t) => t.plain_text).join('');
        }

        // 더 구체적인 대체 텍스트 생성
        const altText = caption || `${newsItem.title} 관련 이미지`;

        return imageUrl ? (
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt={altText} className={styles.image} loading="lazy" />
            {caption && (
              <p className={styles.imageCaption} role="note">
                {caption}
              </p>
            )}
          </div>
        ) : null;
      }
      default:
        return null;
    }
  };

  const badgeType = (() => {
    const isNotice =
      newsItem.slug === 'notice9' ||
      newsItem.link.includes('/info/notice/') ||
      newsItem.slug.startsWith('notice') ||
      newsItem.slug.includes('notice') ||
      newsItem.title.includes('공지사항');
    return isNotice ? '공지사항' : 'NEWS';
  })();

  return (
    <>
      {/* 스크린 리더를 위한 ARIA live 알림 */}
      {isVisible && (
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {badgeType} 팝업이 열렸습니다. {newsItem.title}. {newsItem.date}
        </div>
      )}

      <div
        className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      >
        <div
          ref={modalRef}
          className={`${styles.modal} ${isVisible ? styles.visible : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
          aria-describedby="popup-date popup-content"
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeText} aria-label={`카테고리: ${badgeType}`}>
                {badgeType}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="팝업 닫기 (ESC 키로도 닫을 수 있습니다)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 모달 내용 */}
          <div className={styles.content}>
            <h2 id="popup-title" className={styles.title}>
              {newsItem.title}
            </h2>
            <p id="popup-date" className={styles.date}>
              {newsItem.date}
            </p>

            {/* 뉴스 컨텐츠 표시 (서버에서 받은 blocks 사용) */}
            <div id="popup-content" className={styles.newsContent}>
              {newsItem.blocks && newsItem.blocks.length > 0 ? (
                <div className={styles.contentBlocks}>
                  {newsItem.blocks.map((block) => (
                    <div key={block.id} className={styles.block}>
                      {renderBlock(block)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noContent}>
                  <p>내용을 불러올 수 없습니다.</p>
                </div>
              )}
            </div>

            {/* 다시 보지 않기 체크박스 */}
            <div className={styles.checkboxContainer}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="sr-only"
                />
                <Icon
                  name={dontShowAgain ? 'checked' : 'unchecked'}
                  className={styles.checkboxIcon}
                  aria-hidden="true"
                />
                <span className={styles.checkboxText}>다시 보지 않기</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
