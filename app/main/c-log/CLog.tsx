'use client';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import c from '@/app/main/c-log/CLog.module.scss';
import { CLogItem } from '@/lib/notion';
import CLogSkeleton from '@/app/main/c-log/CLogSkeleton';
import CLogImageWithTheme from '@/app/info/c-log/components/CLogImageWithTheme';

interface CLogProps {
  initialCLogData: CLogItem[];
}

export default function CLog({ initialCLogData }: CLogProps) {
  'use memo'; // React 컴파일러 최적화 적용

  // 서버에서 받은 데이터를 직접 사용 (useQuery 제거)
  const cLogData = initialCLogData;
  const isLoading = false;
  const isError = false;
  const error = null;

  if (isLoading) {
    return (
      <section className={c.cLog}>
        <div className={`${c.inner} inner`}>
          <h2 className={c.title}>C-log</h2>
          <p className={c.desc}>교회의 다양한 이야기를 소개합니다.</p>
          <Link href="/info/c-log" className={c.link} scroll={false}>
            전체 글 보기 <Icon name="arrow-up-right" className={c.link__icon} />
          </Link>
          <div className={c.content}>
            <ul className={c.skeletonList}>
              {/* 메인 페이지는 6개만 표시하므로 6개 스켈레톤 렌더링 */}
              {Array.from({ length: 6 }).map((_, index) => (
                <CLogSkeleton key={index} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    let errorMessage = '데이터를 가져오는 데 실패했습니다.';
    if (error) {
      errorMessage = error.message;
    }
    return (
      <section className={c.cLog}>
        <div className={`${c.inner} inner`}>
          <p className={c.error}>에러: {errorMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={c.cLog}>
      <div className={`${c.inner} inner`}>
        <h2 className={c.title}>C-log</h2>
        <p className={c.desc}>교회의 다양한 이야기를 소개합니다.</p>
        <Link href="/info/c-log" className={c.link}>
          전체 글 보기 <Icon name="arrow-up-right" className={c.link__icon} />
        </Link>
        <div className={c.content}>
          {cLogData && cLogData.length > 0 ? (
            <ul className={c.list}>
              {cLogData.map((item: CLogItem) => {
                return (
                  <li key={item.id} className={c.list__item}>
                    <Link href={item.link} className={c.list__link}>
                      {' '}
                      {/* Link 컴포넌트 사용 및 href 설정 */}
                      <div className={c.list__imageContainer}>
                        <CLogImageWithTheme
                          src={item.imageUrl}
                          alt={item.imageAlt}
                          className={c.list__image}
                          width={400} // 이미지 너비 설정 (필요에 따라 조절)
                          height={300} // 이미지 높이 설정 (필요에 따라 조절)
                          priority
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
                    </Link>
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
