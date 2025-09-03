import Link from 'next/link';
import kv from '@/app/main/KV/KV.module.scss';
import { getNewsData, NewsItem } from '@/lib/notion'; // getNewsData 및 NewsItem 임포트

export default async function NewsSection() {
  const newsData: NewsItem[] = await getNewsData(); // 뉴스 데이터 가져오기

  return (
    <div className={kv.news}>
      <h2 className={kv.news__title}>NEWS</h2>
      <ul className={kv.news__list}>
        {newsData.length > 0 ? (
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
