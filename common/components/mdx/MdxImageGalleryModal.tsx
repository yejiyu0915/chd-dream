'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import styles from '@/common/components/mdx/MdxImageGalleryModal.module.scss';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ImageData {
  src: string;
  alt: string;
  width: string;
  height: string;
}

interface MdxImageGalleryModalProps {
  isOpen: boolean;
  images: ImageData[];
  initialIndex: number;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * MDX 이미지 갤러리 모달 컴포넌트
 * - 이미지 클릭 시 전체 화면 갤러리 모달 표시
 * - Swiper로 이미지 탐색 가능
 */
export default function MdxImageGalleryModal({
  isOpen,
  images,
  initialIndex,
  onClose,
  containerRef,
}: MdxImageGalleryModalProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swiper 초기 슬라이드 설정
  useEffect(() => {
    if (isOpen && swiperRef.current && initialIndex >= 0) {
      swiperRef.current.slideTo(initialIndex, 0);
    }
  }, [isOpen, initialIndex]);

  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // wrapper 안에 top-button 아래로 모달 추가
  useEffect(() => {
    // cleanup 함수 (비동기로 처리하여 race condition 방지)
    const cleanup = () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      cleanupTimeoutRef.current = setTimeout(() => {
        if (rootRef.current) {
          try {
            rootRef.current.unmount();
          } catch (error) {
            // 이미 unmount된 경우 무시
          }
          rootRef.current = null;
        }
        if (modalContainerRef.current && modalContainerRef.current.parentNode) {
          modalContainerRef.current.remove();
          modalContainerRef.current = null;
        }
        cleanupTimeoutRef.current = null;
      }, 0);
    };

    // 모달 생성 함수
    const createModal = () => {
      // .wrapper 찾기
      const wrapper = document.querySelector('.wrapper');
      if (!wrapper) return;

      // top-button 찾기
      const topButton = wrapper.querySelector('.top-button');

      // 모달 컨테이너 생성
      const container = document.createElement('div');
      container.setAttribute('data-mdx-gallery-modal', 'true');
      modalContainerRef.current = container;

      // top-button 다음에 삽입 (top-button이 없으면 wrapper의 마지막에 추가)
      if (topButton && topButton.nextSibling) {
        wrapper.insertBefore(container, topButton.nextSibling);
      } else if (topButton) {
        wrapper.appendChild(container);
      } else {
        wrapper.appendChild(container);
      }

      // React로 모달 렌더링
      const root = createRoot(container);
      rootRef.current = root;

      root.render(
        <div
          className={styles.overlay}
          onClick={(e) => {
            // 클릭된 요소 확인
            const target = e.target as HTMLElement;

            // 이미지 요소인지 확인
            const isImage = target.tagName === 'IMG';

            // 닫기 버튼인지 확인
            const isCloseButton = target.closest(`.${styles.closeButton}`);

            // 네비게이션 버튼인지 확인
            const isNavigationButton =
              target.closest('[class*="swiper-button-prev"]') ||
              target.closest('[class*="swiper-button-next"]');

            // Pagination인지 확인
            const isPagination =
              target.closest('[class*="swiper-pagination"]') ||
              target.closest('[class*="swiper-pagination-bullet"]');

            // 이미지, 닫기 버튼, 네비게이션, pagination이 아닌 경우에만 모달 닫기
            // (이미지 주변 빈 공간이나 dimmed 배경 클릭 시)
            if (!isImage && !isCloseButton && !isNavigationButton && !isPagination) {
              onClose();
            }
          }}
        >
          {/* 닫기 버튼 */}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="갤러리 닫기"
          >
            <Icon name="close" />
          </button>

          <div className={styles.modal}>
            {/* Swiper 갤러리 */}
            <div className={styles.swiperContainer}>
              <Swiper
                modules={[Pagination, Navigation]}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                centeredSlides={false}
                loop={false}
                className={styles.swiper}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  if (initialIndex >= 0) {
                    swiper.slideTo(initialIndex, 0);
                  }
                }}
                slidesPerView={1}
                spaceBetween={0}
              >
                {images.map((img, imgIndex) => (
                  <SwiperSlide key={imgIndex} className={styles.swiperSlide}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={parseInt(img.width)}
                        height={parseInt(img.height)}
                        sizes="100vw"
                        loading={imgIndex === initialIndex ? 'eager' : 'lazy'}
                        unoptimized={true}
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      );
    };

    // 모달이 닫혔거나 이미지가 없으면 cleanup만 실행
    if (!isOpen || images.length === 0) {
      cleanup();
      return;
    }

    // 기존 모달이 있으면 먼저 cleanup (기존 모달이 있을 때만)
    if (rootRef.current || modalContainerRef.current) {
      cleanup();
      // cleanup이 비동기로 실행되므로 약간의 지연 후 새 모달 생성
      const timeoutId = setTimeout(() => {
        // cleanup 후에도 여전히 열려있으면 새 모달 생성
        if (isOpen && images.length > 0) {
          createModal();
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }

    // 모달 생성
    createModal();

    return () => {
      // cleanup 함수 (비동기로 처리하여 race condition 방지)
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      cleanupTimeoutRef.current = setTimeout(() => {
        if (rootRef.current) {
          try {
            rootRef.current.unmount();
          } catch (error) {
            // 이미 unmount된 경우 무시
          }
          rootRef.current = null;
        }
        if (modalContainerRef.current && modalContainerRef.current.parentNode) {
          modalContainerRef.current.remove();
          modalContainerRef.current = null;
        }
        cleanupTimeoutRef.current = null;
      }, 0);
    };
  }, [isOpen, images, initialIndex, onClose]);

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      // 최종 cleanup
      setTimeout(() => {
        if (rootRef.current) {
          try {
            rootRef.current.unmount();
          } catch (error) {
            // 이미 unmount된 경우 무시
          }
          rootRef.current = null;
        }
        if (modalContainerRef.current && modalContainerRef.current.parentNode) {
          modalContainerRef.current.remove();
          modalContainerRef.current = null;
        }
      }, 0);
    };
  }, []);

  // React 컴포넌트로는 아무것도 렌더링하지 않음 (useEffect에서 직접 DOM 조작)
  return null;
}
