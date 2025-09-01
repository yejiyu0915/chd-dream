'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import kv from '@/app/main/KV/KV.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade'; // Import fade effect styles
import 'swiper/css/parallax'; // Import parallax effect styles

export default function KV() {
  const slideData = [
    {
      title: '꿈이 이루어지는 행복한 교회',
      description: '순복음인천초대교회에 오신 여러분을 축복하고 환영합니다',
      image: '/main/kv.jpg',
      imageAlt: '순복음인천초대교회',
      link: '/',
    },
    {
      title: '2025 주자랑 여름 수련회',
      description: '청년부, 학생회 합동 수련회를 은혜 중에 마무리했습니다',
      image: '/main/quick-link.jpg',
      imageAlt: '예배 이미지',
      link: '/',
    },
  ];

  return (
    <div className={kv.kv}>
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
          loop={true}
          parallax={true} // Enable parallax effect
          className={kv.slider}
        >
          {slideData.map((slide, index) => (
            <SwiperSlide key={index} data-swiper-parallax="-23%">
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
          <div className={kv.buttonWrap}>
            <div className={kv.buttonPrev}>
              <Icon name="nav-prev" />
            </div>
            <div className={kv.buttonNext}>
              <Icon name="nav-next" />
            </div>
          </div>
        </Swiper>
      </div>
      <div className={kv.news}>
        <h2 className={kv.news__title}>NEWS</h2>
        <ul className={kv.news__list}>
          <li>
            <a href="#" className={kv.news__link}>
              <h3 className={kv.news__listTitle}>추수 감사절 행사 안내</h3>
              <p className={kv.news__listDate}>2025.08.26</p>
            </a>
          </li>
          <li>
            <a href="#" className={kv.news__link}>
              <h3 className={kv.news__listTitle}>
                주자랑 수련회가 은혜로 잘 마무리되었습니다. 도움을 주신 모든 분들께 감사의 말씀을
                전합니다
              </h3>
              <p className={kv.news__listDate}>2025.08.17</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
