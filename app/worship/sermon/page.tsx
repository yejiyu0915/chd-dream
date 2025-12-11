import SermonClient from '@/app/worship/sermon/components/SermonClient';

// 페이지를 동적 렌더링으로 강제 설정
export const dynamic = 'force-dynamic';

// 서버 컴포넌트 - searchParams를 props로 받아서 클라이언트 컴포넌트에 전달
export default async function SermonPage({
  searchParams,
}: {
  searchParams: Promise<{ content?: string }>;
}) {
  // searchParams를 await로 받기 (Next.js 16 권장 방식)
  const params = await searchParams;
  const contentParam = params.content || null;

  // useSearchParams 대신 서버에서 받은 searchParams를 props로 전달
  return <SermonClient contentParam={contentParam} />;
}
