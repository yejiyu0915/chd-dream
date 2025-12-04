import { getNoticeData } from '@/lib/notion';
import NoticeListClient from '@/app/info/notice/components/NoticeListClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/notice');

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function NoticeListPage() {
  // 서버에서 Notice 데이터를 가져옴 (빠른 초기 로딩)
  const noticeData = await getNoticeData();

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <NoticeListClient initialNoticeData={noticeData} />;
}
