'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/main/sermon/Sermon.module.scss';
import { SermonItem } from '@/lib/notion';

interface SermonProps {
  sermonData: SermonItem | null;
}

export default function Sermon({ sermonData }: SermonProps) {
  if (!sermonData) {
    return (
      <section className={s.sermon}>
        <div className={s.inner}>
          <p className={s.emptyState}>이번 주 설교 데이터를 불러올 수 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={s.sermon}>
      <div className={s.inner}>
        <div className={s.content}>
          <div className={s.text}>
            <h2 className={s.eyebrow}>
              <Icon name="book-open" className={s.eyebrow__icon} /> 이번 주
              말씀&nbsp;&nbsp;|&nbsp;&nbsp;
              {sermonData.date}
            </h2>
            <p className={s.title}>{sermonData.title}</p>
            <p className={s.verse}>{sermonData.summary}</p>
            <p className={s.desc}>{sermonData.verse}</p>
          </div>
          <div className={s.link}>
            <ul className={s.link__list}>
              <li className={s.link__item}>
                <Link href={sermonData.link} className={s.thisWeek} target="_blank">
                  {' '}
                  {/* 동적 링크 추가 */}
                  <span className={s.link__text}>
                    오늘의 말씀 보러가기
                    <Icon name="external-link" className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="/worship/sermon">
                  <span className={s.link__text}>
                    지난 말씀 보러가기
                    <Icon name="arrow-up-right" className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="https://band.us/band/5843149" target="_blank">
                  <span className={s.link__text}>
                    네이버 밴드
                    <Icon name="external-link" className={s.link__icon} />
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
              height={308}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <p className={s.pastor__name}>
              <span className={s.pastor__nameDesc}>담임 목사</span> 김영구
            </p>
          </div>
        </div>
        <p className={s.footnote}>
          <Icon name="info" className={s.footnote__icon} /> 말씀 영상은 네이버 밴드 가입 승인 후
          확인하실 수 있습니다. (문의: 부속실)
        </p>
      </div>
    </section>
  );
}
