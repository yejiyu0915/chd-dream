import m from '@/app/main/main.module.scss';
import MainContentWrapper from '@/app/main/MainContentWrapper';
import {
  getBulletinData,
  getKVSliderData,
  getCLogMainData,
  getMainNewsData,
} from '@/lib/notion';

// 메인 페이지 캐싱 설정 - 5분마다 재검증
export const revalidate = 300;

export default async function Main() {
  // 모든 API 호출을 병렬로 처리하여 로딩 시간 단축
  const [bulletinData, kvSliderItems, cLogData, newsData] = await Promise.all([
    getBulletinData(),
    getKVSliderData(),
    getCLogMainData(),
    getMainNewsData(),
  ]);

  return (
    <main className={m.main}>
      <MainContentWrapper
        kvSliderItems={kvSliderItems}
        bulletinData={bulletinData}
        cLogData={cLogData}
        newsData={newsData}
      />
    </main>
  );
}
