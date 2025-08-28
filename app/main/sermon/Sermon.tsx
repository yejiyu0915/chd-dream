import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/main/sermon/Sermon.module.scss';

export default function Sermon() {
  return (
    <section className={s.sermon}>
      <div className={s.inner}>
        <div className={s.content}>
          <div className={s.text}>
            <h2 className={s.eyebrow}>
              <Icon.bookOpen className={s.eyebrow__icon} /> 이번 주 말씀 | 2025.08.26
            </h2>
            <p className={s.title}>주 안에서 서로 사랑하라</p>
            <p className={s.verse}>요 13:34</p>
            <p className={s.desc}>
              새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한것 같이 너희도 서로
              사랑하라.
            </p>
          </div>
          <div className={s.link}>
            <ul className={s.link__list}>
              <li className={s.link__item}>
                <Link href="/" className={s.thisWeek}>
                  <span className={s.link__text}>
                    오늘의 말씀 보러가기
                    <Icon.externalLink className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="/">
                  <span className={s.link__text}>
                    지난 말씀 보러가기
                    <Icon.arrowUpRight className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="/">
                  <span className={s.link__text}>
                    네이버 밴드
                    <Icon.externalLink className={s.link__icon} />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className={s.pastor}>
            <Image
              src="/main/pastor.jpg"
              alt="설교 목사"
              className={s.pastor__image}
              width={240}
              height={240}
            />
            <p className={s.pastor__name}>
              <span className={s.pastor__nameDesc}>담임 목사</span> 김영구
            </p>
          </div>
        </div>
        <p className={s.footnote}>
          <Icon.info className={s.footnote__icon} /> 말씀 영상은 네이버 밴드 가입 승인 후 확인하실
          수 있습니다. (문의: 부속실)
        </p>
      </div>
    </section>
  );
}
