'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import s from '../Pastor.module.scss';
import { ExternalNewsItem } from '../data/pastorNewsData';

interface PastorContentProps {
  externalNews: ExternalNewsItem[];
}

export default function PastorContent({ externalNews }: PastorContentProps) {
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
          인사말이 들어갈 영역입니다. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Voluptatum tenetur beatae asperiores accusantium eos illum, quasi in reiciendis,
          laboriosam molestias deleniti eaque! Veritatis harum nulla, non neque dicta eveniet a.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vitae, alias quasi
          explicabo aperiam dignissimos reprehenderit quo rerum natus et debitis nisi odit vel
          cumque repellendus accusamus porro optio molestias soluta laborum dicta pariatur minima
          obcaecati? Nostrum ipsam quis repellendus vitae maiores mollitia maxime architecto
          perspiciatis doloremque doloribus, iusto quidem cum adipisci nihil culpa magnam possimus
          perferendis et sapiente? Eos hic eligendi repellendus? Non atque, possimus cupiditate eos
          eaque totam nostrum praesentium, accusamus facilis esse consectetur iste maiores, sequi
          harum itaque exercitationem facere neque sed? Perferendis ducimus saepe ea at ipsa
          dignissimos, consequuntur molestias dolores eveniet nesciunt. Voluptatibus cum corporis,
          consequatur ducimus recusandae, ut voluptates sapiente repellat error facilis eos
          molestiae, deleniti iusto voluptate possimus cumque facere quo qui ipsam libero
          voluptatem!
        </motion.div>
        {/* 프로필 영역 (사진 + 이름/직책) */}
        <motion.div className={s.profile} variants={itemVariants}>
          {/* 사진 영역 */}
          <motion.div className={s.image} variants={imageVariants}>
            <Image
              src="/images/servant/00.png"
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
