// app/main/c-log/components/CLogSkeleton.tsx
import React from 'react';
import c from '../CLog.module.scss'; // CLog.module.scss에서 스타일 가져오기

export default function CLogSkeleton() {
  return (
    <li className={c.skeleton__item}>
      <div className={c.skeleton__link}>
        <div className={`${c.skeleton} ${c.skeleton__imagePlaceholder}`}></div>
        <div className={c.skeleton__content}>
          <div className={`${c.skeleton} ${c.skeleton__text}`} style={{ width: '80%' }}></div>
          <div className={`${c.skeleton__info}`}>
            <div className={`${c.skeleton} ${c.skeleton__text}`} style={{ width: '40%' }}></div>
            <div className={`${c.skeleton} ${c.skeleton__text}`} style={{ width: '30%' }}></div>
          </div>
          <div className={`${c.skeleton__tags}`}>
            <div className={`${c.skeleton} ${c.skeleton__tag}`} style={{ width: '25%' }}></div>
            <div className={`${c.skeleton} ${c.skeleton__tag}`} style={{ width: '35%' }}></div>
          </div>
        </div>
      </div>
    </li>
  );
}
