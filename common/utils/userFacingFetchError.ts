/**
 * API·fetch에서 온 Error.message가 기술 코드(HTTP_500 등)일 때
 * 화면에는 고정 안내 문구만 보이도록 합니다.
 * 짧은 한국어 메시지(백엔드에서 내려준 경우)는 그대로 사용합니다.
 */
export const FETCH_ERROR_NOTICE =
  '지금은 공지 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';

export const FETCH_ERROR_NEWS =
  '지금은 교회 소식을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';

export const FETCH_ERROR_CLOG =
  '지금은 C-log 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';

export const FETCH_ERROR_SCHEDULE =
  '지금은 일정을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';

export const FETCH_ERROR_SCHEDULE_BANNER =
  '일정을 불러오지 못했습니다. 새로고침 후에도 같으면 잠시 뒤 다시 시도해 주세요.';

export const FETCH_ERROR_BULLETIN_PAGE =
  '지금은 주보를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';

export function userFacingFetchError(fallback: string, error?: Error | null): string {
  const msg = error?.message?.trim();
  if (!msg) return fallback;

  if (/^(HTTP_\d+|EMPTY_RESPONSE|INVALID_JSON)$/i.test(msg)) return fallback;
  if (/^Failed to fetch$/i.test(msg)) return fallback;
  if (/^NetworkError/i.test(msg)) return fallback;
  if (/^[A-Z][A-Z0-9_]{2,}$/.test(msg) && !/[가-힣]/.test(msg)) return fallback;

  if (/[가-힣]/.test(msg) && msg.length <= 200) return msg;

  return fallback;
}
