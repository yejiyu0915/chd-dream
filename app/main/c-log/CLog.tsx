'use client';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import c from '@/app/main/c-log/CLog.module.scss';
import { CLogItem } from '@/lib/notion';
import { isNewPost } from '@/common/utils/dateUtils';
import CLogSkeleton from '@/app/main/c-log/CLogSkeleton';
import ImageWithTheme from '@/common/components/utils/ImageWithTheme';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface CLogProps {
  initialCLogData: CLogItem[];
}

// 개별 카드 컴포넌트 (패럴렉스 효과 적용)
function CLogCard({ item, index }: { item: CLogItem; index: number }) {
  const cardRef = useRef<HTMLLIElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false); // hydration mismatch 방지
  const [y, setY] = useState(0);
  const [opacity, setOpacity] = useState(0);

  // 클라이언트 마운트 확인 (hydration mismatch 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 모바일 체크
  useEffect(() => {
    if (!mounted) return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

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

  // 직접 스크롤 이벤트로 패럴렉스 효과 구현 (useScroll 경고 방지)
  useEffect(() => {
    if (isMobile || !cardRef.current) return;

    const handleScroll = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // 요소가 화면에 들어올 때부터 나갈 때까지의 진행도 계산
      // start end: 요소 상단이 화면 하단에 닿을 때 (진행도 0)
      // end start: 요소 하단이 화면 상단에 닿을 때 (진행도 1)
      const startPoint = windowHeight; // 요소 상단이 화면 하단에 닿는 지점
      const endPoint = -elementHeight; // 요소 하단이 화면 상단에 닿는 지점
      const totalDistance = startPoint - endPoint;
      const currentPosition = elementTop - endPoint;
      const progress = Math.max(0, Math.min(1, currentPosition / totalDistance));

      // Y축 변환 계산
      const newY = yRange[0] + (yRange[1] - yRange[0]) * progress;
      setY(newY);

      // Opacity 변환 계산 (0 -> 0.2: 0->1, 0.2->0.8: 1, 0.8->1: 1->0.8)
      let newOpacity = 0;
      if (progress <= 0.2) {
        newOpacity = progress / 0.2; // 0 -> 1
      } else if (progress <= 0.8) {
        newOpacity = 1; // 1 유지
      } else {
        newOpacity = 1 - ((progress - 0.8) / 0.2) * 0.2; // 1 -> 0.8
      }
      setOpacity(newOpacity);
    };

    handleScroll(); // 초기 계산
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, yRange]);

  // 모바일은 단순 페이드업 (hydration mismatch 방지를 위해 mounted 확인)
  if (mounted && isMobile) {
    return (
      <motion.li
        ref={cardRef}
        className={c.list__item}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: '-50px' }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: index * 0.1,
        }}
      >
        <Link href={item.link} className={c.list__link}>
          <div className={c.list__imageWrapper}>
            {isNewPost(item.rawDate) && <span className={c.list__newBadge}>NEW</span>}
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
        <div className={c.list__imageWrapper}>
          {isNewPost(item.rawDate) && <span className={c.list__newBadge}>NEW</span>}
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

  // 모바일 체크
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          viewport={{ margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          C-log
        </motion.h2>
        <motion.p
          className={c.desc}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
        >
          교회의 다양한 이야기를 소개합니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: isMobile ? '0px' : '-100px' }}
          transition={{
            opacity: {
              duration: isMobile ? 0.9 : 0.6,
              ease: isMobile ? [0.25, 0.1, 0.25, 1] : [0.22, 1, 0.36, 1],
              delay: isMobile ? 0.15 : 0.2,
            },
          }}
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
