import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/main/sermon/Sermon.module.scss';

export default function Sermon() {
  return (
    <section className={s.sermon}>
      <div className={s.sermon__inner}>
        <div className={s.sermon__content}>
          <div className={s.sermon__text}>
            <h2 className={s.sermon__eyebrow}>
              <Icon.bookOpen className={s.sermon__eyebrowIcon} /> 이번 주 말씀 | 2025.08.26
            </h2>
            <p className={s.sermon__title}>주 안에서 서로 사랑하라</p>
            <p className={s.sermon__verse}>요 13:34</p>
            <p className={s.sermon__desc}>
              새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한것 같이 너희도 서로
              사랑하라.
            </p>
          </div>
          <div className={s.sermon__link}>
            <ul className={s.sermon__linkList}>
              <li className={s.sermon__linkItem}>
                <Link href="/" className={s.thisWeek}>
                  <span className={s.sermon__linkText}>
                    오늘의 말씀 보러가기
                    <Icon.externalLink className={s.sermon__linkIcon} />
                  </span>
                </Link>
              </li>
              <li className={s.sermon__linkItem}>
                <Link href="/">
                  <span className={s.sermon__linkText}>
                    지난 말씀 보러가기
                    <Icon.arrowUpRight className={s.sermon__linkIcon} />
                  </span>
                </Link>
              </li>
              <li className={s.sermon__linkItem}>
                <Link href="/">
                  <span className={s.sermon__linkText}>
                    네이버 밴드
                    <Icon.externalLink className={s.sermon__linkIcon} />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className={s.sermon__pastor}>
            <Image
              src="/main/pastor.jpg"
              alt="설교 목사"
              width={120}
              height={120}
              className={s.sermon__pastorImage}
            />
            <p className={s.sermon__pastorName}>
              <span className={s.sermon__pastorNameDesc}>담임 목사</span> 김영구
            </p>
          </div>
        </div>
        <p className={s.sermon__footnote}>
          <Icon.info className={s.sermon__footnoteIcon} /> 말씀 영상은 네이버 밴드 가입 승인 후
          확인하실 수 있습니다. (문의: 부속실)
        </p>
      </div>
    </section>
  );
}
