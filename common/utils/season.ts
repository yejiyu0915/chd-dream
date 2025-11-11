/**
 * 계절 타입 정의
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * 개발/테스트용 계절 고정 (null이면 실제 날짜 기준으로 판단)
 * 테스트할 계절로 변경: 'spring' | 'summer' | 'autumn' | 'winter' | null
 */
const TEST_SEASON: Season | null = 'winter';

/**
 * 현재 날짜 기준으로 계절을 판단하는 함수
 * - 봄(spring): 3~5월
 * - 여름(summer): 6~8월
 * - 가을(autumn): 9~11월
 * - 겨울(winter): 12~2월
 *
 * TEST_SEASON이 설정되어 있으면 해당 계절을 반환 (개발/테스트용)
 */
export function getCurrentSeason(): Season {
  // 테스트용 계절이 설정되어 있으면 우선 반환
  if (TEST_SEASON !== null) {
    return TEST_SEASON;
  }

  // 실제 날짜 기준으로 계절 판단
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
