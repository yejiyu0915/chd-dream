import m from '@/app/main/main.module.scss';
import MainContentWrapper from '@/app/main/MainContentWrapper';
import { getSermonData, getKVSliderData, KVSliderItem } from '@/lib/notion';

export default async function Main() {
  const sermonData = await getSermonData();
  const kvSliderItems: KVSliderItem[] = await getKVSliderData();

  return (
    <main className={m.main}>
      <MainContentWrapper kvSliderItems={kvSliderItems} sermonData={sermonData} />
    </main>
  );
}
