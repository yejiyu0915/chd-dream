import { getNewsData, NewsItem } from '@/lib/notion';
import NewsListClient from '@/app/info/news/components/NewsListClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/news');

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function NewsListPage() {
  // 서버에서 News 데이터를 가져옴 (빠른 초기 로딩)
  let newsData: NewsItem[] = [];
  try {
    newsData = await getNewsData();
  } catch (error) {
    // 에러 발생 시 빈 배열로 초기화하여 페이지는 표시되도록 함
    console.error('뉴스 데이터를 가져오는 중 오류 발생:', error);
    newsData = [];
  }

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <NewsListClient initialNewsData={newsData} />;
}
