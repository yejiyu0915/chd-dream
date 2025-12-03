import PastorContent from './components/PastorContent';
import { pastorNewsData } from './data/pastorNewsData';

export default function PastorPage() {
  // 외부 뉴스 링크 데이터
  const externalNews = pastorNewsData;

  return <PastorContent externalNews={externalNews} />;
}
