import { getNoticeData, NoticeItem } from '@/lib/notion';
import NoticeListClient from '@/app/info/notice/components/NoticeListClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/notice');

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function NoticeListPage() {
  let noticeData: NoticeItem[] = [];
  let dataFetchError: Error | null = null;

  try {
    noticeData = await getNoticeData();
  } catch (error) {
    dataFetchError = error instanceof Error ? error : new Error(String(error));
    console.error('공지사항 데이터를 가져오는 중 오류 발생:', error);
    noticeData = [];
  }

  return <NoticeListClient initialNoticeData={noticeData} error={dataFetchError} />;
}
