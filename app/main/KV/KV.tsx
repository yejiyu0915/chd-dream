import kv from '@/app/main/KV/KV.module.scss';
import KVNews from '@/app/main/KV/KVNews';
import KVSlider from '@/app/main/KV/KVSlider';
import { KVSliderItem } from '@/lib/notion'; // KVSliderItem 임포트

interface KVProps {
  kvSliderItems: KVSliderItem[];
}

export default function KV({ kvSliderItems }: KVProps) {
  return (
    <div className={kv.kv}>
      <KVSlider kvSliderItems={kvSliderItems} /> {/* kvSliderItems prop으로 전달 */}
      <KVNews />
    </div>
  );
}
