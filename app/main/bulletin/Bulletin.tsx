'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/main/bulletin/Bulletin.module.scss';
import { BulletinItem } from '@/lib/notion';
import BulletinSkeleton from '@/app/main/bulletin/BulletinSkeleton';
import { getClientSeason } from '@/common/utils/season';
import { useState, useEffect } from 'react';

interface BulletinProps {
  initialBulletinData: BulletinItem | null;
}

export default function Bulletin({ initialBulletinData }: BulletinProps) {
  'use memo'; // React 컴파일러 최적화 적용

  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const bulletinData = initialBulletinData;
  const isLoading = false;
  const isError = false;
  const error = null;
  
  // 계절별 배경 이미지 자동 설정 (개발자 도구에서 data-season 변경 시 반응)
  const [backgroundImage, setBackgroundImage] = useState(`/images/bulletin/winter.jpg`);

  useEffect(() => {
    const season = getClientSeason();
    setBackgroundImage(`/images/bulletin/${season}.jpg`);
    
    // data-season 속성 변경 감지 (개발자 도구에서 테스트용)
    const observer = new MutationObserver(() => {
      const newSeason = getClientSeason();
      setBackgroundImage(`/images/bulletin/${newSeason}.jpg`);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-season'],
    });
    
    return () => observer.disconnect();
  }, []);

  if (isLoading && !bulletinData) {
    return <BulletinSkeleton />;
  }

  if (isError) {
    let errorMessage = '주보 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <section className={s.bulletin} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={s.inner}>
          <p className={s.error}>에러: {errorMessage}</p>
        </div>
      </section>
    );
  }

  if (!bulletinData) {
    return (
      <section className={s.bulletin} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={s.inner}>
          <p className={s.emptyState}>이번 주 주보 데이터를 불러올 수 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={s.bulletin} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={s.inner}>
        <div className={s.content}>
          <div className={s.text}>
            <h2 className={s.eyebrow}>
              <Icon name="book-open" className={s.eyebrow__icon} /> 주일 오전 예배
              <br />
              {bulletinData.date}
            </h2>
            <p className={s.title}>{bulletinData.title}</p>
            <p className={s.verse}>{bulletinData.summary}</p>
            <p className={s.desc}>
              해피니스 찬양대&nbsp;&nbsp;:&nbsp;&nbsp;
              <span className={s.praise}>{bulletinData.praise || '찬양 정보 없음'}</span>
            </p>
          </div>
          <div className={s.link}>
            <ul className={s.link__list}>
              <li className={s.link__item}>
                <Link href={`/worship/bulletin`} className={s.thisWeek}>
                  {' '}
                  <span className={s.link__text}>
                    온라인 주보
                    <Icon name="arrow-up-right" className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="#" target="_blank">
                  <span className={s.link__text}>
                    네이버 밴드
                    <Icon name="external-link" className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="/worship/sermon">
                  <span className={s.link__text}>
                    생명의 말씀
                    <Icon name="arrow-up-right" className={s.link__icon} />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {/* <div className={s.pastor}>
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
          </div> */}
        </div>
        <p className={s.footnote}>
          <Icon name="info" className={s.footnote__icon} /> 말씀 영상은 네이버 밴드 가입 승인 후
          확인하실 수 있습니다. (문의: 부속실)
        </p>
      </div>
    </section>
  );
}
