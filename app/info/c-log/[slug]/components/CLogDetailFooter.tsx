'use client';

import { motion } from 'framer-motion';
import l from '@/common/styles/mdx/MdxLayout.module.scss'; // 필요한 다른 스타일이 있다면 유지
import { PrevNextCLogPosts } from '@/lib/notion'; // PrevNextCLogPosts 타입 임포트
import Button from '@/common/components/utils/Button'; // Button 컴포넌트 임포트
import ListNavButtons from '@/common/components/utils/ListNavButtons'; // ListNavButtons 컴포넌트 임포트

interface CLogDetailFooterProps {
  prevPost: PrevNextCLogPosts['prev'];
  nextPost: PrevNextCLogPosts['next'];
}

export default function CLogDetailFooter({ prevPost, nextPost }: CLogDetailFooterProps) {
  // Footer 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={`${l.footer} detail-inner`}
      initial="hidden"
      whileInView="visible"
      viewport={{   margin: '100px' }}
      variants={containerVariants}
    >
      {/* 목록으로 돌아가기 버튼 */}
      <motion.div className="footer-button__wrapper" variants={itemVariants}>
        <Button href="/info/c-log" variant="footer-button">
          목록으로
        </Button>
      </motion.div>

      {/* 이전/다음 포스트 네비게이션 */}
      <motion.div variants={itemVariants}>
        <ListNavButtons prevPost={prevPost} nextPost={nextPost} basePath="/info/c-log" />
      </motion.div>
    </motion.div>
  );
}
