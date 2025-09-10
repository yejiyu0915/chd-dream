import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import q from '@/app/main/quick-link/QuickLink.module.scss';

export default function QuickLink() {
  return (
    <section className={q.quickLink}>
      <div className="inner">
        <h2 className="sr-only">Quick Link</h2>
        <div className={q.content}>
          <div className={q.list}>
            <div className={q.list__row}>
              <div className={`${q.list__item} ${q.list__itemLg}`}>
                <Link href="/">
                  <p className={q.list__title}>예배 안내</p>
                  <p className={q.list__desc}>
                    주일 예배, 학생부 예배, 평일 기도회 일정을 안내합니다.
                  </p>
                  <Icon name="arrow-up-right" className={q.list__icon} />
                </Link>
              </div>
              <div className={q.list__item}>
                <Link href="/">
                  <p className={q.list__title}>교회 영상</p>
                  <p className={q.list__desc}>교회 행사 영상을 확인할 수 있습니다.</p>
                  <Icon name="arrow-up-right" className={q.list__icon} />
                </Link>
              </div>
            </div>
            <div className={q.list__row}>
              <div className={q.list__item}>
                <Link href="/">
                  <p className={q.list__title}>교회 일정</p>
                  <p className={q.list__desc}>교회의 주요 일정을 확인할 수 있습니다.</p>
                  <Icon name="arrow-up-right" className={q.list__icon} />
                </Link>
              </div>
              <div className={`${q.list__item} ${q.list__itemLg}`}>
                <Link href="/">
                  <p className={q.list__title}>오시는 길</p>
                  <p className={q.list__desc}>
                    교회 주소 및 교회까지 오시는 대중교통 정보를 확인할 수 있습니다.
                  </p>
                  <Icon name="arrow-up-right" className={q.list__icon} />
                </Link>
              </div>
            </div>
          </div>
          <div className={q.pic}>
            <Image src="/main/quick-link.jpg" alt="순복음인천초대교회" width={500} height={500} />
          </div>
        </div>
      </div>
    </section>
  );
}
