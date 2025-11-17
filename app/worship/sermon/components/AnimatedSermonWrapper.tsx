'use client';

import { motion } from 'framer-motion';
import { Children, cloneElement, isValidElement } from 'react';

interface AnimatedSermonWrapperProps {
  children: React.ReactNode;
}

/**
 * 설교 본문 내용을 감싸서 각 요소에 순차 애니메이션을 적용하는 wrapper 컴포넌트
 */
export default function AnimatedSermonWrapper({ children }: AnimatedSermonWrapperProps) {
  // 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'linear' as const, // linear easing으로 일정한 속도
        delay: index * 0.01, // 각 요소마다 0.01초 간격
      },
    }),
  };

  // children을 배열로 변환하고 각각에 애니메이션 적용
  const childrenArray = Children.toArray(children);

  return (
    <>
      {childrenArray.map((child, index) => {
        // 유효한 React 엘리먼트인 경우에만 motion으로 감싸기
        if (isValidElement(child)) {
          return (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '120px' }}
              variants={itemVariants}
            >
              {child}
            </motion.div>
          );
        }
        return child;
      })}
    </>
  );
}
