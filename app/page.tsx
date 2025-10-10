import m from '@/app/main/main.module.scss';
import MainContentWrapper from '@/app/main/MainContentWrapper';
import { getBulletinData, getKVSliderData, KVSliderItem } from '@/lib/notion';

// 메인 페이지 캐싱 설정 - 5분마다 재검증
export const revalidate = 300;

export default async function Main() {
  const bulletinData = await getBulletinData();
  const kvSliderItems: KVSliderItem[] = await getKVSliderData();

  return (
    <main className={m.main}>
      <MainContentWrapper kvSliderItems={kvSliderItems} bulletinData={bulletinData} />
    </main>
  );
}
