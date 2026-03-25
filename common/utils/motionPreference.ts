/**
 * 클라이언트에서 prefers-reduced-motion 여부 (createRoot·useEffect 등 비훅 맥락용)
 */
export function getClientPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
