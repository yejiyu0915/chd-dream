'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import KakaoMap from '@/app/location/components/KakaoMap';
import { contactInfo } from '@/common/data/info';
import l from '@/app/location/Location.module.scss';

export default function LocationPage() {
  // 애니메이션 variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.15, // 각 섹션마다 0.15초 간격
      },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.1, // 각 아이템마다 0.1초 간격
      },
    }),
  };

  const linkVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.1, // 각 링크마다 0.1초 간격
      },
    }),
  };

  return (
    <>
      <div className={`${l.inner} detail-inner`}>
        {/* 지도 섹션 */}
        <motion.div
          className={l.map}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '50px' }}
          variants={sectionVariants}
        >
          <h2 className={l.title}>교회 위치</h2>
          <div className={l.map__wrapper}>
            <KakaoMap latitude={37.459679} longitude={126.70066} address={contactInfo.address} />
          </div>
          <p className={l.map__detail}>{contactInfo.address}</p>
          <motion.ul
            className={l.map__links}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: '50px' }}
          >
            {[
              {
                href: 'https://kko.kakao.com/bU0BvqiluB',
                imgSrc: '/images/common/map-kakao.png',
                alt: '카카오맵 길찾기',
                label: '카카오맵 길찾기',
              },
              {
                href: 'https://map.naver.com/p/directions/-/14104250.9394889,4503354.2366581,%ED%96%89%EB%B3%B5%EC%9C%BC%EB%A1%9C%EA%B0%80%EB%8A%94%EA%B5%90%ED%9A%8C,16835124,PLACE_POI/-/transit?c=15.00,0,0,0,dh',
                imgSrc: '/images/common/map-naver.png',
                alt: '네이버지도 길찾기',
                label: '네이버지도 길찾기',
              },
              {
                href: 'https://www.google.co.kr/maps/dir//%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C+%ED%96%89%EB%B3%B5%EC%9C%BC%EB%A1%9C%EA%B0%80%EB%8A%94%EA%B5%90%ED%9A%8C/data=!4m16!1m7!3m6!1s0x357b7be3f066bedf:0xe4ffa7d276f2f719!2z7ZaJ67O17Jy866Gc6rCA64qU6rWQ7ZqM!8m2!3d37.459543!4d126.7006385!16s%2Fg%2F1tdjzj0z!4m7!1m0!1m5!1m1!1s0x357b7be3f066bedf:0xe4ffa7d276f2f719!2m2!1d126.7006385!2d37.459543?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D',
                imgSrc: '/images/common/map-google.png',
                alt: '구글지도 길찾기',
                label: '구글지도 길찾기',
              },
            ].map((item, index) => (
              <motion.li
                className={l.map__linkItem}
                key={item.href}
                custom={index}
                variants={linkVariants}
              >
                <Link href={item.href} target="_blank">
                  <Image src={item.imgSrc} alt={item.alt} width={50} height={50} />
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* 정보 섹션 */}
        <motion.div
          className={l.info}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '50px' }}
          variants={sectionVariants}
        >
          <h2 className={l.title}>오시는 길</h2>
          <div className={l.info__content}>
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '50px' }}
              variants={itemVariants}
            >
              <h3 className={l.info__contentTitle}>지하철</h3>
              <ul className={l.info__contentList}>
                <li className={l.info__contentItem}>
                  <p className={l.info__contentItemTitle}>
                    <span className={l.subway1}>인천 1호선</span>
                  </p>
                  <p className={l.info__contentItemValue}>인천시청역 9번 출구(도보 5분)</p>
                </li>
                <li className={l.info__contentItem}>
                  <p className={l.info__contentItemTitle}>
                    <span className={l.subway2}>인천 2호선</span>
                  </p>
                  <p className={l.info__contentItemValue}>인천시청역 8번 출구(도보 4분)</p>
                </li>
              </ul>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '50px' }}
              variants={itemVariants}
            >
              <h3 className={l.info__contentTitle}>버스</h3>
              <ul className={l.info__contentList}>
                <li className={l.info__contentItem}>
                  <p className={l.info__contentItemTitle}>
                    <span className={l.busBlue}>33번</span>
                    <span className={l.busBlue}>8번</span>
                    <span className={l.busGreen}>540번</span>
                    <span className={l.busGreen}>566번</span>
                    <span className={l.busRed}>1601번</span>
                  </p>
                  <p className={l.info__contentItemValue}>극동.금호아파트 정류장(도보 5분)</p>
                </li>
                <li className={l.info__contentItem}>
                  <p className={l.info__contentItemTitle}>
                    <span className={l.busGreen}>540번</span>
                  </p>
                  <p className={l.info__contentItemValue}>석산로 정류장(도보 4분)</p>
                </li>
              </ul>
            </motion.div>
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '50px' }}
              variants={itemVariants}
            >
              <h3 className={l.info__contentTitle}>자차 이용 안내</h3>
              <p className={l.info__contentDesc}>서울외곽도로 - 서창IC(남동공단) - 시청방향</p>
            </motion.div>
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '50px' }}
              variants={itemVariants}
            >
              <h3 className={l.info__contentTitle}>차량 운행 안내</h3>
              <p className={l.info__contentDesc}>
                차량 운행 문의는 부속실 또는 남선교로 부탁드립니다.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
