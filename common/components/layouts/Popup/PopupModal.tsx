'use client';

import React, { useEffect, useState } from 'react';
import { NewsItem } from '@/lib/notion';
import Icon from '@/common/components/utils/Icons';
import styles from '@/common/components/layouts/popup/PopupModal.module.scss';

// 뉴스 컨텐츠 타입 정의
interface NewsContent {
  page: {
    id: string;
    title: string;
    date: string;
    slug: string;
  };
  blocks: Array<{
    id: string;
    type: string;
    content?: string;
    language?: string;
    url?: string;
    caption?: string;
  }>;
}

interface PopupModalProps {
  newsItem: NewsItem | null;
  onClose: (dontShowAgain?: boolean) => void;
}

export default function PopupModal({ newsItem, onClose }: PopupModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [newsContent, setNewsContent] = useState<NewsContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    console.log('🎭 PopupModal useEffect 실행, newsItem:', newsItem);

    if (newsItem) {
      console.log('✅ newsItem 있음, 모달 표시 준비');

      // 뉴스 컨텐츠 가져오기
      fetchNewsContent(newsItem.slug);

      // 모달이 표시될 때 애니메이션을 위해 약간의 지연
      const timer = setTimeout(() => {
        console.log('🎬 모달 애니메이션 시작');
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      console.log('❌ newsItem 없음, 모달 숨김');
      setIsVisible(false);
      setNewsContent(null);
    }
  }, [newsItem]);

  // 뉴스 컨텐츠 가져오기 함수
  const fetchNewsContent = async (slug: string) => {
    try {
      setIsLoadingContent(true);
      console.log('📄 뉴스 컨텐츠 가져오기 시작:', slug);

      const response = await fetch(`/api/news-content/${slug}`);
      if (response.ok) {
        const content = await response.json();
        console.log('✅ 뉴스 컨텐츠 가져오기 성공:', content);
        setNewsContent(content);
      } else {
        console.log('❌ 뉴스 컨텐츠 가져오기 실패:', response.status);
      }
    } catch (error) {
      console.error('💥 뉴스 컨텐츠 가져오기 오류:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // 모달이 없으면 렌더링하지 않음
  if (!newsItem) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    // 오버레이를 클릭했을 때만 모달 닫기
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    console.log('🚪 팝업 닫기 시작, 다시 보지 않기:', dontShowAgain);
    setIsVisible(false);

    // 애니메이션 완료 후 모달 닫기
    setTimeout(() => {
      onClose(dontShowAgain);
    }, 300);
  };

  const handleNewsClick = () => {
    // 뉴스 링크로 이동
    window.location.href = newsItem.link;
  };

  // 블록 렌더링 함수
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'paragraph':
        return block.content ? <p className={styles.paragraph}>{block.content}</p> : null;
      case 'heading_1':
        return block.content ? <h1 className={styles.heading1}>{block.content}</h1> : null;
      case 'heading_2':
        return block.content ? <h2 className={styles.heading2}>{block.content}</h2> : null;
      case 'heading_3':
        return block.content ? <h3 className={styles.heading3}>{block.content}</h3> : null;
      case 'bulleted_list_item':
        return block.content ? <li className={styles.listItem}>• {block.content}</li> : null;
      case 'numbered_list_item':
        return block.content ? <li className={styles.listItem}>{block.content}</li> : null;
      case 'quote':
        return block.content ? (
          <blockquote className={styles.quote}>{block.content}</blockquote>
        ) : null;
      case 'code':
        return block.content ? (
          <pre className={styles.code}>
            <code>{block.content}</code>
          </pre>
        ) : null;
      case 'image':
        return block.url ? (
          <div className={styles.imageContainer}>
            <img src={block.url} alt={block.caption || '이미지'} className={styles.image} />
            {block.caption && <p className={styles.imageCaption}>{block.caption}</p>}
          </div>
        ) : null;
      default:
        return block.content ? <p className={styles.paragraph}>{block.content}</p> : null;
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${isVisible ? styles.visible : ''}`} data-lenis-prevent>
        {/* 모달 헤더 */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>NEWS</span>
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

          {/* 뉴스 컨텐츠 표시 */}
          <div className={styles.newsContent}>
            {isLoadingContent ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>내용을 불러오는 중...</p>
              </div>
            ) : newsContent ? (
              <div className={styles.contentBlocks}>
                {newsContent.blocks.map((block) => (
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

          <div className={styles.actions}>
            <button className={styles.readButton} onClick={handleNewsClick}>
              자세히 보기
            </button>
            <button className={styles.closeTextButton} onClick={handleClose}>
              닫기
            </button>
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
