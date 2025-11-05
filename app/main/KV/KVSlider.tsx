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
import { useQuery, useQueryClient } from '@tanstack/react-query'; // useQueryClient 임포트 추가
// import KVSliderSkeleton from '@/app/main/KV/KVSliderSkeleton'; // KVSliderSkeleton 임포트 제거

interface KVSliderProps {
  kvHeight: string;
  initialKvSliderItems: KVSliderItem[]; // 서버에서 받은 초기 데이터
}

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';

export default function KVSlider({ kvHeight, initialKvSliderItems }: KVSliderProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const [progressWidth, setProgressWidth] = useState(0); // 프로그레스 바 너비 상태
  const [isPlaying, setIsPlaying] = useState(true); // 재생/일시정지 상태
  const autoplayDelay = 8000; // Autoplay delay (8초)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient(); // QueryClient 인스턴스 가져오기
  const lastModifiedHeaderValue = useRef<string | null>(null); // Last-Modified 헤더 값을 저장할 ref

  // KV Slider 데이터 가져오기 (React Query) - Hooks는 항상 최상단에서 호출
  const fetchKVSliderData = async (): Promise<KVSliderItem[]> => {
    const headers: HeadersInit = {};
    if (lastModifiedHeaderValue.current) {
      headers['If-Modified-Since'] = lastModifiedHeaderValue.current;
    }

    const response = await fetch('/api/kv-slider', { headers }); // API 라우트에서 데이터 가져오기

    if (response.status === 304) {
      // 304 Not Modified 응답이면 캐시된 데이터를 반환
      return (queryClient.getQueryData(['kvSliderItems']) as KVSliderItem[]) || [];
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Last-Modified 헤더 값 저장
    const newLastModified = response.headers.get('Last-Modified');
    if (newLastModified) {
      lastModifiedHeaderValue.current = newLastModified;
    }

    return response.json();
  };

  const {
    data: kvSliderItems,
    isLoading,
    isError,
    error,
  } = useQuery<KVSliderItem[], Error>({
    queryKey: ['kvSliderItems'],
    queryFn: fetchKVSliderData,
    initialData: initialKvSliderItems, // 서버에서 받은 데이터를 초기값으로 사용 (즉시 렌더링)
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (재fetch 방지)
    // refetchInterval: 60 * 1000, // 1분(60초)마다 데이터를 자동으로 다시 가져옵니다. -> 새로고침 시에만 반영되도록 제거
  });

  // useCallback 훅들도 Hooks 규칙을 따르도록 최상단에 선언
  // reset: true면 0%부터 시작, false면 현재 위치에서 계속
  const startProgressBar = useCallback((reset: boolean = true) => {
    if (reset) {
      setProgressWidth(0); // 슬라이드 변경 시 0으로 초기화
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setProgressWidth((prevWidth) => {
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

  const handlePlayPauseToggle = useCallback(() => {
    if (!swiperRef.current) return;

    if (isPlaying) {
      // pause: autoplay와 프로그레스바 멈춤 (현재 위치 유지)
      swiperRef.current.autoplay?.stop();
      stopProgressBar();
    } else {
      // play: 멈춘 위치부터 계속 진행 (reset=false)
      swiperRef.current.autoplay?.start();
      startProgressBar(false); // 현재 위치에서 재개
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, startProgressBar, stopProgressBar]);

  // cleanup: 컴포넌트 언마운트 시 프로그레스바 정리
  useEffect(() => {
    return () => {
      stopProgressBar(); // 인터벌 정리
    };
  }, [stopProgressBar]);

  // Hooks 호출이 모두 완료된 후에 조건부 렌더링 처리
  if (isLoading && !kvSliderItems) {
    return (
      <div
        className={kv.background}
        style={{
          backgroundColor: 'var(--text-main)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: kvHeight,
          minHeight: kvHeight,
        }}
      ></div>
    );
  }

  if (isError) {
    let errorMessage = '슬라이드 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={kv.background} style={{ height: kvHeight, minHeight: kvHeight }}>
        <p className={kv.emptyState}>에러: {errorMessage}</p>
      </div>
    );
  }

  if (!kvSliderItems || kvSliderItems.length === 0) {
    return (
      <div className={kv.background} style={{ height: kvHeight, minHeight: kvHeight }}>
        <p className={kv.emptyState}>슬라이드 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={kv.background} ref={sliderRef}>
      {/* isFetching 중일 때 작은 로딩 인디케이터를 추가할 수 있습니다. */}
      {/* {isFetching && <div className={kv.fetchingIndicator}>업데이트 중...</div>} */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // 초기 로드 시 autoplay와 프로그레스바 시작
          if (isPlaying && swiperRef.current?.autoplay) {
            swiperRef.current.autoplay.start();
            startProgressBar(true); // 처음 시작이므로 0%부터
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
          // 슬라이드 변경 시 (화살표 클릭 또는 autoplay) 프로그레스바를 0%부터 시작
          if (isPlaying) {
            startProgressBar(true); // 새 슬라이드이므로 0%부터 시작
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
            <div className={kv.buttonWrap}>
              <div className={kv.buttonNext} role="button" tabIndex={0}>
                <Icon name="nav-next" />
              </div>
              <div className={kv.buttonPrev} role="button" tabIndex={0}>
                <Icon name="nav-prev" />
              </div>
            </div>
            <div className={kv.controls}>
              <div className={kv.pagination}></div>
              <button
                type="button"
                onClick={handlePlayPauseToggle}
                className={kv.playPauseButton}
                aria-label={isPlaying ? '일시정지' : '재생'}
              >
                <Icon name={isPlaying ? 'pause' : 'play'} />
              </button>
            </div>
          </>
        )}
      </Swiper>
      <div className={kv.progressBarContainer}>
        <div className={kv.progressBar} style={{ width: `${progressWidth}%` }}></div>
      </div>
    </div>
  );
}
