/**
 * 계절 타입 정의
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * 개발/테스트용 계절 고정 (null이면 실제 날짜 기준으로 판단)
 * 테스트할 계절로 변경: 'spring' | 'summer' | 'autumn' | 'winter' | null
 */
const TEST_SEASON: Season | null = null;

/**
 * 실제 날짜 기준으로 계절을 판단하는 헬퍼 함수
 * - 봄(spring): 3~5월
 * - 여름(summer): 6~8월
 * - 가을(autumn): 9~11월
 * - 겨울(winter): 12~2월
 */
function getSeasonByDate(): Season {
  const currentMonth = new Date().getMonth() + 1; // 0-based이므로 +1

  if (currentMonth >= 3 && currentMonth <= 5) {
    return 'spring';
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    return 'summer';
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    return 'autumn';
  } else {
    return 'winter'; // 12, 1, 2월
  }
}

/**
 * 현재 적용할 계절을 판단하는 함수 (서버/클라이언트 공통)
 * 우선순위:
 * 1. TEST_SEASON (개발/테스트용)
 * 2. 실제 날짜 기준
 *
 * 주의: localStorage는 클라이언트에서만 확인 가능하므로
 * ThemeManager 컴포넌트에서 별도로 처리됩니다.
 */
export function getCurrentSeason(): Season {
  // 1. 테스트용 계절이 설정되어 있으면 반환
  if (TEST_SEASON !== null) {
    return TEST_SEASON;
  }

  // 2. 실제 날짜 기준으로 계절 판단
  return getSeasonByDate();
}

/**
 * 계절에 맞는 이미지 폴더명 또는 파일명을 반환하는 함수
 * @param season - 계절 ('spring' | 'summer' | 'autumn' | 'winter')
 * @returns 계절 문자열
 */
export function getSeasonPath(season: Season): string {
  return season;
}

/**
 * 클라이언트에서 HTML의 data-season 속성을 읽어오는 함수
 * 개발자 도구에서 임의로 변경한 값도 감지 가능
 */
export function getClientSeason(): Season {
  if (typeof window === 'undefined') {
    return 'winter'; // 서버에서는 기본값
  }

  const season = document.documentElement.getAttribute('data-season') as Season;
  return season || 'winter';
}
