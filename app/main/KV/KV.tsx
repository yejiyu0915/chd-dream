import Image from 'next/image';
import kv from '@/app/main/KV/KV.module.scss';

export default function KV() {
  return (
    <div className={kv.kv}>
      <div className={kv.kv__inner}>
        <div className={kv.kv__background}>
          <Image src="/main/kv.jpg" alt="순복음인천초대교회" fill style={{ objectFit: 'cover' }} />
          <div className={kv.kv__overlay}></div>
        </div>
        <div className={kv.kv__content}>
          <div className={kv.kv__text}>
            <h1 className={kv.kv__title}>꿈이 이루어지는 행복한 교회</h1>
            <p className={kv.kv__desc}>순복음인천초대교회에 오신 여러분을 축복하고 환영합니다</p>
          </div>
          <div className={kv.kv__news}>
            <h2 className={kv.kv__newsTitle}>NEWS</h2>
            <ul className={kv.kv__newsList}>
              <li className={kv.kv__newsItem}>
                <a href="#" className={kv.kv__newsLink}>
                  <h3 className={kv.kv__newsText}>추수 감사절 행사 안내</h3>
                  <p className={kv.kv__newsDate}>2025.08.26</p>
                </a>
              </li>
              <li className={kv.kv__newsItem}>
                <a href="#" className={kv.kv__newsLink}>
                  <h3 className={kv.kv__newsText}>
                    주자랑 수련회가 은혜로 잘 마무리되었습니다. 도움을 주신 모든 분들께 감사의
                    말씀을 전합니다
                  </h3>
                  <p className={kv.kv__newsDate}>2025.08.17</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
