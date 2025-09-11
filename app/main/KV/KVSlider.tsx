'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import kv from '@/app/main/KV/KV.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { KVSliderItem } from '@/lib/notion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Swiper as SwiperCore } from 'swiper/types';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';

// KV 섹션이 뷰포트에 보이는지 확인하는 헬퍼 함수
const checkIfKvVisible = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  const { height } = element.getBoundingClientRect();
  return window.scrollY < height;
};

interface KVSliderProps {
  kvSliderItems: KVSliderItem[];
}

export default function KVSlider({ kvSliderItems }: KVSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const { isMobileMenuOpen } = useMobileMenu();
  const [progressWidth, setProgressWidth] = useState(0); // 프로그레스 바 너비 상태
  const [isPlaying, setIsPlaying] = useState(true); // 재생/일시정지 상태 추가
  const [kvIsVisible, setKvIsVisible] = useState(true); // KV 섹션 가시성 상태 추가
  const autoplayDelay = 8000; // Autoplay delay
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 재생 및 프로그레스 바 활성화 상태를 추적하는 Ref
  const isAutoplayAndProgressActiveRef = useRef(false);

  const startProgressBar = useCallback(() => {
    setProgressWidth(0); // 시작 시 0으로 초기화
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setProgressWidth((prevWidth) => {
        // 100% 대신 50%를 기준으로 진행률 계산
        const targetWidth = 50; // 목표 너비를 50%로 설정
        const increment = targetWidth / (autoplayDelay / 100); // 100ms마다 증가할 값
        const newWidth = prevWidth + increment;

        if (newWidth >= targetWidth) {
          clearInterval(intervalRef.current!);
          return targetWidth; // 최대 50%까지만 도달
        }
        return newWidth;
      });
    }, 100); // 100ms마다 업데이트
  }, [autoplayDelay]);

  const stopProgressBar = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentKvIsVisible = checkIfKvVisible(sliderRef.current);
      setKvIsVisible(currentKvIsVisible);

      const shouldBeActive = currentKvIsVisible && !isMobileMenuOpen && isPlaying;

      if (shouldBeActive && !isAutoplayAndProgressActiveRef.current) {
        // 비활성화 상태에서 활성화되어야 할 때만 실행
        swiperRef.current?.autoplay.start();
        startProgressBar();
        isAutoplayAndProgressActiveRef.current = true;
      } else if (!shouldBeActive && isAutoplayAndProgressActiveRef.current) {
        // 활성화 상태에서 비활성화되어야 할 때만 실행
        swiperRef.current?.autoplay.stop();
        stopProgressBar();
        isAutoplayAndProgressActiveRef.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 로드 시 실행

    return () => {
      window.removeEventListener('scroll', handleScroll);
      stopProgressBar();
      isAutoplayAndProgressActiveRef.current = false; // 컴포넌트 언마운트 시 초기화
    };
  }, [isMobileMenuOpen, isPlaying, startProgressBar, stopProgressBar]); // isPlaying 의존성 추가

  // 재생/일시정지 버튼 클릭 핸들러
  const handlePlayPauseToggle = useCallback(() => {
    if (!swiperRef.current) return;

    if (isPlaying) {
      swiperRef.current.autoplay.stop();
      stopProgressBar();
      isAutoplayAndProgressActiveRef.current = false; // 수동으로 멈출 때 플래그 업데이트
    } else {
      swiperRef.current.autoplay.start();
      startProgressBar();
      isAutoplayAndProgressActiveRef.current = true; // 수동으로 재생할 때 플래그 업데이트
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, startProgressBar, stopProgressBar]);

  if (kvSliderItems.length === 0) {
    return (
      <div className={kv.background}>
        <p className={kv.emptyState}>슬라이드 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={kv.background} ref={sliderRef}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // 초기 재생 상태에 따라 프로그레스 바 시작
          if (isPlaying) {
            startProgressBar();
            isAutoplayAndProgressActiveRef.current = true; // 초기 활성화 시 플래그 업데이트
          }
        }}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        pagination={{
          el: `.${kv.pagination}`,
          clickable: true,
          bulletClass: kv.bullet,
          bulletActiveClass: kv.bulletActive,
          // renderBullet: function (index, className) {
          //   return `<span class="${className}" role="button" tabindex="0"></span>`;
          // },
        }}
        navigation={{
          prevEl: `.${kv.buttonPrev}`,
          nextEl: `.${kv.buttonNext}`,
          enabled: true,
          hideOnClick: false,
        }}
        loop={true}
        parallax={true}
        className={kv.slider}
        onSlideChange={() => {
          if (swiperRef.current) {
            swiperRef.current.autoplay.start();
            setIsPlaying(true);
            startProgressBar();
            isAutoplayAndProgressActiveRef.current = true; // 슬라이드 변경 시 활성화
          }
        }}
      >
        {kvSliderItems.map((slide) => (
          <SwiperSlide key={slide.id} data-swiper-parallax="-23%">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-swiper-parallax="-23%"
            />
            <div className={kv.overlay}></div>
            <div className={kv.content}>
              <div className={kv.content__text}>
                <Link href={slide.link} className={kv.content__title}>
                  <p>{slide.title}</p> <Icon name="arrow-up-right" />
                </Link>
                <p className={kv.content__desc}>{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {kvSliderItems.length > 1 && (
          <>
            {' '}
            {/* Fragment로 묶기 */}
            <div className={kv.buttonWrap}>
              <div className={kv.buttonNext} role="button" tabIndex={0}>
                <Icon name="nav-next" />
              </div>
              <div className={kv.buttonPrev} role="button" tabIndex={0}>
                <Icon name="nav-prev" />
              </div>
            </div>
            {/* 새로운 controls div 추가 */}
            <div className={kv.controls}>
              <div className={kv.pagination}></div> {/* 페이지네이션 엘리먼트 */}
              <button
                type="button"
                onClick={handlePlayPauseToggle}
                className={kv.playPauseButton}
                aria-label={isPlaying ? '일시정지' : '재생'}
              >
                <Icon name={isPlaying ? 'pause' : 'play'} /> {/* 아이콘 변경 */}
              </button>
            </div>
          </>
        )}
      </Swiper>
      {/* 프로그레스 바 마크업 */}
      <div className={kv.progressBarContainer}>
        <div className={kv.progressBar} style={{ width: `${progressWidth}%` }}></div>
      </div>
    </div>
  );
}
