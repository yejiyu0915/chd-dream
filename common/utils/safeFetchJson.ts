/**
 * JSON 응답 파싱 (빈 본문·비 JSON 시 에러).
 * 호출 전에 response.ok를 검사하지 않은 경우 fetchJson을 사용하세요.
 */
export async function parseJsonFromResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error('EMPTY_RESPONSE');
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('INVALID_JSON');
  }
}

/** fetch → ok 검사 → JSON 파싱. signal로 Abort 시 DOMException/AbortError. */
export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }
  return parseJsonFromResponse<T>(response);
}

/** 프리로드용: 실패 시 null, 예외 없음 */
export async function fetchJsonSilent<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(input, init);
    if (!response.ok) return null;
    const text = await response.text();
    if (!text.trim()) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
