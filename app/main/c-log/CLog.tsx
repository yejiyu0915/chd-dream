'use client';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import c from './CLog.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Next.js Image 컴포넌트 import
import { CLogItem } from '@/lib/notion'; // CLogItem 인터페이스 import

export default function CLog() {
  const [cLogData, setCLogData] = useState<CLogItem[]>([]); // Notion 데이터를 저장할 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchCLogData = async () => {
      try {
        const response = await fetch('/api/c-log'); // API 엔드포인트 호출
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCLogData(data); // 데이터 상태 업데이트
      } catch (err: unknown) {
        // any 타입을 unknown으로 변경
        // console.error('데이터 가져오기 실패:', err); // 콘솔에 에러 로그 출력 (주석 처리)
        let errorMessage = '데이터를 가져오는 데 실패했습니다.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage); // 에러 상태 업데이트
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchCLogData(); // 데이터 가져오는 함수 호출
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  if (isLoading) {
    return (
      <section className={c.cLog}>
        <div className={`${c.inner} inner`}>
          <p className={c.loading}>데이터 로딩 중...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={c.cLog}>
        <div className={`${c.inner} inner`}>
          <p className={c.error}>에러: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={c.cLog}>
      <div className={`${c.inner} inner`}>
        <h2 className={c.title}>C-log</h2>
        <p className={c.desc}>교회의 다양한 이야기를 소개합니다.</p>
        <Link href="/c-log" className={c.link}>
          전체 글 보기 <Icon name="arrow-up-right" className={c.link__icon} />
        </Link>
        <div className={c.content}>
          {cLogData.length > 0 ? (
            <ul className={c.list}>
              {cLogData.map((item: CLogItem) => {
                return (
                  <li key={item.id} className={c.list__item}>
                    <a href="#" className={c.list__link}>
                      <div className={c.list__imageContainer}>
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt}
                          className={c.list__image}
                          width={400} // 이미지 너비 설정 (필요에 따라 조절)
                          height={300} // 이미지 높이 설정 (필요에 따라 조절)
                          priority // 초기 로딩 시 중요한 이미지에 대해 우선 로딩
                        />
                      </div>
                      <div className={c.list__content}>
                        <h3 className={c.list__title}>{item.title}</h3>
                        <div className={c.list__info}>
                          <span className={c.list__category}>{item.category}</span>
                          <span className={c.list__date}>{item.date}</span>
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className={c.list__tag}>
                            {item.tags.map((tag) => (
                              <span key={tag} className={c.list__tagItem}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={c.desc}>표시할 Notion 데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
