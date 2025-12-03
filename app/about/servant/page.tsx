'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import s from './Servant.module.scss';
import ServantNav from './components/ServantNav';
import {
  servantData,
  categoryOrder,
  groupServantsByCategory,
  type ServantType,
} from './data/servantData';

export default function ServantPage() {
  // 카테고리별로 그룹화
  const groupedServants = groupServantsByCategory(servantData);

  // 카테고리별 컨테이너 애니메이션 variants
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

  // 카테고리 섹션 애니메이션 variants
  const sectionVariants = {
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

  // 카드 아이템 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className={`${s.servant} detail-inner`}>
      <div className={s.inner}>
        {/* 왼쪽 내비게이션 */}
        <ServantNav />

        {/* 오른쪽 본문 */}
        <div className={s.content}>
          <motion.div
            className={s.categories}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categoryOrder.map((category) => {
              const servants = groupedServants[category];
              if (servants.length === 0) return null;

              return (
                <motion.section
                  key={category}
                  id={`category-${category}`}
                  className={s.category}
                  variants={sectionVariants}
                >
                  <h2 className={s.category__title}>{category}</h2>
                  <div className={s.category__list}>
                    {servants.map((servant) => (
                      <motion.div key={servant.id} className={s.card} variants={itemVariants}>
                        {/* 사진 */}
                        <div className={s.card__image}>
                          {servant.image ? (
                            <Image
                              src={servant.image}
                              alt={servant.name}
                              width={300}
                              height={300}
                              className={s.card__imageImg}
                            />
                          ) : (
                            <div className={s.card__imagePlaceholder}>
                              {/* 이미지 placeholder - 나중에 이미지 추가 예정 */}
                            </div>
                          )}
                        </div>
                        {/* 텍스트 영역 */}
                        <div className={s.card__text}>
                          {/* 이름 */}
                          <h3 className={s.card__name}>{servant.name}</h3>
                          {/* 담당 교구 (있는 경우만) */}
                          {servant.department &&
                            (servant.groupLink ? (
                              <Link href={servant.groupLink} className={s.card__departmentWrapper}>
                                <p className={s.card__department}>{servant.department}</p>
                                <Icon name="arrow-up-right" className={s.card__linkIcon} />
                              </Link>
                            ) : (
                              <p className={s.card__department}>{servant.department}</p>
                            ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
