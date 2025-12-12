'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import s from '@/common/components/FamilySection/FamilySection.module.scss';

// ============================================
// 물감 번지는 효과 Canvas 컴포넌트
// ============================================
interface WaterPaintCanvasProps {
  isActive: boolean;
  colors?: string[]; // 파트별 색상 배열
}

function WaterPaintCanvas({ isActive, colors }: WaterPaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const isGeneratedRef = useRef(false);
  const prevActiveRef = useRef(false);

  // isActive가 false → true로 바뀔 때마다 리셋
  useEffect(() => {
    if (!prevActiveRef.current && isActive) {
      isGeneratedRef.current = false;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  // 가우시안 랜덤
  const randomGaussian = useCallback((mean = 0, sd = 1) => {
    let x1, x2, w, y1;
    do {
      x1 = Math.random() * 2 - 1;
      x2 = Math.random() * 2 - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w)) / w);
    y1 = x1 * w;
    return y1 * sd + mean;
  }, []);

  // 랜덤 범위
  const randomBetween = useCallback(
    (min: number, max: number) => Math.random() * (max - min + 1) + min,
    []
  );

  // 정다각형 점 생성
  const getPoly = useCallback((midX: number, midY: number, r: number, edges: number) => {
    const vertices: { x: number; y: number }[] = [];
    const TAU = Math.PI * 2;
    const angleStep = TAU / edges;

    for (let angle = 0; angle < TAU; angle += angleStep) {
      const x = midX + Math.cos(angle) * r;
      const y = midY + Math.sin(angle) * r;
      vertices.push({ x, y });
    }
    return vertices;
  }, []);

  // 폴리곤 변형 (재귀적으로 중간점 추가 + 가우시안 노이즈)
  const deformPoly = useCallback(
    (
      vertices: { x: number; y: number }[],
      depth: number,
      variance: number,
      varianceDecrease: number
    ): { x: number; y: number }[] => {
      const deformedVertices: { x: number; y: number }[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const from = vertices[i];
        const to = i === vertices.length - 1 ? vertices[0] : vertices[i + 1];

        const midX = (from.x + to.x) * 0.5;
        const midY = (from.y + to.y) * 0.5;

        const newX = midX + randomGaussian() * variance;
        const newY = midY + randomGaussian() * variance;

        deformedVertices.push(from);
        deformedVertices.push({ x: newX, y: newY });
      }

      if (depth > 0) {
        return deformPoly(
          deformedVertices,
          depth - 1,
          variance / varianceDecrease,
          varianceDecrease
        );
      }

      return deformedVertices;
    },
    [randomGaussian]
  );

  useEffect(() => {
    if (!isActive || !canvasRef.current || isGeneratedRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isGeneratedRef.current = true;

    const cssWidth = canvas.offsetWidth || 800;
    const cssHeight = canvas.offsetHeight || 400;
    const W = cssWidth * 2;
    const H = cssHeight * 2;
    canvas.width = W;
    canvas.height = H;

    const MID_X = W * 0.5;
    const MID_Y = H * 0.5;

    const EDGES = 12;
    const TAU = Math.PI * 2;
    const isMobile = window.innerWidth < 768;
    const R = Math.min(Math.min(MID_X, MID_Y) * 0.8, isMobile ? 120 : 300);
    const ALPHA = 0.05;
    const WHITE_ALPHA = 0.1;
    const INTERLEAVE = 5;
    const VARIANCE_DEFAULT = 20;
    const NUM_POLIES = 160;
    const DEPTH = 4;
    const NUM_SPOTS = 3;
    const ANGLE_STEP = TAU / NUM_SPOTS;

    // 파트별 색상이 제공되면 사용, 없으면 기본 색상 사용
    const COLORS = colors || [
      `rgba(255, 240, 160, ${ALPHA})`,
      `rgba(255, 255, 255, ${WHITE_ALPHA})`,
      `rgba(255, 180, 180, ${ALPHA})`,
      `rgba(255, 255, 255, ${WHITE_ALPHA})`,
      `rgba(160, 232, 227, ${ALPHA})`,
      `rgba(255, 255, 255, ${WHITE_ALPHA})`,
      `rgba(212, 165, 224, ${ALPHA})`,
      `rgba(255, 255, 255, ${WHITE_ALPHA})`,
    ];

    let polyCount = 0;

    ctx.globalCompositeOperation = 'source-over';

    const drawPoly = (vertices: { x: number; y: number }[], fillColor: string) => {
      const [firstVertex] = vertices;

      ctx.save();
      ctx.translate(MID_X, MID_Y);
      ctx.beginPath();
      ctx.fillStyle = fillColor;
      ctx.moveTo(firstVertex.x, firstVertex.y);

      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }

      ctx.lineTo(firstVertex.x, firstVertex.y);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    const drawLayer = (poly: { x: number; y: number }[], polyIndex: number) => {
      for (let i = 0; i < INTERLEAVE; i++) {
        requestAnimationFrame(() => {
          const deformed = deformPoly(poly, DEPTH, VARIANCE_DEFAULT + randomBetween(15, 25), 4);
          drawPoly(deformed, COLORS[polyIndex % COLORS.length]);
        });
      }
    };

    const polies = new Array(NUM_SPOTS).fill(null).map((_, i) => {
      const poly = getPoly(
        Math.cos(ANGLE_STEP * i) * (R * 0.5) * randomGaussian(1),
        Math.sin(ANGLE_STEP * i) * (R * 0.5) * randomGaussian(1),
        R + randomBetween(-15, 15),
        EDGES
      );
      return deformPoly(poly, DEPTH, VARIANCE_DEFAULT, 2);
    });

    const draw = () => {
      polies.forEach(drawLayer);
      polyCount += INTERLEAVE;

      if (polyCount < NUM_POLIES) {
        rafIdRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isActive, colors, deformPoly, getPoly, randomBetween, randomGaussian]);

  return <canvas ref={canvasRef} className={s.waterPaintCanvas} />;
}

// ============================================
// 가정 회복 섹션 데이터
// ============================================
interface FamilyPart {
  id: string;
  boldText: string;
  restText: string;
  engTitle: string;
  imageCount: number;
}

const FAMILY_PARTS: FamilyPart[] = [
  {
    id: 'husband',
    boldText: '남편',
    restText: '을 세우는 교회',
    engTitle: 'The Church That Raises Up Godly Husbands',
    imageCount: 10,
  },
  {
    id: 'wife',
    boldText: '아내',
    restText: '를 힘있게 하는 교회',
    engTitle: 'The Church That Encourages and Honors Wives in Faith',
    imageCount: 10,
  },
  {
    id: 'children',
    boldText: '자녀',
    restText: '를 성공시키는 교회',
    engTitle: 'The Church That Nurtures Children Toward a Blessed Future',
    imageCount: 10,
  },
];

const IMAGE_PREFIX: Record<string, string> = {
  husband: 'h',
  wife: 'w',
  children: 'c',
};

// 파트별 물감 번지는 색상 세트
const PART_COLORS: Record<string, string[]> = {
  husband: [
    // 남편: 밝은 청록/파랑 계열 (자녀 색상으로 변경)
    `rgba(160, 232, 227, 0.05)`, // 밝은 청록
    `rgba(255, 255, 255, 0.1)`,
    `rgba(180, 220, 255, 0.05)`, // 하늘색
    `rgba(255, 255, 255, 0.1)`,
    `rgba(140, 200, 240, 0.05)`, // 밝은 파랑
    `rgba(255, 255, 255, 0.1)`,
    `rgba(200, 240, 255, 0.05)`, // 연한 하늘색
    `rgba(255, 255, 255, 0.1)`,
  ],
  wife: [
    // 아내: 부드러운 핑크/보라 계열
    `rgba(255, 180, 200, 0.05)`, // 부드러운 핑크
    `rgba(255, 255, 255, 0.1)`,
    `rgba(240, 180, 220, 0.05)`, // 라벤더 핑크
    `rgba(255, 255, 255, 0.1)`,
    `rgba(220, 160, 200, 0.05)`, // 로즈 핑크
    `rgba(255, 255, 255, 0.1)`,
    `rgba(255, 200, 220, 0.05)`, // 밝은 핑크
    `rgba(255, 255, 255, 0.1)`,
  ],
  children: [
    // 자녀: 따뜻한 주황/노랑 계열 (남편 색상으로 변경)
    `rgba(255, 200, 120, 0.05)`, // 따뜻한 오렌지
    `rgba(255, 255, 255, 0.1)`,
    `rgba(255, 220, 150, 0.05)`, // 부드러운 노랑
    `rgba(255, 255, 255, 0.1)`,
    `rgba(255, 180, 100, 0.05)`, // 진한 오렌지
    `rgba(255, 255, 255, 0.1)`,
    `rgba(255, 240, 180, 0.05)`, // 밝은 노랑
    `rgba(255, 255, 255, 0.1)`,
  ],
};

// 그리드 설정
const GRID_COLS_DESKTOP = 10;
const GRID_ROWS_DESKTOP = 7;
const GRID_COLS_MOBILE = 6;
const GRID_ROWS_MOBILE = 12;
const TOTAL_CELLS_DESKTOP = GRID_COLS_DESKTOP * GRID_ROWS_DESKTOP;
const TOTAL_CELLS_MOBILE = GRID_COLS_MOBILE * GRID_ROWS_MOBILE;

// 데스크탑 위치 (10x7)
const PART_CELLS_DESKTOP: number[][] = [
  [0, 5, 14, 22, 31, 49, 54, 63, 9, 68],
  [3, 8, 16, 20, 38, 42, 56, 61, 13, 66],
  [1, 6, 11, 29, 30, 47, 53, 65, 18, 69],
];

// 모바일 위치 (6x12)
const PART_CELLS_MOBILE: number[][] = [
  [1, 8, 13, 20, 23, 49, 56, 61, 66, 71],
  [3, 6, 15, 18, 22, 51, 54, 63, 68, 70],
  [0, 10, 14, 17, 21, 48, 58, 60, 65, 69],
];

// ============================================
// FamilySection 컴포넌트
// ============================================
interface FamilySectionProps {
  scrollDelay?: number; // 스크롤 딜레이 (vh 단위, 기본 1.2 = 120vh)
  className?: string; // 외부 스타일 오버라이드용
  sectionHeight?: number; // 섹션 높이 (vh 단위, 기본 850)
  mobileHeight?: number; // 모바일 높이 (vh 단위, 기본 1000)
  // 파트별 타이밍 (각 파트가 끝나는 progress 비율)
  // 예: [0.25, 0.5, 0.75] = 남편 0~25%, 아내 25~50%, 자녀 50~75%, 유지 75~100%
  partBreakpoints?: [number, number, number];
}

export default function FamilySection({
  scrollDelay = 1.2,
  className,
  sectionHeight = 850,
  mobileHeight = 1000,
  partBreakpoints = [0.25, 0.5, 0.75], // 기본값: 각 파트 25%씩
}: FamilySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollDelayRef = useRef(scrollDelay);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 매 렌더링마다 ref 업데이트 (하이드레이션 이슈 방지)
  scrollDelayRef.current = scrollDelay;

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 현재 그리드 설정
  const TOTAL_CELLS = isMobile ? TOTAL_CELLS_MOBILE : TOTAL_CELLS_DESKTOP;
  const PART_CELLS = isMobile ? PART_CELLS_MOBILE : PART_CELLS_DESKTOP;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // 실제 섹션 높이에서 화면 높이를 빼서 스크롤 가능 영역 계산
      const actualSectionHeight = sectionRef.current.offsetHeight - windowHeight;

      const scrolled = -rect.top;
      const delay = windowHeight * scrollDelayRef.current; // ref에서 딜레이 값 사용
      const adjustedScrolled = scrolled - delay;
      const progress = Math.max(0, Math.min(adjustedScrolled / actualSectionHeight, 1));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 파트별 진행률 계산 (partBreakpoints 사용)
  const getPartProgress = (partIndex: number) => {
    const partStart = partIndex === 0 ? 0 : partBreakpoints[partIndex - 1];
    const partEnd = partBreakpoints[partIndex] ?? 1;
    const partDuration = partEnd - partStart;

    if (scrollProgress < partStart) return 0;
    if (scrollProgress >= partEnd) return 1;
    return (scrollProgress - partStart) / partDuration;
  };

  // 현재 활성화된 파트 (partBreakpoints 사용)
  const getActivePartIndex = () => {
    if (scrollProgress < partBreakpoints[0]) return 0;
    if (scrollProgress < partBreakpoints[1]) return 1;
    if (scrollProgress < partBreakpoints[2]) return 2;
    return 2;
  };

  // 이미지 opacity 계산
  const getImageOpacity = (partIndex: number, imageIndex: number) => {
    const partProgress = getPartProgress(partIndex);
    const imageThreshold = (imageIndex + 1) / FAMILY_PARTS[partIndex].imageCount;
    const imageStart = imageThreshold * 0.8 - 0.1;
    const imageEnd = imageThreshold * 0.8;

    if (partProgress < imageStart) return 0;
    if (partProgress >= imageEnd) return 1;
    return (partProgress - imageStart) / (imageEnd - imageStart);
  };

  const activePartIndex = getActivePartIndex();
  const gridOpacity = Math.min(scrollProgress * 5, 1);

  // 섹션 높이 계산 (props로 받은 값 사용)
  const currentHeight = isMobile ? mobileHeight : sectionHeight;

  return (
    <section
      ref={sectionRef}
      className={`${s.familySection} ${className || ''}`}
      style={{ height: `${currentHeight}vh` }}
    >
      <div className={s.familyWrapper}>
        {/* 그리드 백그라운드 */}
        {/* visibility 제거: opacity 0일 때도 레이어 유지하여 플리커 방지 */}
        <div
          className={s.familyGrid}
          style={{
            opacity: gridOpacity,
            // pointer-events로 상호작용만 차단 (레이어는 유지)
            pointerEvents: gridOpacity > 0 ? 'auto' : 'none',
          }}
        >
          {Array.from({ length: TOTAL_CELLS }).map((_, cellIndex) => {
            let cellContent = null;

            FAMILY_PARTS.forEach((part, partIndex) => {
              const cellsForPart = PART_CELLS[partIndex];
              const imageIndex = cellsForPart.indexOf(cellIndex);

              if (imageIndex !== -1) {
                const opacity = getImageOpacity(partIndex, imageIndex);
                const prefix = IMAGE_PREFIX[part.id];
                const imageNum = imageIndex + 1;
                const imageSrc = `/images/vision/${prefix}${imageNum}.jpg`;

                cellContent = (
                  <div className={s.familyGridImage} style={{ opacity }} data-part={part.id}>
                    {/* 플리커 방지: eager 로딩 + sync 디코딩으로 이미지 로드 최적화 */}
                    <img
                      src={imageSrc}
                      alt={`${part.boldText}${part.restText} ${imageNum}`}
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                );
              }
            });

            return (
              <div key={cellIndex} className={s.familyGridCell}>
                {cellContent}
              </div>
            );
          })}
        </div>

        {/* 파트 타이틀 (가운데) */}
        <div className={s.familyTitleContainer}>
          {FAMILY_PARTS.map((part, index) => {
            const isActive = index === activePartIndex;
            const partProgress = getPartProgress(index);

            let titleOpacity = 0;
            if (isActive) {
              if (partProgress < 0.2) {
                titleOpacity = partProgress / 0.2;
              } else if (partProgress > 0.8) {
                titleOpacity = index === 2 ? 1 : 1 - (partProgress - 0.8) / 0.2;
              } else {
                titleOpacity = 1;
              }
            }

            const shouldStartCanvas = isActive && partProgress > 0.05;
            const underlineWidth = titleOpacity > 0.3 ? 100 : 0;

            return (
              <div
                key={part.id}
                className={s.familyPartTitleWrap}
                style={{
                  opacity: titleOpacity,
                  // visibility 대신 pointer-events로 처리 (플리커 방지)
                  pointerEvents: titleOpacity > 0 ? 'auto' : 'none',
                }}
              >
                <WaterPaintCanvas isActive={shouldStartCanvas} colors={PART_COLORS[part.id]} />
                <div className={s.familyPartTitleGroup}>
                  <span className={s.familyPartLabel}>가정회복 {index + 1}</span>
                  <h2 className={s.familyPartTitle}>
                    <span className={s.titleBold}>{part.boldText}</span>
                    {part.restText}
                    <span className={s.titleUnderline} style={{ width: `${underlineWidth}%` }} />
                  </h2>
                  <p className={s.familyPartEngTitle}>{part.engTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
