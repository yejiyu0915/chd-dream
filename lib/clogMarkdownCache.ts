/**
 * C-log Markdown 변환 결과 캐시
 * 내용이 많은 페이지의 성능 최적화를 위한 인메모리 캐시
 */

// Markdown 변환 결과 캐시
const clogMarkdownCache = new Map<string, { markdown: string; timestamp: number }>();
const CLOG_MARKDOWN_CACHE_TTL = 60 * 60 * 1000; // 1시간으로 증가 (더 긴 캐시)
const clogMarkdownFetchingRef = new Map<string, Promise<string>>();

/**
 * C-log Markdown 변환 결과를 캐시에서 가져오거나 변환 함수 실행
 */
export async function getCachedMarkdown(
  slug: string,
  convertFn: () => Promise<string>
): Promise<string> {
  const cacheKey = `clog-markdown-${slug}`;
  const now = Date.now();

  // 캐시 확인
  const cached = clogMarkdownCache.get(cacheKey);
  if (cached && now - cached.timestamp < CLOG_MARKDOWN_CACHE_TTL) {
    return cached.markdown;
  }

  // 이미 요청 중인 경우 기존 Promise 반환 (중복 요청 방지)
  const existingFetch = clogMarkdownFetchingRef.get(cacheKey);
  if (existingFetch) {
    return existingFetch;
  }

  // 새로운 변환 시작
  const fetchPromise = (async () => {
    try {
      const markdown = await convertFn();

      // 인메모리 캐시에 저장
      clogMarkdownCache.set(cacheKey, {
        markdown,
        timestamp: now,
      });

      return markdown;
    } finally {
      // 요청 완료 후 fetching ref에서 제거
      clogMarkdownFetchingRef.delete(cacheKey);
    }
  })();

  clogMarkdownFetchingRef.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * 특정 slug의 캐시를 무효화
 */
export function invalidateClogMarkdownCache(slug: string): void {
  const cacheKey = `clog-markdown-${slug}`;
  clogMarkdownCache.delete(cacheKey);
}

/**
 * 모든 C-log Markdown 캐시를 무효화
 */
export function clearClogMarkdownCache(): void {
  clogMarkdownCache.clear();
  clogMarkdownFetchingRef.clear();
}
