'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (newsItem) {
      // 모달이 표시될 때 애니메이션을 위해 약간의 지연
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [newsItem]);

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
    }, 300);
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

        return imageUrl ? (
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt={caption || '이미지'} className={styles.image} />
            {caption && <p className={styles.imageCaption}>{caption}</p>}
          </div>
        ) : null;
      }
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.modal} ${isVisible ? styles.visible : ''}`}>
        {/* 모달 헤더 */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>
              {(() => {
                const isNotice =
                  newsItem.slug === 'notice9' ||
                  newsItem.link.includes('/info/notice/') ||
                  newsItem.slug.startsWith('notice') ||
                  newsItem.slug.includes('notice') ||
                  newsItem.title.includes('공지사항');
                return isNotice ? '공지사항' : 'NEWS';
              })()}
            </span>
          </div>
          <button className={styles.closeButton} onClick={handleClose} aria-label="팝업 닫기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          <h2 className={styles.title}>{newsItem.title}</h2>
          <p className={styles.date}>{newsItem.date}</p>

          {/* 뉴스 컨텐츠 표시 (서버에서 받은 blocks 사용) */}
          <div className={styles.newsContent}>
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
            <label
              className={styles.checkboxLabel}
              onClick={() => setDontShowAgain(!dontShowAgain)}
            >
              <Icon
                name={dontShowAgain ? 'checked' : 'unchecked'}
                className={styles.checkboxIcon}
              />
              <span className={styles.checkboxText}>다시 보지 않기</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
