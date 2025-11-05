import { getNewsData } from '@/lib/notion';
import NewsListClient from '@/app/info/news/components/NewsListClient';

// 서버 컴포넌트로 변경 - 데이터를 서버에서 미리 fetch
export default async function NewsListPage() {
  // 서버에서 News 데이터를 가져옴 (빠른 초기 로딩)
  const newsData = await getNewsData();

  // 클라이언트 컴포넌트에 서버 데이터를 전달하여 즉시 렌더링
  return <NewsListClient initialNewsData={newsData} />;
}
