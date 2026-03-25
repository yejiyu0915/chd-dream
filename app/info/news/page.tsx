import { getNewsData, NewsItem } from '@/lib/notion';
import NewsListClient from '@/app/info/news/components/NewsListClient';
import { generatePageMetadata } from '@/common/data/metadata';

export const metadata = generatePageMetadata('/info/news');

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function NewsListPage() {
  let newsData: NewsItem[] = [];
  let dataFetchError: Error | null = null;

  try {
    newsData = await getNewsData();
  } catch (error) {
    dataFetchError = error instanceof Error ? error : new Error(String(error));
    console.error('뉴스 데이터를 가져오는 중 오류 발생:', error);
    newsData = [];
  }

  return <NewsListClient initialNewsData={newsData} error={dataFetchError} />;
}
