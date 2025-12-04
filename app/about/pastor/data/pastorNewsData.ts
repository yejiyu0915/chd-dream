// 담임목사 관련 외부 뉴스 링크 데이터

export interface ExternalNewsItem {
  id: string; // 고유 ID
  title: string; // 뉴스 제목
  date: string; // 날짜 (예: "2024.01.15")
  url: string; // 외부 링크 URL
  source?: string; // 출처 (예: "기독일보", "크리스천투데이" 등)
}

// 담임목사 관련 외부 뉴스 데이터
export const pastorNewsData: ExternalNewsItem[] = [
  // 예시 데이터 - 실제 데이터로 교체 필요
  // {
  //   id: 'news-1',
  //   title: '담임목사 관련 뉴스 제목 1',
  //   date: '2024.01.15',
  //   url: 'https://example.com/news/1',
  //   source: '기독일보',
  // },
  // {
  //   id: 'news-2',
  //   title: '담임목사 관련 뉴스 제목 2',
  //   date: '2024.01.10',
  //   url: 'https://example.com/news/2',
  //   source: '크리스천투데이',
  // },
];


