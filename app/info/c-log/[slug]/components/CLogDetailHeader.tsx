'use client';

import { motion } from 'framer-motion';
import ImageWithTheme from '@/common/components/utils/ImageWithTheme';
import l from 'common/styles/mdx/MdxLayout.module.scss';

interface CLogDetailHeaderProps {
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  tags: string[]; // 태그 prop 추가
}

export default function CLogDetailHeader({
  title,
  category,
  date,
  imageUrl,
  tags,
}: CLogDetailHeaderProps) {
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

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.1,
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
        {imageUrl && (
          <motion.div
            className={l.image}
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <ImageWithTheme
              src={imageUrl}
              alt={title}
              width={1440}
              height={400}
              priority
            />
          </motion.div>
        )}
        <div className={`detail-inner ${l.content}`}>
          <motion.p className={l.category} initial="hidden" animate="visible" variants={categoryVariants}>
            {category}
          </motion.p>
          <motion.h1 className={l.title} initial="hidden" animate="visible" variants={titleVariants}>
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
