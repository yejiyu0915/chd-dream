'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import KakaoMap from '@/app/location/components/KakaoMap';
import { contactInfo } from '@/common/data/info';
import l from '@/app/location/Location.module.scss';

export default function LocationPage() {
  return (
    <section className={l.location}>
      <div className={`${l.inner} detail-inner`}>
        {/* 지도 섹션 */}
        <div className={l.map}>
          <h2 className={l.title}>교회 위치</h2>
          <div className={l.map__wrapper}>
            <KakaoMap latitude={37.459679} longitude={126.70066} address={contactInfo.address} />
          </div>
          <p className={l.map__detail}>{contactInfo.address}</p>
          <ul className={l.map__links}>
            <li className={l.map__linkItem}>
              <Link href="https://kko.kakao.com/bU0BvqiluB" target="_blank">
                <Image
                  src="/common/img_kakaomap.png"
                  alt="카카오맵 길찾기"
                  width={50}
                  height={50}
                />
                <span>카카오맵 길찾기</span>
              </Link>
            </li>
            <li className={l.map__linkItem}>
              <Link
                href="https://map.naver.com/p/directions/-/14104250.9394889,4503354.2366581,%ED%96%89%EB%B3%B5%EC%9C%BC%EB%A1%9C%EA%B0%80%EB%8A%94%EA%B5%90%ED%9A%8C,16835124,PLACE_POI/-/transit?c=15.00,0,0,0,dh"
                target="_blank"
              >
                <Image
                  src="/common/img_navermap.png"
                  alt="네이버지도 길찾기"
                  width={50}
                  height={50}
                />
                <span>네이버지도 길찾기</span>
              </Link>
            </li>
            <li className={l.map__linkItem}>
              <Link
                href="https://www.google.co.kr/maps/dir//%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C+%ED%96%89%EB%B3%B5%EC%9C%BC%EB%A1%9C%EA%B0%80%EB%8A%94%EA%B5%90%ED%9A%8C/data=!4m16!1m7!3m6!1s0x357b7be3f066bedf:0xe4ffa7d276f2f719!2z7ZaJ67O17Jy866Gc6rCA64qU6rWQ7ZqM!8m2!3d37.459543!4d126.7006385!16s%2Fg%2F1tdjzj0z!4m7!1m0!1m5!1m1!1s0x357b7be3f066bedf:0xe4ffa7d276f2f719!2m2!1d126.7006385!2d37.459543?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
              >
                <Image
                  src="/common/img_googlemap.png"
                  alt="구글지도 길찾기"
                  width={50}
                  height={50}
                />
                <span>구글지도 길찾기</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* 정보 섹션 */}
        <div className={l.info}>
          <h2 className={l.title}>대중 교통 이용 안내</h2>
        </div>
      </div>
    </section>
  );
}
