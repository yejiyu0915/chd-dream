/**
 * Framer Motion 등에서 재사용하는 이징·지속시간.
 * prefers-reduced-motion은 MotionConfig·useReducedMotion·Swiper speed에서 별도 처리.
 */
export const motionEaseSmooth = [0.22, 1, 0.36, 1] as const;

export const motionDuration = {
  short: 0.35,
  medium: 0.6,
  /** SectionLayout 제목 */
  sectionTitle: 0.8,
  /** SectionLayout 설명 */
  sectionDesc: 0.7,
} as const;
