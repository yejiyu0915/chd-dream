'use client';

import { motion } from 'framer-motion';
import ImageWithTheme from '@/common/components/utils/ImageWithTheme';
import l from '@/common/styles/mdx/MdxLayout.module.scss';

interface NoticeDetailHeaderProps {
  title: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export default function NoticeDetailHeader({
  title,
  date,
  imageUrl,
  tags,
}: NoticeDetailHeaderProps) {
  // 애니메이션 variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.2,
      },
    },
  };

  const dateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.35,
      },
    },
  };

  const tagContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  };

  const tagItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <>
      <div className={l.header}>
        {/* 이미지는 항상 표시 (기본 이미지 포함) */}
        <motion.div className={l.image} initial="hidden" animate="visible" variants={imageVariants}>
          <ImageWithTheme
            src={imageUrl}
            alt={title}
            priority
            width={1440}
            height={400}
            sizes="100vw"
          />
        </motion.div>
        <div className={`detail-inner ${l.content}`}>
          <motion.h1
            className={l.title}
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            {title}
          </motion.h1>
          <motion.p className={l.date} initial="hidden" animate="visible" variants={dateVariants}>
            {date}
          </motion.p>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <motion.div
          className={`detail-inner ${l.tagContainer}`}
          initial="hidden"
          animate="visible"
          variants={tagContainerVariants}
        >
          {tags.map((tag) => (
            <motion.span key={tag} className={l.tagItem} variants={tagItemVariants}>
              #{tag}
            </motion.span>
          ))}
        </motion.div>
      )}
    </>
  );
}
