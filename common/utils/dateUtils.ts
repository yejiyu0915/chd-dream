/**
 * 날짜 관련 유틸리티 함수
 */

// NEW 배지 표시 기준 (일 단위)
const NEW_BADGE_DAYS = 30;

/**
 * 주어진 날짜가 NEW 배지를 표시할 기준(30일) 이내인지 확인
 * @param rawDate - ISO 형식 날짜 문자열 (예: "2024-12-15" 또는 "2024-12-15T10:00:00.000+09:00")
 * @returns 30일 이내면 true, 아니면 false
 */
export function isNewPost(rawDate: string): boolean {
  if (!rawDate) return false;

  try {
    const postDate = new Date(rawDate);
    const today = new Date();

    // 시간 부분을 제거하고 날짜만 비교
    postDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // 밀리초 차이를 일 단위로 변환
    const diffTime = today.getTime() - postDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= NEW_BADGE_DAYS;
  } catch {
    return false;
  }
}

