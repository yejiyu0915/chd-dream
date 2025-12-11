/**
 * Revalidate 시간 설정 (초 단위)
 *
 * 프로덕션 환경에서 데이터 캐시 및 재검증 시간을 중앙에서 관리
 *
 * 사용 예시:
 * - REVALIDATE_TIME.SHORT: 자주 업데이트되는 콘텐츠 (메인 페이지)
 * - REVALIDATE_TIME.MEDIUM: 일반 리스트 페이지
 * - REVALIDATE_TIME.LONG: 상세 페이지 (잘 변경되지 않는 콘텐츠)
 */

export const REVALIDATE_TIME = {
  // 30초 - 메인 페이지, KV 슬라이더 등 자주 업데이트되는 콘텐츠
  SHORT: 30,

  // 1분 (60초) - 뉴스 리스트, 메인 노출 콘텐츠
  MEDIUM: 60,

  // 3분 (180초) - 일반 리스트 페이지 (캐시 유지하고 수동 갱신)
  LIST: 180,

  // 10분 (600초) - 잘 변경되지 않는 콘텐츠
  LONG: 600,

  // 1시간 (3600초) - 상세 페이지 콘텐츠
  DETAIL: 3600,
} as const;

/**
 * 개발 환경에서는 캐시 비활성화 (0초)
 * 프로덕션 환경에서는 지정된 시간 사용
 */
export const getRevalidateTime = (seconds: number): number => {
  return process.env.NODE_ENV === 'development' ? 0 : seconds;
};

/**
 * 페이지별 revalidate 시간 (필요시 사용)
 */
export const PAGE_REVALIDATE = {
  // 메인 페이지
  HOME: REVALIDATE_TIME.SHORT,

  // 리스트 페이지
  NEWS_LIST: REVALIDATE_TIME.LIST,
  NOTICE_LIST: REVALIDATE_TIME.LIST,
  CLOG_LIST: REVALIDATE_TIME.LIST,
  BULLETIN_LIST: REVALIDATE_TIME.LIST,
  SCHEDULE: REVALIDATE_TIME.LIST,

  // 상세 페이지
  DETAIL: REVALIDATE_TIME.DETAIL,

  // 메인 노출 콘텐츠
  MAIN_CONTENT: REVALIDATE_TIME.SHORT,
  KV_SLIDER: REVALIDATE_TIME.SHORT,
} as const;
