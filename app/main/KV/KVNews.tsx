'use client';

import kv from '@/app/main/KV/KV.module.scss';
import { NewsItem } from '@/lib/notion';

interface NewsSectionProps {
  initialNewsData: NewsItem[];
}

export default function NewsSection({ initialNewsData }: NewsSectionProps) {
  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const newsData = initialNewsData;
  const isLoading = false;
  const isError = false;
  const error = null;

  // 데이터가 아직 없으면서 로딩 중인 경우 (초기 로딩)
  if (isLoading && !newsData) {
    return <div className={kv.news}></div>;
  }

  // 에러 발생 시
  if (isError) {
    let errorMessage = '뉴스 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <div className={kv.news}>
        <h2 className={kv.news__title}>NEWS</h2>
        <ul className={kv.news__list}>
          <li>
            <p className={kv.emptyState}>에러: {errorMessage}</p>
          </li>
        </ul>
      </div>
    );
  }

  // 로딩이 완료되었지만 newsData가 비어있거나 없는 경우 (데이터 없음)
  if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
    return (
      <div className={kv.news}>
        <h2 className={kv.news__title}>NEWS</h2>
        <ul className={kv.news__list}>
          <li>
            <p className={kv.emptyState}>최신 뉴스를 불러올 수 없습니다.</p>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className={kv.news}>
      <h2 className={kv.news__title}>NEWS</h2>
      <ul className={kv.news__list}>
        {newsData && Array.isArray(newsData) && newsData.length > 0 ? (
          newsData.map((newsItem: NewsItem) => (
            <li key={newsItem.id}>
              <a href={`/info/news/${newsItem.slug}`} className={kv.news__link}>
                <h3 className={kv.news__listTitle}>{newsItem.title}</h3>
                <p className={kv.news__listDate}>{newsItem.date}</p>
              </a>
            </li>
          ))
        ) : (
          <li>
            <p className={kv.emptyState}>최신 뉴스를 불러올 수 없습니다.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
