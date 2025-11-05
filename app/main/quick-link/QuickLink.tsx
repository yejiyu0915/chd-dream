import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import q from '@/app/main/quick-link/QuickLink.module.scss';

export default function QuickLink() {
  return (
    <section className={q.quickLink}>
      <div className="inner">
        <div className={q.title__wrap}>
          <h2 className="sr-only">Quick Link</h2>
          <p className={q.title}>
            행복으로가는교회에 <br className="only-mo" />
            오신 여러분을 <br />
            진심으로 환영합니다
          </p>
        </div>
        <div className={q.content}>
          <div className={q.list}>
            <div className={q.list__row}>
              <div className={`${q.list__item} ${q.list__itemLg}`}>
                <Link href="/worship/timetable">
                  <p className={q.list__title}>
                    <Icon name="book" /> 예배 안내
                  </p>
                  <p className={q.list__desc}>
                    주일 예배, 학생부 예배, 평일 기도회 일정을 안내합니다.
                  </p>
                  <div className={q.list__icon}>
                    <Icon name="arrow-up-right" />
                  </div>
                </Link>
              </div>
              <div className={q.list__item}>
                <Link href="">
                  <p className={q.list__title}>
                    <Icon name="users" /> 교구 소개
                  </p>
                  <p className={q.list__desc}>교구 소개와 교구 활동을 확인할 수 있습니다.</p>
                  <div className={q.list__icon}>
                    <Icon name="arrow-up-right" />
                  </div>
                </Link>
              </div>
            </div>
            <div className={q.list__row}>
              <div className={q.list__item}>
                <Link href="/info/schedule">
                  <p className={q.list__title}>
                    <Icon name="calendar" /> 교회 일정
                  </p>
                  <p className={q.list__desc}>교회의 주요 일정을 확인할 수 있습니다.</p>
                  <div className={q.list__icon}>
                    <Icon name="arrow-up-right" />
                  </div>
                </Link>
              </div>
              <div className={`${q.list__item} ${q.list__itemLg}`}>
                <Link href="/location">
                  <p className={q.list__title}>
                    <Icon name="map" /> 오시는 길
                  </p>
                  <p className={q.list__desc}>
                    교회 주소 및 교회까지 오시는 대중교통 정보를 확인할 수 있습니다.
                  </p>
                  <div className={q.list__icon}>
                    <Icon name="arrow-up-right" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className={q.pic}>
            <Image src="/main/quick-link.jpg" alt="행복으로가는교회" width={400} height={500} />
          </div>
        </div>
      </div>
    </section>
  );
}
