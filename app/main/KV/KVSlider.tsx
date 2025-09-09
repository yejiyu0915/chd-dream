'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import kv from '@/app/main/KV/KV.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { KVSliderItem } from '@/lib/notion';
import { useRef, useEffect } from 'react';
import { Swiper as SwiperCore } from 'swiper/types';
import { useMobileMenu } from '@/common/components/layouts/Header/MobileMenuContext';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';

interface KVSliderProps {
  kvSliderItems: KVSliderItem[];
}

export default function KVSlider({ kvSliderItems }: KVSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const { isMobileMenuOpen } = useMobileMenu();

  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current || !swiperRef.current) return;

      const kvElement = sliderRef.current;
      const { height } = kvElement.getBoundingClientRect();

      const currentScrollY = window.scrollY;
      const isKvVisible = currentScrollY < height;

      if (isKvVisible && !isMobileMenuOpen) {
        swiperRef.current.autoplay.start();
      } else {
        swiperRef.current.autoplay.stop();
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

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
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: `.${kv.buttonPrev}`,
          nextEl: `.${kv.buttonNext}`,
          enabled: true,
          hideOnClick: false,
        }}
        loop={true}
        parallax={true}
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
