'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/main/bulletin/Bulletin.module.scss';
import { BulletinItem } from '@/lib/notion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BulletinSkeleton from '@/app/main/bulletin/BulletinSkeleton';
import { useRef } from 'react';

interface BulletinProps {
  initialBulletinData: BulletinItem | null;
}

export default function Bulletin({ initialBulletinData }: BulletinProps) {
  'use memo'; // React 컴파일러 최적화 적용

  const queryClient = useQueryClient();
  const lastModifiedHeaderValue = useRef<string | null>(null);

  const fetchBulletinData = async (): Promise<BulletinItem | null> => {
    const headers: HeadersInit = {};
    if (lastModifiedHeaderValue.current) {
      headers['If-Modified-Since'] = lastModifiedHeaderValue.current;
    }

    const response = await fetch('/api/bulletin-latest', { headers });

    if (response.status === 304) {
      return (queryClient.getQueryData(['bulletinData']) as BulletinItem) || null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newLastModified = response.headers.get('Last-Modified');
    if (newLastModified) {
      lastModifiedHeaderValue.current = newLastModified;
    }

    const data = await response.json();
    return data;
  };

  const {
    data: bulletinData,
    isLoading,
    isError,
    error,
  } = useQuery<BulletinItem | null, Error>({
    queryKey: ['bulletinData'],
    queryFn: fetchBulletinData,
    initialData: initialBulletinData, // 서버에서 받은 데이터를 초기값으로 사용 (즉시 렌더링)
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (재fetch 방지)
  });

  if (isLoading && !bulletinData) {
    return <BulletinSkeleton />;
  }

  if (isError) {
    let errorMessage = '주보 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <section className={s.bulletin}>
        <div className={s.inner}>
          <p className={s.error}>에러: {errorMessage}</p>
        </div>
      </section>
    );
  }

  if (!bulletinData) {
    return (
      <section className={s.bulletin}>
        <div className={s.inner}>
          <p className={s.emptyState}>이번 주 주보 데이터를 불러올 수 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={s.bulletin}>
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
