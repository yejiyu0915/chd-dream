'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/common/components/utils/Icons';
import { getClientSeason } from '@/common/utils/season';
import { quickLinkData } from '@/common/data/info';
import { useState, useEffect } from 'react';
import q from '@/app/main/quick-link/QuickLink.module.scss';

export default function QuickLink() {
  // 계절별 배경 이미지 자동 설정 (개발자 도구에서 data-season 변경 시 반응)
  const [backgroundImage, setBackgroundImage] = useState(`/images/title/winter/info.jpg`);

  useEffect(() => {
    const season = getClientSeason();
    setBackgroundImage(`/images/title/${season}/info.jpg`);

    // data-season 속성 변경 감지 (개발자 도구에서 테스트용)
    const observer = new MutationObserver(() => {
      const newSeason = getClientSeason();
      setBackgroundImage(`/images/title/${newSeason}/info.jpg`);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-season'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={q.quickLink} style={{ backgroundImage: `url(${backgroundImage})` }}>
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
            {quickLinkData.map((row, rowIndex) => (
              <div key={rowIndex} className={q.list__row}>
                {row.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`${q.list__item} ${item.size === 'lg' ? q.list__itemLg : ''}`}
                  >
                    <Link href={item.href}>
                      <p className={q.list__title}>
                        <Icon name={item.icon} /> {item.title}
                      </p>
                      <p className={q.list__desc}>{item.description}</p>
                      <div className={q.list__icon}>
                        <Icon name="arrow-up-right" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={q.pic}>
            <Image
              src="/images/common/quick-link.jpg"
              alt="행복으로가는교회"
              width={400}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
