'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import s from '@/app/about/pastor/Pastor.module.scss';

export default function PastorContent() {
  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.1,
      },
    },
  };

  return (
    <div className={`${s.pastor} detail-inner`}>
      {/* 프로필 + 인사말 영역 (PC에서 row 배치) */}
      <motion.div
        className={s.profileSection}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 인사말/소개글 */}
        <motion.div className={s.greeting} variants={itemVariants}>
          {/* 인사말 내용은 나중에 추가 예정 */}
          <strong>
            할렐루야!
            <br />
            이곳을 찾아주신 모든 분들께
            <br />
            주님의 은혜와 평강이 가득하기를 소망하며,
            <br />
            주님의 이름으로 환영하고 축복합니다.
          </strong>
          <br />
          <br />
          하나님께서 우리를 이 자리에 이끄신 것은 우연이 아니라, 분명한 뜻과 계획 가운데 이루어진
          일입니다.
          <br />
          <br />
          <p>
            <strong>행복으로가는교회는</strong>
            <br />
            <span style={{ display: 'flex', gap: '0.25em' }}>
              <strong className={s.highlight}>말씀...</strong>
              <span>
                을 통해 {''}
                <span className={s.underline}>삶 속에서 하나님께서 전하시는 사랑을 깨닫고,</span>
              </span>
            </span>
            <span style={{ display: 'flex', gap: '0.25em' }}>
              <strong className={s.highlight}>기도...</strong>
              <span>
                를 통해 <span className={s.underline}>하나님의 응답을 경험하며,</span>
              </span>
            </span>
            <span style={{ display: 'flex', gap: '0.25em' }}>
              <strong className={s.highlight}>사랑...</strong>
              <span>
                을 통해 {''}
                <span className={s.underline}>
                  서로를 품고 주 안에서 평안과 행복을 이루어 가는 공동체입니다.
                </span>
              </span>
            </span>
          </p>
          <br />
          우리 교회가 말씀 위에 굳게 서고, 기도로 숨 쉬며, 사랑 안에서 온전해지도록 주님께서 먼저
          길을 열어 주셨습니다.
          <br />
          그리고 그 사명을 함께 감당하도록 우리 모두를 한마음으로 묶어 주셨습니다.
          <br />
          <br />
          이 부르심을 통해 성도님들의 가정과 일터, 그리고 모든 일상 속에 하나님의 사랑이 흘러가기를
          소망하며, 주님의 사랑을 삶으로 증거하는 교회와 성도님들이 될 수 있도록 함께 기도해 주시기
          바랍니다.
          <br />
          <br />
          이 자리에까지 인도하시고, 지금도 우리와 함께하시는 하나님께 모든 영광과 찬송을 올려드리며,
          성도님 한 분 한 분을 주님의 이름으로 축복합니다.
          <br />
          <br />
          <p style={{ textAlign: 'right' }}>
            <strong>담임목사 김영구 드림.</strong>
          </p>
        </motion.div>
        {/* 프로필 영역 (사진 + 이름/직책) */}
        <motion.div className={s.profile} variants={itemVariants}>
          {/* 사진 영역 */}
          <motion.div className={s.image} variants={imageVariants}>
            <Image
              src="/images/common/pastor.jpg"
              alt="김영구 목사"
              width={300}
              height={400}
              className={s.imageImg}
              priority
            />
          </motion.div>

          {/* 이름/직책 영역 */}
          <div className={s.info}>
            <h1 className={s.name}>김영구 목사</h1>
            <p className={s.position}>행복으로가는교회 담임목사</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
