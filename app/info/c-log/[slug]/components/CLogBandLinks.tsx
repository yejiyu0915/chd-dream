'use client';

import { motion } from 'framer-motion';
import Button from '@/common/components/utils/Button';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/info/c-log/[slug]/components/CLogBandLinks.module.scss';
import Link from 'next/link';

interface CLogBandLinksProps {
  band1: string | null;
  band2: string | null;
}

export default function CLogBandLinks({ band1, band2 }: CLogBandLinksProps) {
  // 링크가 하나도 없으면 렌더링하지 않음
  if (!band1 && !band2) {
    return null;
  }

  // 링크 배열 생성 (null이 아닌 것만)
  const bandLinks = [band1, band2].filter((link): link is string => link !== null);

  const containerVariants = {
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
    <motion.section
      className={`${s.bandLinks} detail-inner`}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: '100px' }}
      variants={containerVariants}
    >
      <div className={s.content}>
        <div>
          <p className={s.description}>
            <strong>
              ♥️ 더 많은 사진은{' '}
              <Link
                href="https://band.us/band/5843149"
                target="_blank"
                rel="noopener noreferrer"
                className={s.bandLink}
              >
                행복으로가는교회 네이버 밴드
              </Link>
              에서 확인하세요!
            </strong>
          </p>
          <p className={s.inquiry}>
            <strong>※ 밴드 가입 문의:</strong> 담당 교역자 또는 부속실
          </p>
        </div>
        <div className={s.buttonWrapper}>
          {bandLinks.map((link, index) => (
            <Button
              key={index}
              href={link}
              className={s.bandButton}
              icon="external-link"
              iconPosition="right"
              disableAnimation={true}
              {...(link.startsWith('http') && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              <Icon name="sns-band" className={s.bandIcon} />
              사진 더보기{bandLinks.length > 1 ? ` #${index + 1}` : ''}
            </Button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
