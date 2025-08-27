import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import c from '@/app/main/c-log/CLog.module.scss';

export default function CLog() {
  return (
    <section className={c.cLog}>
      <div className={`${c.cLog__inner} inner`}>
        <h2 className={c.cLog__title}>C-log</h2>
        <p className={c.cLog__desc}>교회의 다양한 이야기를 소개합니다.</p>
        <Link href="/c-log" className={c.cLog__link}>
          전체 글 보기 <Icon.arrowUpRight className={c.cLog__linkIcon} />
        </Link>
        <div className={c.cLog__content}>
          <ul className={c.cLog__list}>
            <li className={c.cLog__listItem}>
              <Link href="/c-log/1" className={c.cLog__listLink}>
                <Image
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="C-log"
                  width={400}
                  height={300}
                  className={c.cLog__listImage}
                />
                <div className={c.cLog__listContent}>
                  <p className={c.cLog__listTitle}>
                    주자랑 여름 수련회 주자랑 여름 수련회 주자랑 여름 수련회 주자랑 여름 수련회
                  </p>
                  <div className={c.cLog__listInfo}>
                    <p className={c.cLog__listCategory}>수련회</p>
                    <p className={c.cLog__listDate}>2025.08.17</p>
                  </div>
                </div>
              </Link>
            </li>
            <li className={c.cLog__listItem}>
              <Link href="/c-log/1" className={c.cLog__listLink}>
                <Image
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="C-log"
                  width={400}
                  height={300}
                  className={c.cLog__listImage}
                />
                <div className={c.cLog__listContent}>
                  <p className={c.cLog__listTitle}>주자랑 여름 수련회</p>
                  <div className={c.cLog__listInfo}>
                    <p className={c.cLog__listCategory}>수련회</p>
                    <p className={c.cLog__listDate}>2025.08.17</p>
                  </div>
                </div>
              </Link>
            </li>
            <li className={c.cLog__listItem}>
              <Link href="/c-log/1" className={c.cLog__listLink}>
                <Image
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="C-log"
                  width={400}
                  height={300}
                  className={c.cLog__listImage}
                />
                <div className={c.cLog__listContent}>
                  <p className={c.cLog__listTitle}>주자랑 여름 수련회</p>
                  <div className={c.cLog__listInfo}>
                    <p className={c.cLog__listCategory}>수련회</p>
                    <p className={c.cLog__listDate}>2025.08.17</p>
                  </div>
                </div>
              </Link>
            </li>
            <li className={c.cLog__listItem}>
              <Link href="/c-log/1" className={c.cLog__listLink}>
                <Image
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="C-log"
                  width={400}
                  height={300}
                  className={c.cLog__listImage}
                />
                <div className={c.cLog__listContent}>
                  <p className={c.cLog__listTitle}>주자랑 여름 수련회</p>
                  <div className={c.cLog__listInfo}>
                    <p className={c.cLog__listCategory}>수련회</p>
                    <p className={c.cLog__listDate}>2025.08.17</p>
                  </div>
                </div>
              </Link>
            </li>
            <li className={c.cLog__listItem}>
              <Link href="/c-log/1" className={c.cLog__listLink}>
                <Image
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="C-log"
                  width={400}
                  height={300}
                  className={c.cLog__listImage}
                />
                <div className={c.cLog__listContent}>
                  <p className={c.cLog__listTitle}>주자랑 여름 수련회</p>
                  <div className={c.cLog__listInfo}>
                    <p className={c.cLog__listCategory}>수련회</p>
                    <p className={c.cLog__listDate}>2025.08.17</p>
                  </div>
                </div>
              </Link>
            </li>
            <li className={c.cLog__listItem}>
              <Link href="/c-log/1" className={c.cLog__listLink}>
                <Image
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="C-log"
                  width={400}
                  height={300}
                  className={c.cLog__listImage}
                />
                <div className={c.cLog__listContent}>
                  <p className={c.cLog__listTitle}>주자랑 여름 수련회</p>
                  <div className={c.cLog__listInfo}>
                    <p className={c.cLog__listCategory}>수련회</p>
                    <p className={c.cLog__listDate}>2025.08.17</p>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
