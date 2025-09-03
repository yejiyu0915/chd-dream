import kv from '@/app/main/KV/KV.module.scss';
import KVNews from '@/app/main/KV/KVNews';
import KVSlider from '@/app/main/KV/KVSlider';

export default function KV() {
  return (
    <div className={kv.kv}>
      <KVSlider />
      <KVNews />
    </div>
  );
}
