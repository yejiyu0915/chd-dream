'use client';

import kv from '@/app/main/KV/KV.module.scss';
import { NewsItem } from '@/lib/notion';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // useQueryClient 임포트 추가
// import KVNewsSkeleton from '@/app/main/KV/KVNewsSkeleton'; // KVNewsSkeleton 임포트 제거
import { useRef } from 'react'; // useRef 임포트 추가

// export default async function NewsSection() {
//   const newsData: NewsItem[] = await getNewsData(); // 뉴스 데이터 가져오기

export default function NewsSection() {
  const queryClient = useQueryClient(); // QueryClient 인스턴스 가져오기
  const lastModifiedHeaderValue = useRef<string | null>(null); // Last-Modified 헤더 값을 저장할 ref

  const fetchNewsData = async (): Promise<NewsItem[]> => {
    const headers: HeadersInit = {};
    if (lastModifiedHeaderValue.current) {
      headers['If-Modified-Since'] = lastModifiedHeaderValue.current;
    }

    const response = await fetch('/api/news', { headers }); // API 라우트에서 데이터 가져오기

    if (response.status === 304) {
      // 304 Not Modified 응답이면 캐시된 데이터를 반환
      return (queryClient.getQueryData(['newsData']) as NewsItem[]) || [];
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Last-Modified 헤더 값 저장
    const newLastModified = response.headers.get('Last-Modified');
    if (newLastModified) {
      lastModifiedHeaderValue.current = newLastModified;
    }

    return response.json();
  };

  const {
    data: newsData,
    isLoading,
    isError,
    error,
  } = useQuery<NewsItem[], Error>({
    queryKey: ['newsData'],
    queryFn: fetchNewsData,
    // refetchInterval: 60 * 1000, // 1분(60초)마다 데이터를 자동으로 다시 가져옵니다. -> 새로고침 시에만 반영되도록 제거
  });

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
  if (!newsData || newsData.length === 0) {
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
      {/* isFetching 중일 때 작은 로딩 인디케이터를 추가할 수 있습니다. */}
      {/* {isFetching && <div className={kv.fetchingIndicator}>업데이트 중...</div>} */}
      <h2 className={kv.news__title}>NEWS</h2>
      <ul className={kv.news__list}>
        {newsData && newsData.length > 0 ? (
          newsData.map((newsItem) => (
            <li key={newsItem.id}>
              <a href={`/news/${newsItem.id}`} className={kv.news__link}>
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
