'use client';

import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import MdxImageGalleryModal from '@/common/components/mdx/MdxImageGalleryModal';
import styles from '@/common/components/mdx/MdxImageSwiper.module.scss';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';

interface MdxImageSwiperWrapperProps {
  children: React.ReactNode;
}

interface ImageGroup {
  images: Array<{
    src: string;
    alt: string;
    width: string;
    height: string;
  }>;
  firstImageElement: HTMLImageElement;
}

interface ModalState {
  isOpen: boolean;
  images: Array<{
    src: string;
    alt: string;
    width: string;
    height: string;
  }>;
  initialIndex: number;
}

/**
 * MDX 콘텐츠 내 연속된 이미지를 자동으로 감지하여 Swiper로 변환하는 컴포넌트
 * - 이미지가 2개 이상 연속으로 있을 때만 Swiper 적용
 * - 다른 요소가 중간에 껴있으면 연속으로 보지 않음
 */
export default function MdxImageSwiperWrapper({ children }: MdxImageSwiperWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  });
  const groupsRef = useRef<ImageGroup[]>([]);

  useEffect(() => {
    if (!containerRef.current || processedRef.current) return;

    const container = containerRef.current;

    // 이미 처리했으면 스킵
    if (container.dataset.swiperProcessed === 'true') return;

    // 모든 이미지 wrapper 찾기
    const imageWrappers = Array.from(
      container.querySelectorAll('div[data-mdx-image-wrapper="true"]')
    ) as HTMLDivElement[];

    // wrapper 내부의 img 요소 추출
    const images = imageWrappers
      .map((wrapper) => wrapper.querySelector('img'))
      .filter(Boolean) as HTMLImageElement[];

    if (images.length === 0) {
      container.dataset.swiperProcessed = 'true';
      return;
    }

    // 연속된 이미지 그룹 찾기 (wrapper 기준)
    const groups: ImageGroup[] = [];
    let currentGroup: HTMLImageElement[] = [];

    images.forEach((img, index) => {
      const prevImg = images[index - 1];
      const prevWrapper = prevImg
        ? (prevImg.closest('div[data-mdx-image-wrapper="true"]') as HTMLDivElement)
        : null;
      const currentWrapper = img.closest('div[data-mdx-image-wrapper="true"]') as HTMLDivElement;

      // 첫 번째 이미지이거나, 이전 이미지와 연속인지 확인
      if (!prevImg || !prevWrapper) {
        currentGroup = [img];
      } else {
        // 이전 wrapper와 현재 wrapper 사이에 다른 요소가 있는지 확인
        const isConsecutive = checkConsecutiveWrappers(prevWrapper, currentWrapper);

        if (isConsecutive) {
          currentGroup.push(img);
        } else {
          // 그룹이 끝났으므로 저장하고 새 그룹 시작
          if (currentGroup.length >= 2) {
            groups.push({
              images: currentGroup.map((imgEl) => ({
                src: imgEl.getAttribute('src') || '',
                alt: imgEl.getAttribute('alt') || '',
                width: imgEl.getAttribute('width') || '1000',
                height: imgEl.getAttribute('height') || '1000',
              })),
              firstImageElement: currentGroup[0],
            });
          }
          currentGroup = [img];
        }
      }
    });

    // 마지막 그룹 추가
    if (currentGroup.length >= 2) {
      groups.push({
        images: currentGroup.map((imgEl) => ({
          src: imgEl.getAttribute('src') || '',
          alt: imgEl.getAttribute('alt') || '',
          width: imgEl.getAttribute('width') || '1000',
          height: imgEl.getAttribute('height') || '1000',
        })),
        firstImageElement: currentGroup[0],
      });
    }

    // 그룹 정보 저장 (모달에서 사용)
    groupsRef.current = groups;

    // 각 그룹을 Swiper로 변환
    groups.forEach((group, groupIndex) => {
      convertToSwiper(group, groupIndex);
    });

    // 처리 완료 표시
    container.dataset.swiperProcessed = 'true';
    processedRef.current = true;
  }, []);

  /**
   * 모달 닫기 핸들러
   */
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      images: [],
      initialIndex: 0,
    });
  };

  // 이미지 클릭 이벤트 리스너
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const customEvent = e as CustomEvent<{
        groupIndex: number;
        imageIndex: number;
        images: ImageGroup['images'];
      }>;
      const { groupIndex, imageIndex, images } = customEvent.detail;

      setModalState({
        isOpen: true,
        images: images,
        initialIndex: imageIndex,
      });
    };

    document.addEventListener('mdx-image-click', handleImageClick as EventListener);
    return () => {
      document.removeEventListener('mdx-image-click', handleImageClick as EventListener);
    };
  }, []);

  /**
   * 두 이미지 wrapper가 연속인지 확인 (사이에 다른 요소가 없는지 체크)
   */
  function checkConsecutiveWrappers(wrapper1: HTMLDivElement, wrapper2: HTMLDivElement): boolean {
    let current: Node | null = wrapper1.nextSibling;

    // wrapper1과 wrapper2 사이의 모든 노드를 확인
    while (current && current !== wrapper2) {
      // 텍스트 노드인 경우 공백/줄바꿈만 있는지 확인
      if (current.nodeType === Node.TEXT_NODE) {
        const text = current.textContent?.trim();
        if (text && text.length > 0) {
          return false; // 의미있는 텍스트가 있으면 연속 아님
        }
      }
      // 요소 노드인 경우
      else if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        // 이미지 wrapper가 아니면 연속 아님
        if (element.getAttribute('data-mdx-image-wrapper') !== 'true') {
          return false;
        }
      }

      current = current.nextSibling;
    }

    return true;
  }

  /**
   * 이미지 그룹을 Swiper로 변환
   */
  function convertToSwiper(group: ImageGroup, groupIndex: number) {
    const firstImg = group.firstImageElement;
    const firstWrapper = firstImg.closest('div[data-mdx-image-wrapper="true"]') as HTMLDivElement;
    if (!firstWrapper) return;

    const parent = firstWrapper.parentElement;
    if (!parent) return;

    // 그룹에 속한 모든 wrapper 찾기
    const wrappersToRemove: HTMLDivElement[] = [firstWrapper];
    let current: Node | null = firstWrapper.nextSibling;
    let foundCount = 1;

    // 연속된 wrapper들을 찾아서 수집
    while (current && foundCount < group.images.length) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        if (element.getAttribute('data-mdx-image-wrapper') === 'true') {
          wrappersToRemove.push(element as HTMLDivElement);
          foundCount++;
        } else {
          // 다른 요소가 있으면 중단
          break;
        }
      } else if (current.nodeType === Node.TEXT_NODE) {
        const text = current.textContent?.trim();
        if (text && text.length > 0) {
          // 의미있는 텍스트가 있으면 중단
          break;
        }
      }
      current = current.nextSibling;
    }

    // Swiper 컨테이너 생성
    const swiperContainer = document.createElement('div');
    swiperContainer.className = styles.swiperContainer;

    // 첫 번째 wrapper 앞에 Swiper 컨테이너 삽입
    parent.insertBefore(swiperContainer, firstWrapper);

    // 기존 이미지 wrapper들 제거
    wrappersToRemove.forEach((wrapper) => {
      wrapper.remove();
    });

    // React로 Swiper 렌더링
    const root = createRoot(swiperContainer);

    // 이미지 클릭 핸들러를 위한 컴포넌트
    // 클로저 문제를 피하기 위해 groupIndex와 images를 직접 전달
    const SwiperWithClickHandler = ({
      groupImages,
      groupIdx,
    }: {
      groupImages: ImageGroup['images'];
      groupIdx: number;
    }) => {
      let swiperInstance: any = null;

      const handleImageClick = (imageIdx: number) => {
        // containerRef를 통해 최신 handleOpenModal 함수에 접근
        const event = new CustomEvent('mdx-image-click', {
          detail: { groupIndex: groupIdx, imageIndex: imageIdx, images: groupImages },
        });
        document.dispatchEvent(event);
      };

      // 이미지 로드 후 Swiper 높이 업데이트
      const handleImageLoad = () => {
        if (swiperInstance) {
          // 약간의 지연을 두고 높이 업데이트 (이미지 렌더링 완료 대기)
          setTimeout(() => {
            swiperInstance.updateAutoHeight();
          }, 100);
        }
      };

      // 이미지가 1개일 때는 단일 이미지 클래스 추가
      const isSingleImage = groupImages.length === 1;
      const swiperClassName = isSingleImage
        ? `${styles.swiper} ${styles.singleImage}`
        : styles.swiper;

      return (
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          centeredSlides={false}
          loop={false}
          autoHeight={true}
          className={swiperClassName}
          onSwiper={(swiper) => {
            swiperInstance = swiper;
            // 초기 로드 시 높이 업데이트
            setTimeout(() => {
              swiper.updateAutoHeight();
            }, 100);
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 1.25,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
          }}
          onSlideChange={(swiper) => {
            // 슬라이드 변경 시 높이 업데이트
            swiper.updateAutoHeight();
          }}
        >
          {groupImages.map((img, imgIndex) => (
            <SwiperSlide key={imgIndex} className={styles.swiperSlide}>
              <div
                className={styles.imageWrapper}
                onClick={() => handleImageClick(imgIndex)}
                style={{ cursor: 'pointer' }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={parseInt(img.width)}
                  height={parseInt(img.height)}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  loading={imgIndex === 0 ? 'eager' : 'lazy'}
                  onLoad={handleImageLoad}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    };

    root.render(<SwiperWithClickHandler groupImages={group.images} groupIdx={groupIndex} />);
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {children}
      <MdxImageGalleryModal
        isOpen={modalState.isOpen}
        images={modalState.images}
        initialIndex={modalState.initialIndex}
        onClose={handleCloseModal}
        containerRef={containerRef}
      />
    </div>
  );
}
