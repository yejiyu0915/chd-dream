import { getPopupWithContent } from '@/lib/notion';
import { NextResponse } from 'next/server';

/**
 * 레이아웃 TTFB 완화: 클라이언트에서 지연 로드용.
 * getPopupWithContent와 동일 데이터(unstable_cache 5분).
 */
export async function GET() {
  try {
    const data = await getPopupWithContent();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}
