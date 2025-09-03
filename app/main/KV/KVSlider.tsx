'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import kv from '@/app/main/KV/KV.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation, EffectFade } from 'swiper/modules';
// import { getKVSliderData, KVSliderItem } from '@/lib/notion'; // 데이터 가져오기 로직은 서버 컴포넌트로 이동, 임포트 제거
import { KVSliderItem } from '@/lib/notion'; // KVSliderItem만 임포트

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade'; // Import fade effect styles
import 'swiper/css/parallax'; // Import parallax effect styles

interface KVSliderProps {
  kvSliderItems: KVSliderItem[]; // props로 kvSliderItems 받도록 변경
}

export default function KVSlider({ kvSliderItems }: KVSliderProps) {
  // async 키워드 제거, props로 받음
  // 데이터가 없는 경우를 위한 폴백
  if (kvSliderItems.length === 0) {
    return (
      <div className={kv.background}>
        <p className={kv.emptyState}>슬라이드 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={kv.background}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]} // Add EffectFade here
        spaceBetween={0}
        slidesPerView={1}
        effect="fade" // Add fade effect
        fadeEffect={{ crossFade: true }} // Add for seamless fade
        speed={1000} // Add speed for slower transition, e.g., 1500ms
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
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
