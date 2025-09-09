import m from '@/app/main/main.module.scss';
import KV from '@/app/main/KV/KV';
import Intro from '@/app/main/intro/Intro';
import Sermon from '@/app/main/sermon/Sermon';
import CLog from '@/app/main/c-log/CLog';
import QuickLink from '@/app/main/quick-link/QuickLink';
import Instagram from '@/app/main/Instagram/Instagram';
import { getSermonData, getKVSliderData, KVSliderItem } from '@/lib/notion';

export default async function Main() {
  const sermonData = await getSermonData();
  const kvSliderItems: KVSliderItem[] = await getKVSliderData();

  return (
    <main className={m.main}>
      <KV kvSliderItems={kvSliderItems} />
      <div className={m.main__content}>
        <Sermon sermonData={sermonData} />
        <Intro />
        <CLog />
        <QuickLink />
        <Instagram />
      </div>
    </main>
  );
}
