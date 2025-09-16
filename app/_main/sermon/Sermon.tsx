'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import s from '@/app/main/sermon/Sermon.module.scss';
import { SermonItem } from '@/lib/notion';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // useQueryClient 임포트 추가
import SermonSkeleton from '@/app/_main/sermon/SermonSkeleton'; // SermonSkeleton 임포트
import { useRef } from 'react'; // useRef 임포트 추가

// sermonData prop 제거
// interface SermonProps {
//   sermonData: SermonItem | null;
// }

// export default function Sermon({ sermonData }: SermonProps) {
export default function Sermon() {
  const queryClient = useQueryClient(); // QueryClient 인스턴스 가져오기
  const lastModifiedHeaderValue = useRef<string | null>(null); // Last-Modified 헤더 값을 저장할 ref

  // prop 제거
  const fetchSermonData = async (): Promise<SermonItem | null> => {
    const headers: HeadersInit = {};
    if (lastModifiedHeaderValue.current) {
      headers['If-Modified-Since'] = lastModifiedHeaderValue.current;
    }

    const response = await fetch('/api/sermon', { headers }); // API 라우트에서 데이터 가져오기

    if (response.status === 304) {
      // 304 Not Modified 응답이면 캐시된 데이터를 반환
      return (queryClient.getQueryData(['sermonData']) as SermonItem) || null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Last-Modified 헤더 값 저장
    const newLastModified = response.headers.get('Last-Modified');
    if (newLastModified) {
      lastModifiedHeaderValue.current = newLastModified;
    }

    const data = await response.json();
    return data; // API가 단일 SermonItem 또는 null을 반환하므로 그대로 반환
  };

  const {
    data: sermonData,
    isLoading,
    isError,
    error,
  } = useQuery<SermonItem | null, Error>({
    queryKey: ['sermonData'],
    queryFn: fetchSermonData,
    // refetchInterval: 60 * 1000, // 1분(60초)마다 데이터를 자동으로 다시 가져옵니다. -> 새로고침 시에만 반영되도록 제거
  });

  // 데이터가 아직 없으면서 로딩 중인 경우 (초기 로딩)
  if (isLoading && !sermonData) {
    return <SermonSkeleton />; // 스켈레톤 컴포넌트로 대체
  }

  // 에러 발생 시 (데이터가 이미 있다면 기존 데이터를 보여주고 에러 메시지 추가 가능)
  if (isError) {
    let errorMessage = '설교 데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <section className={s.sermon}>
        <div className={s.inner}>
          <p className={s.error}>에러: {errorMessage}</p>
        </div>
      </section>
    );
  }

  // 로딩이 완료되었지만 sermonData가 null인 경우 (데이터 없음)
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
        {/* isFetching 중일 때 작은 로딩 인디케이터를 추가할 수 있습니다. */}
        {/* {isFetching && <div className={s.fetchingIndicator}>업데이트 중...</div>} */}
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
                  <span className={s.link__text}>
                    오늘의 말씀 <span className="only-pc">보러가기</span>
                    <Icon name="external-link" className={s.link__icon} />
                  </span>
                </Link>
              </li>
              <li className={s.link__item}>
                <Link href="/worship/sermon">
                  <span className={s.link__text}>
                    지난 말씀 <span className="only-pc">보러가기</span>
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
