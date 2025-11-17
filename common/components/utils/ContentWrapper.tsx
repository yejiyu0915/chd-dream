'use client';

import { motion } from 'framer-motion';

interface ContentWrapperProps {
  children: React.ReactNode;
}

/**
 * MDX 콘텐츠를 감싸서 애니메이션을 적용하는 클라이언트 컴포넌트
 * MDXRemote는 서버 컴포넌트로 유지하면서 애니메이션만 클라이언트에서 처리
 */
export default function ContentWrapper({ children }: ContentWrapperProps) {
  // 본문 애니메이션 variants
  const contentVariants = {
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

  return (
    <motion.div initial="hidden" animate="visible" variants={contentVariants}>
      {children}
    </motion.div>
  );
}
