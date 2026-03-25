/** 개발 환경에서만 stdout 로그 (프로덕션 노이즈·비용 방지) */
export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.log(...args);
}
