'use client';

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import v from '@/app/about/vision/Vision.module.scss';
import FamilySection from '@/common/components/FamilySection';

// ============================================
// 이미지 프리로드 함수 (초기 버벅임 방지)
// ============================================
const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

// ============================================
// 반짝이는 별 파티클 컴포넌트
// ============================================
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

function StarParticles({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 별 초기화 (모바일에서 크기/개수 축소)
    const isMobile = window.innerWidth < 768;
    const NUM_STARS = isMobile ? 60 : 100;
    const starSizeMin = isMobile ? 1 : 2;
    const starSizeRange = isMobile ? 2 : 3;
    starsRef.current = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * starSizeRange + starSizeMin,
      opacity: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const currentOpacity = star.opacity * twinkle * 0.8 + 0.2;

        ctx.save();
        ctx.globalAlpha = currentOpacity;

        // 중심 원
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // 빛나는 효과 (glow)
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 6);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 십자 빛줄기
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.6})`;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(star.x - star.size * 5, star.y);
        ctx.lineTo(star.x + star.size * 5, star.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(star.x, star.y - star.size * 5);
        ctx.lineTo(star.x, star.y + star.size * 5);
        ctx.stroke();

        ctx.restore();

        // 천천히 위로 이동
        star.y -= star.speed;
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  if (!isActive) return null;

  return <canvas ref={canvasRef} className={v.starParticles} />;
}

// ============================================
// 5번째 섹션 - 십자가 (Split Text 애니메이션)
// ============================================
const CROSS_LINES = [
  '우리 교회는',
  '말씀·기도·사랑이',
  '균형있게 흐르는 영적 공동체로,',
  '시대를 분별하며,',
  '하나님께서 맡기신 사명을',
  '충성되이 감당하는 교회입니다.',
];

function CrossSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0);

  // 배경 이미지 프리로드 (초기 버벅임 방지)
  useEffect(() => {
    preloadImages(['/images/vision/cross.jpg']);
  }, []);

  useEffect(() => {
    // requestAnimationFrame으로 스크롤 핸들러 최적화
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 이미지 fade in (0 ~ 80vh 구간에서)
        const fadeInScrolled = -rect.top;
        const fadeInHeight = windowHeight * 0.8;
        const imgOpacity = Math.max(0, Math.min(fadeInScrolled / fadeInHeight, 1));
        setImageOpacity(imgOpacity);

        // 텍스트 애니메이션 (80vh 이후부터)
        const paddingOffset = windowHeight * 0.8;
        const scrolled = -rect.top - paddingOffset;
        const animationHeight = windowHeight * 2;
        const progress = Math.max(0, Math.min(scrolled / animationHeight, 1));
        setScrollProgress(progress);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const totalChars = CROSS_LINES.reduce((sum, line) => sum + line.length, 0);

  const getCharStyle = (globalIndex: number) => {
    const charProgress = globalIndex / totalChars;
    const revealPoint = scrollProgress * 1.3;

    if (charProgress > revealPoint) {
      return {
        opacity: 0,
        transform: 'translateY(20px)',
        filter: 'blur(4px)',
      };
    }

    const animProgress = Math.min((revealPoint - charProgress) * 8, 1);

    return {
      opacity: animProgress,
      transform: `translateY(${20 * (1 - animProgress)}px)`,
      filter: `blur(${4 * (1 - animProgress)}px)`,
    };
  };

  let charIndex = 0;

  return (
    <section ref={sectionRef} className={v.crossSection}>
      <div className={v.crossPinArea}>
        <div className={v.crossBg} style={{ opacity: imageOpacity }} />
        <StarParticles isActive={imageOpacity > 0.3} />
        <div className={v.crossTopGradient} style={{ opacity: imageOpacity }} />
        <div className={v.crossBottomGradient} style={{ opacity: imageOpacity }} />
        <div className={v.crossGradient} style={{ opacity: imageOpacity }} />
        <div className={v.crossTextWrap}>
          {CROSS_LINES.map((line, lineIndex) => {
            const lineChars = line.split('');
            const lineStartIndex = charIndex;
            charIndex += line.length;

            return (
              <p key={lineIndex} className={v.crossLine}>
                {lineChars.map((char, idx) => (
                  <span
                    key={idx}
                    className={v.crossChar}
                    style={getCharStyle(lineStartIndex + idx)}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Pin 섹션 컴포넌트
// ============================================
interface PinSectionProps {
  children: (scrollProgress: number, sectionOpacity: number) => ReactNode;
  align: 'left' | 'right';
  isFirst?: boolean;
  isLast?: boolean;
  contentClassName?: string;
}

function PinSection({
  children,
  align,
  isFirst = false,
  isLast = false,
  contentClassName,
}: PinSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const [opacity, setOpacity] = useState(isFirst ? 1 : 0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // requestAnimationFrame으로 스크롤 핸들러 최적화 (초기 버벅임 방지)
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrolled = -rect.top;

        const fadeOutStart = windowHeight * 2;
        const fadeOutEnd = windowHeight * 2.5;

        // 텍스트 효과 진행률
        const textEffectStart = 0;
        const textEffectEnd = windowHeight * 1;
        let textProgress = 0;
        if (scrolled <= textEffectStart) {
          textProgress = 0;
        } else if (scrolled >= textEffectEnd) {
          textProgress = 1;
        } else {
          textProgress = (scrolled - textEffectStart) / (textEffectEnd - textEffectStart);
        }
        setScrollProgress(Math.max(0, Math.min(1, textProgress)));

        // Opacity 계산
        let newOpacity = 0;

        if (isFirst) {
          if (scrolled <= fadeOutStart) {
            newOpacity = 1;
          } else if (scrolled > fadeOutStart && scrolled < fadeOutEnd) {
            newOpacity = 1 - (scrolled - fadeOutStart) / (fadeOutEnd - fadeOutStart);
          } else {
            newOpacity = 0;
          }
        } else {
          const fadeInStart = -windowHeight * 0.5;
          const fadeInEndPoint = 0;

          if (scrolled <= fadeInStart) {
            newOpacity = 0;
          } else if (scrolled > fadeInStart && scrolled < fadeInEndPoint) {
            newOpacity = (scrolled - fadeInStart) / (fadeInEndPoint - fadeInStart);
          } else if (scrolled >= fadeInEndPoint && scrolled <= fadeOutStart) {
            newOpacity = 1;
          } else if (scrolled > fadeOutStart && scrolled < fadeOutEnd) {
            newOpacity = 1 - (scrolled - fadeOutStart) / (fadeOutEnd - fadeOutStart);
          } else {
            newOpacity = 0;
          }
        }

        setOpacity(Math.max(0, Math.min(1, newOpacity)));
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFirst]);

  return (
    <section
      ref={sectionRef}
      className={`${v.pinSection} ${align === 'left' ? v.alignLeft : v.alignRight} ${isLast ? v.isLast : ''}`}
    >
      {/* visibility 대신 pointer-events로 변경 (플리커 방지) */}
      <div
        className={v.pinWrapper}
        style={{
          opacity: isLast ? 1 : opacity,
          pointerEvents: opacity === 0 && !isLast ? 'none' : 'auto',
        }}
      >
        <div className={`${v.pinContent} ${contentClassName || ''}`}>
          {children(scrollProgress, opacity)}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 텍스트 하이라이트 컴포넌트
// ============================================
interface TextRevealProps {
  title: string;
  englishTitle?: string;
  label?: string;
  lines: string[];
  align: 'left' | 'right' | 'center';
  scrollProgress: number;
  sectionOpacity?: number;
  image?: string;
  noTitleBlur?: boolean;
}

function TextReveal({
  title,
  englishTitle,
  label,
  lines,
  align,
  scrollProgress,
  sectionOpacity = 1,
  image,
  noTitleBlur = false,
}: TextRevealProps) {
  const titleProgress = Math.min(scrollProgress / 0.25, 1);
  const [animationProgress, setAnimationProgress] = useState(0);
  const isAnimationStartedRef = useRef(false);
  const animationRef = useRef<number>(0);
  const wasHiddenRef = useRef(false); // 섹션이 숨겨졌었는지 추적

  // 섹션 opacity가 낮아지면 숨겨진 것으로 표시
  useEffect(() => {
    if (sectionOpacity < 0.3) {
      wasHiddenRef.current = true;
      // 숨겨지면 애니메이션 리셋
      if (isAnimationStartedRef.current) {
        isAnimationStartedRef.current = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
      setAnimationProgress(0);
    }
  }, [sectionOpacity]);

  // 스크롤 트리거: 특정 위치 도달 시 자동 애니메이션 시작
  useEffect(() => {
    // noTitleBlur인 경우(첫 섹션)는 더 빠르게 트리거
    const triggerPoint = noTitleBlur ? 0.05 : 0.15;

    // 섹션이 다시 보이고 트리거 포인트 이하면 리셋 (재시작 준비)
    if (scrollProgress <= triggerPoint && sectionOpacity > 0.5) {
      if (wasHiddenRef.current || !isAnimationStartedRef.current) {
        wasHiddenRef.current = false;
        isAnimationStartedRef.current = false;
        setAnimationProgress(0);
      }
    }

    // 이미 시작된 경우 무시
    if (isAnimationStartedRef.current) return;

    // 섹션이 보이고 트리거 포인트 도달 시 애니메이션 시작
    if (scrollProgress >= triggerPoint && sectionOpacity > 0.5) {
      isAnimationStartedRef.current = true;
      const startTime = performance.now();

      // 자동 애니메이션 진행
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const duration = 400; // 0.4초 동안 애니메이션 진행

        if (elapsed < duration) {
          const progress = elapsed / duration;
          setAnimationProgress(Math.min(progress, 1));
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setAnimationProgress(1); // 완료 상태 유지
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  }, [scrollProgress, noTitleBlur, sectionOpacity]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 첫 문장부터 끝 문장까지 빠르게 순차적으로 하이라이트 (쫘르르륵 효과)
  const getLineProgress = (lineIndex: number) => {
    const totalLines = lines.length;

    // 각 줄이 순차적으로 나타나도록
    const lineStart = lineIndex / totalLines;
    const lineEnd = (lineIndex + 1) / totalLines;

    if (animationProgress <= lineStart) return 0;
    if (animationProgress >= lineEnd) return 1;

    // 각 줄 내에서도 빠르게 진행
    const lineProgress = (animationProgress - lineStart) / (lineEnd - lineStart);
    return lineProgress;
  };

  const titleBlur = noTitleBlur ? 0 : 5 * (1 - titleProgress);
  const titleOpacity = noTitleBlur ? 1 : 0.3 + 0.7 * titleProgress;
  const descSlideUp = noTitleBlur ? 0 : 80 * (1 - titleProgress);
  // desc는 타이틀 애니메이션과 함께 보이도록 (하이라이트만 자동 애니메이션)
  const descOpacity = noTitleBlur ? 1 : 0.3 + 0.7 * titleProgress;

  const getImageOpacity = () => {
    if (scrollProgress < 0.2) return 0;
    if (scrollProgress < 0.5) return (scrollProgress - 0.2) / 0.3;
    return sectionOpacity;
  };

  const getImageScale = () => {
    if (scrollProgress < 0.2) return 1.1;
    if (scrollProgress < 0.7) {
      const scaleProgress = (scrollProgress - 0.2) / 0.5;
      return 1.1 - 0.1 * scaleProgress;
    }
    return 1;
  };

  const alignClass =
    align === 'center' ? v.alignCenter : align === 'right' ? v.alignRight : v.alignLeft;

  return (
    <div className={`${v.textReveal} ${alignClass}`}>
      <div
        className={v.titleWrap}
        style={{
          filter: `blur(${titleBlur}px)`,
          opacity: titleOpacity,
        }}
      >
        {label && <span className={v.titleLabel}>{label}</span>}
        <h2 className={v.title}>{title}</h2>
        {englishTitle && <span className={v.englishTitle}>{englishTitle}</span>}
      </div>

      <div
        className={v.descWrap}
        style={{
          transform: `translateY(${descSlideUp}px)`,
          opacity: descOpacity,
        }}
      >
        {lines.map((line, index) => (
          <div key={index} className={v.lineWrap}>
            <span className={v.lineLight}>{line}</span>
            <span
              className={v.lineHighlight}
              style={{
                clipPath: `inset(0 ${100 - getLineProgress(index) * 100}% 0 0)`,
              }}
            >
              {line}
            </span>
          </div>
        ))}
      </div>

      {image && (
        <div
          className={`${v.pinImage} ${align === 'right' ? v.imageLeft : v.imageRight}`}
          style={{
            opacity: getImageOpacity(),
            transform: `scale(${getImageScale()})`,
          }}
        >
          {/* 초기 로딩 최적화: eager + sync 디코딩 */}
          <img src={image} alt="" loading="eager" decoding="sync" />
        </div>
      )}
    </div>
  );
}

// ============================================
// 메인 VisionClient 컴포넌트
// ============================================
export default function VisionClient() {
  const visionRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const [pathLength, setPathLength] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLineReady, setIsLineReady] = useState<boolean>(false);
  const [fixedHeight, setFixedHeight] = useState<string>('100vh'); // 초기값은 100vh

  // 1~3섹션 이미지 프리로드 (초기 버벅임 방지)
  useEffect(() => {
    preloadImages(['/images/vision/01.png', '/images/vision/02.png', '/images/vision/03.png']);
  }, []);

  // 모바일 여부 확인 및 고정 높이 설정 (KV와 동일한 방식)
  useEffect(() => {
    // 모바일 디바이스 감지 함수
    const isMobileDevice = () => {
      return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768
      );
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 고정 높이 설정 함수 (모바일 브라우저 툴바 변화 대응)
    const setHeight = () => {
      const newHeight = `${window.innerHeight}px`;
      setFixedHeight(newHeight);
    };

    // 초기 설정
    checkMobile();

    // 모바일에서는 초기 높이만 설정하고 resize 이벤트 무시
    if (isMobileDevice()) {
      // 모바일: 컴포넌트 마운트 시에만 높이 설정 (툴바가 숨겨진 상태의 높이로 고정)
      setHeight();
      // 모바일에서는 checkMobile만 resize 이벤트 리스너 추가 (높이는 고정)
      window.addEventListener('resize', checkMobile);
    } else {
      // 데스크톱: 기존 동작 유지
      setHeight();
      window.addEventListener('resize', checkMobile);
      window.addEventListener('resize', setHeight);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (!isMobileDevice()) {
        window.removeEventListener('resize', setHeight);
      }
    };
  }, []);

  // SVG path 길이 계산
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      setPathLength(length);
      requestAnimationFrame(() => {
        setIsLineReady(true);
      });
    }
  }, [isMobile]);

  // 스크롤 이벤트로 곡선 그려지는 효과 (requestAnimationFrame 최적화)
  useEffect(() => {
    if (pathLength === 0 || !pathRef.current || !visionRef.current) return;

    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!visionRef.current) return;

        const windowHeight = window.innerHeight;
        const visionRect = visionRef.current.getBoundingClientRect();
        const visionHeight = visionRef.current.offsetHeight;

        const scrollStart = -visionRect.top;
        const scrollEnd = visionHeight - windowHeight;
        const scrollProgress = Math.max(0, Math.min(scrollStart / scrollEnd, 1));

        const isMobileView = window.innerWidth <= 768;
        const speedMultiplier = isMobileView ? 2.5 : 1.0;

        if (pathRef.current) {
          const lineProgress = Math.min(scrollProgress * speedMultiplier, 1);
          const drawLength = pathLength - pathLength * lineProgress;
          pathRef.current.style.strokeDashoffset = `${Math.max(0, drawLength)}`;
        }

        if (lineRef.current) {
          const lineProgress = Math.min(scrollProgress * speedMultiplier, 1);
          const translateY = lineProgress * windowHeight * 2;
          lineRef.current.style.transform = `translateY(-${translateY}px)`;
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathLength]);

  return (
    <div ref={visionRef} className={v.vision}>
      {/* 은은한 그라디언트 배경 */}
      <div
        className={v.gradientBg}
        style={{ height: fixedHeight, marginBottom: `-${fixedHeight}` }}
      >
        <div className={v.blur} />
        <div className={v.blur} />
        <div className={v.blur} />
        <div className={v.blur} />
      </div>

      {/* 백그라운드 선 */}
      <div
        className={v.bgLines}
        style={{
          opacity: isLineReady ? 1 : 0,
          height: fixedHeight,
          marginBottom: `-${fixedHeight}`,
        }}
      >
        <div ref={lineRef} className={v.line}>
          <svg
            viewBox={isMobile ? '0 0 500 2000' : '0 0 1920 3000'}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMin slice"
          >
            <defs>
              <linearGradient id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B9F4D" stopOpacity="0.8" />
                <stop offset="20%" stopColor="#ffd700" stopOpacity="0.7" />
                <stop offset="45%" stopColor="#ff9a3c" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#ffb88c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffebd2" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              className={v.svgPath}
              d={
                isMobile
                  ? `M 250 0
                     C 80 200, 80 400, 250 700
                     S 420 1000, 250 1300
                     S 80 1600, 250 2000`
                  : `M 1100 0
                     C 1400 400, 1500 600, 1400 1000
                     C 1300 1400, 600 1600, 500 2000
                     C 400 2400, 800 2600, 1100 3000`
              }
              stroke="url(#mainGradient)"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className={v.content}>
        {/* Pin 섹션 컨테이너 (1~3섹션) */}
        <div className={v.pinContainer}>
          {/* 1. 오직 말씀 */}
          <PinSection align="left" isFirst contentClassName={v.pinContent01}>
            {(progress, sectionOpacity) => (
              <TextReveal
                label="교회표어 1"
                title="오직 말씀"
                englishTitle="Grounded in the Bible"
                lines={[
                  '하나님의 말씀을 깊이 배우고',
                  '바르게 해석하며',
                  '그 가르침을 삶의 현장에서 실천하여',
                  '열매 맺는 교회입니다.',
                ]}
                align="left"
                scrollProgress={progress}
                sectionOpacity={sectionOpacity}
                image="/images/vision/01.png"
                noTitleBlur
              />
            )}
          </PinSection>

          {/* 2. 절대 기도 */}
          <PinSection align="right" contentClassName={v.pinContent02}>
            {(progress, sectionOpacity) => (
              <TextReveal
                label="교회표어 2"
                title="절대 기도"
                englishTitle="Faithful in Prayer"
                lines={[
                  '개인기도와 중보기도,',
                  '그리고 저녁 기도회를 통해',
                  '하나님의 능력을 체험하며',
                  '성령의 인도하심에 순종하는',
                  '교회입니다.',
                ]}
                align="right"
                scrollProgress={progress}
                sectionOpacity={sectionOpacity}
                image="/images/vision/02.png"
              />
            )}
          </PinSection>

          {/* 3. 온전한 사랑 */}
          <PinSection align="left" isLast contentClassName={v.pinContent03}>
            {(progress, sectionOpacity) => (
              <TextReveal
                label="교회표어 3"
                title="온전한 사랑"
                englishTitle="Perfect in Love"
                lines={[
                  '성도 간의 연합, 지역사회를 향한 섬김,',
                  '다음 세대를 향한 사랑의 실천을 통해',
                  '따뜻하고 건강한 공동체를 만들어가는',
                  '교회입니다.',
                ]}
                align="center"
                scrollProgress={progress}
                sectionOpacity={sectionOpacity}
                image="/images/vision/03.png"
              />
            )}
          </PinSection>
        </div>

        {/* Solid 배경 (3섹션 위로 덮이듯이 올라옴) */}
        <div className={v.solidBgSection}>
          {/* 4. 가정 회복 (독립 컴포넌트) */}
          <FamilySection sectionHeight={750} mobileHeight={950} partBreakpoints={[0.2, 0.5, 0.8]} />
        </div>

        {/* 5. 십자가 섹션 */}
        <CrossSection />
      </div>
    </div>
  );
}
