'use client';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import c from '@/app/main/c-log/CLog.module.scss';
import { CLogItem } from '@/lib/notion';
import CLogSkeleton from '@/app/main/c-log/CLogSkeleton';
import ImageWithTheme from '@/common/components/utils/ImageWithTheme';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface CLogProps {
  initialCLogData: CLogItem[];
}

// 개별 카드 컴포넌트 (패럴렉스 효과 적용)
function CLogCard({ item, index }: { item: CLogItem; index: number }) {
  const cardRef = useRef<HTMLLIElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 스크롤 진행도 추적
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'], // 카드가 화면에 들어올 때부터 나갈 때까지
  });

  // 3배수에 따라 다른 이동 거리 설정 (더 다양한 패턴)
  const pattern = index % 3;
  let yRange: [number, number];

  if (pattern === 0) {
    yRange = [60, -60]; // 느린 속도
  } else if (pattern === 1) {
    yRange = [180, -180]; // 빠른 속도
  } else {
    yRange = [120, -120]; // 중간 속도
  }

  // 스크롤에 따른 Y축 변환 + opacity 변환 (데스크탑만)
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  // 모바일은 단순 페이드업
  if (isMobile) {
    return (
      <motion.li
        ref={cardRef}
        className={c.list__item}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: index * 0.1,
        }}
      >
        <Link href={item.link} className={c.list__link}>
          <div className={c.list__imageContainer}>
            <ImageWithTheme
              src={item.imageUrl}
              alt={item.imageAlt}
              className={c.list__image}
              width={400}
              height={300}
              priority
            />
          </div>
          <div className={c.list__content}>
            <h3 className={c.list__title}>{item.title}</h3>
            <div className={c.list__info}>
              <span className={c.list__category}>{item.category}</span>
              <span className={c.list__date}>{item.date}</span>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className={c.list__tag}>
                {item.tags.map((tag) => (
                  <span key={tag} className={c.list__tagItem}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </motion.li>
    );
  }

  // 데스크탑은 스크롤 패럴렉스 + 페이드인
  return (
    <motion.li
      ref={cardRef}
      className={c.list__item}
      style={{ y, opacity }} // 스크롤에 따라 y값과 opacity 변경
    >
      <Link href={item.link} className={c.list__link}>
        <div className={c.list__imageContainer}>
          <ImageWithTheme
            src={item.imageUrl}
            alt={item.imageAlt}
            className={c.list__image}
            width={400}
            height={300}
            priority
          />
        </div>
        <div className={c.list__content}>
          <h3 className={c.list__title}>{item.title}</h3>
          <div className={c.list__info}>
            <span className={c.list__category}>{item.category}</span>
            <span className={c.list__date}>{item.date}</span>
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className={c.list__tag}>
              {item.tags.map((tag) => (
                <span key={tag} className={c.list__tagItem}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.li>
  );
}

export default function CLog({ initialCLogData }: CLogProps) {
  'use memo'; // React 컴파일러 최적화 적용

  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const cLogData = initialCLogData;
  const isLoading = false;
  const isError = false;

  if (isLoading) {
    return (
      <section className={c.cLog}>
        <div className={`${c.inner} inner`}>
          <h2 className={c.title}>C-log</h2>
          <p className={c.desc}>교회의 다양한 이야기를 소개합니다.</p>
          <Link href="/info/c-log" className={c.link} scroll={false}>
            전체 글 보기 <Icon name="arrow-up-right" className={c.link__icon} />
          </Link>
          <div className={c.content}>
            <ul className={c.skeletonList}>
              {/* 메인 페이지는 6개만 표시하므로 6개 스켈레톤 렌더링 */}
              {Array.from({ length: 6 }).map((_, index) => (
                <CLogSkeleton key={index} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={c.cLog}>
        <div className={`${c.inner} inner`}>
          <p className={c.error}>에러: 데이터를 가져오는 데 실패했습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={c.cLog}>
      <div className={`${c.inner} inner`}>
        <motion.h2
          className={c.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          C-log
        </motion.h2>
        <motion.p
          className={c.desc}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
        >
          교회의 다양한 이야기를 소개합니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
        >
          <Link href="/info/c-log" className={c.link}>
            전체 글 보기 <Icon name="arrow-up-right" className={c.link__icon} />
          </Link>
        </motion.div>
        <div className={c.content}>
          {cLogData && cLogData.length > 0 ? (
            <ul className={c.list}>
              {cLogData.map((item: CLogItem, index: number) => (
                <CLogCard key={item.id} item={item} index={index} />
              ))}
            </ul>
          ) : (
            <p className={c.desc}>표시할 Notion 데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
