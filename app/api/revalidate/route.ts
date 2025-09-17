import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path'); // 예: /info/c-log/[slug]
  const tag = request.nextUrl.searchParams.get('tag'); // 예: clog-posts

  // eslint-disable-next-line no-console
  console.log('Revalidate API called.');
  // eslint-disable-next-line no-console
  console.log('Received secret:', secret);
  // eslint-disable-next-line no-console
  console.log('Expected secret:', process.env.NEXT_REVALIDATE_SECRET);
  // eslint-disable-next-line no-console
  console.log('Received path:', path);
  // eslint-disable-next-line no-console
  console.log('Received tag:', tag);

  // 보안 토큰 확인
  if (secret !== process.env.NEXT_REVALIDATE_SECRET) {
    // eslint-disable-next-line no-console
    console.log('Invalid secret provided.');
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 경로 기반 재검증
  if (path) {
    revalidatePath(path);
    // eslint-disable-next-line no-console
    console.log(`Revalidated path: ${path}`);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  }

  // 태그 기반 재검증 (선택 사항: fetch 요청에 태그를 지정했을 경우)
  if (tag) {
    revalidateTag(tag);
    // eslint-disable-next-line no-console
    console.log(`Revalidated tag: ${tag}`);
    return NextResponse.json({ revalidated: true, now: Date.now(), tag });
  }

  // eslint-disable-next-line no-console
  console.log('Missing path or tag to revalidate.');
  return NextResponse.json({ revalidated: false, message: 'Missing path or tag to revalidate' });
}
