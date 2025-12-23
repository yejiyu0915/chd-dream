import { getNoticeData, NoticeItem } from '@/lib/notion';
import NoticeListClient from '@/app/info/notice/components/NoticeListClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/notice');

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function NoticeListPage() {
  // 서버에서 Notice 데이터를 가져옴 (빠른 초기 로딩)
  let noticeData: NoticeItem[] = [];
  try {
    noticeData = await getNoticeData();
  } catch (error) {
    // 에러 발생 시 빈 배열로 초기화하여 페이지는 표시되도록 함
    console.error('공지사항 데이터를 가져오는 중 오류 발생:', error);
    noticeData = [];
  }

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <NoticeListClient initialNoticeData={noticeData} />;
}
