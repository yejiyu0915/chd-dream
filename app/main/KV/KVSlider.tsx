'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import kv from '@/app/main/KV/KV.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation, EffectFade } from 'swiper/modules';
// import { getKVSliderData, KVSliderItem } from '@/lib/notion'; // 데이터 가져오기 로직은 서버 컴포넌트로 이동, 임포트 제거
import { KVSliderItem } from '@/lib/notion'; // KVSliderItem만 임포트
import { useRef, useEffect } from 'react'; // Import necessary hooks
import { Swiper as SwiperCore } from 'swiper/types'; // SwiperCore 타입 임포트
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext'; // useMobileMenu 훅 임포트

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade'; // Import fade effect styles
import 'swiper/css/parallax'; // Import parallax effect styles

interface KVSliderProps {
  kvSliderItems: KVSliderItem[]; // props로 kvSliderItems 받도록 변경
  // isMobileMenuOpen: boolean; // isMobileMenuOpen prop 제거
}

export default function KVSlider({ kvSliderItems }: KVSliderProps) {
  // isMobileMenuOpen prop 제거
  const sliderRef = useRef<HTMLDivElement>(null); // 슬라이더 컨테이너를 위한 ref 생성
  const swiperRef = useRef<SwiperCore | null>(null); // Swiper 인스턴스를 저장하기 위한 ref
  const { isMobileMenuOpen } = useMobileMenu(); // MobileMenuContext에서 isMobileMenuOpen 가져오기

  // isVisible 상태 변경에 따라 Swiper 자동 재생을 제어하는 useEffect
  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current || !swiperRef.current) return;

      const kvElement = sliderRef.current;
      const { height } = kvElement.getBoundingClientRect();

      const currentScrollY = window.scrollY;
      const isKvVisible = currentScrollY < height;

      // 모바일 메뉴가 열려있지 않고 (not isMobileMenuOpen) KV가 보일 때만 자동 재생 시작
      if (isKvVisible && !isMobileMenuOpen) {
        swiperRef.current.autoplay.start();
      } else {
        swiperRef.current.autoplay.stop();
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 컴포넌트 마운트 시 초기 상태 설정

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]); // isMobileMenuOpen 상태 변경 시에도 useEffect 재실행

  // 데이터가 없는 경우를 위한 폴백
  if (kvSliderItems.length === 0) {
    return (
      <div className={kv.background}>
        <p className={kv.emptyState}>슬라이드 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={kv.background} ref={sliderRef}>
      {' '}
      {/* ref를 슬라이더 컨테이너에 연결 */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]} // Add EffectFade here
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Swiper 인스턴스를 swiperRef에 저장
        spaceBetween={0}
        slidesPerView={1}
        effect="fade" // Add fade effect
        fadeEffect={{ crossFade: true }} // Add for seamless fade
        speed={1000} // Add speed for slower transition, e.g., 1500ms
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }} // autoplay는 항상 활성화 상태로 두고, isVisible에 따라 수동으로 제어
        pagination={{ clickable: true }}
        navigation={{
          prevEl: `.${kv.buttonPrev}`,
          nextEl: `.${kv.buttonNext}`,
          enabled: true, // Enable navigation
          hideOnClick: false,
        }}
        loop={true} // loop 모드 다시 활성화
        parallax={true} // Enable parallax effect
        className={kv.slider}
      >
        {kvSliderItems.map((slide) => (
          <SwiperSlide key={slide.id} data-swiper-parallax="-23%">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-swiper-parallax="-23%" // Apply parallax to the image
            />
            <div className={kv.overlay}></div> {/* Move overlay inside SwiperSlide */}
            <div className={kv.content}>
              <div className={kv.content__text}>
                <Link href={slide.link} className={kv.content__title}>
                  <h1>{slide.title}</h1> <Icon name="arrow-up-right" />
                </Link>
                {/* Apply parallax to title */}
                <p className={kv.content__desc}>{slide.description}</p>{' '}
                {/* Apply parallax to description */}
              </div>
            </div>
          </SwiperSlide>
        ))}
        {kvSliderItems.length > 1 && ( // 슬라이드가 1개 초과일 때만 렌더링
          <div className={kv.buttonWrap}>
            <div className={kv.buttonPrev}>
              <Icon name="nav-prev" />
            </div>
            <div className={kv.buttonNext}>
              <Icon name="nav-next" />
            </div>
          </div>
        )}
      </Swiper>
    </div>
  );
}
