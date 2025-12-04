import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path'); // 예: /info/c-log/[slug]
  const tag = request.nextUrl.searchParams.get('tag'); // 예: clog-posts

  // 보안 토큰 확인
  if (secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 경로 기반 재검증
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  }

  // 태그 기반 재검증 (선택 사항: fetch 요청에 태그를 지정했을 경우)
  if (tag) {
    // Next.js 16: revalidateTag는 이제 두 번째 인자로 옵션을 받습니다
    revalidateTag(tag, {});
    return NextResponse.json({ revalidated: true, now: Date.now(), tag });
  }

  return NextResponse.json({ revalidated: false, message: 'Missing path or tag to revalidate' });
}
