'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import { getClientSeason } from '@/common/utils/season';
import { quickLinkData } from '@/common/data/info';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import q from '@/app/main/quick-link/QuickLink.module.scss';

export default function QuickLink() {
  // 계절별 배경 이미지 자동 설정 (개발자 도구에서 data-season 변경 시 반응)
  const [backgroundImage, setBackgroundImage] = useState(`/images/title/winter/info.jpg`);

  useEffect(() => {
    const season = getClientSeason();
    setBackgroundImage(`/images/title/${season}/info.jpg`);

    // data-season 속성 변경 감지 (개발자 도구에서 테스트용)
    const observer = new MutationObserver(() => {
      const newSeason = getClientSeason();
      setBackgroundImage(`/images/title/${newSeason}/info.jpg`);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-season'],
    });

    return () => observer.disconnect();
  }, []);

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // 각 아이템이 0.15초 간격으로 나타남
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
        ease: [0.22, 1, 0.36, 1] as const, // 부드러운 easing
      },
    },
  };

  return (
    <section className={q.quickLink} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="inner">
        {/* 타이틀 페이드업 */}
        <motion.div
          className={q.title__wrap}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <h2 className="sr-only">Quick Link</h2>
          <p className={q.title}>
            행복으로가는교회에 오신
            <br />
            <strong>여러분을 환영합니다</strong>
          </p>
        </motion.div>
        <div className={q.content}>
          {/* 리스트 아이템들 순차 애니메이션 */}
          <motion.div
            className={q.list}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: '-50px' }}
          >
            {quickLinkData.map((row, rowIndex) => (
              <div key={rowIndex} className={q.list__row}>
                {row.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    className={`${q.list__item} ${item.size === 'lg' ? q.list__itemLg : ''}`}
                    variants={itemVariants}
                  >
                    <Link href={item.href}>
                      <p className={q.list__title}>
                        <Icon name={item.icon} /> {item.title}
                      </p>
                      <p className={q.list__desc}>{item.description}</p>
                      <div className={q.list__icon}>
                        <Icon name="arrow-up-right" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
          {/* 이미지 페이드인 */}
          <motion.div
            className={q.pic}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
          >
            <Image
              src="/images/common/quick-link.jpg"
              alt="행복으로가는교회"
              width={400}
              height={500}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
