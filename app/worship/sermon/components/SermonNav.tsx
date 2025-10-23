'use client';

import Icon from '@/common/components/utils/Icons';
import type { SermonDataType } from '@/app/worship/sermon/data/sermonData';
import s from '@/app/worship/sermon/Sermon.module.scss';

interface SermonNavProps {
  data: SermonDataType[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function SermonNav({ data, activeId, onSelect }: SermonNavProps) {
  return (
    <nav className={s.nav}>
      <ul className={s.nav__list}>
        {data.map((item) => (
          <li key={item.id} className={s.nav__item}>
            <button
              type="button"
              className={`${s.nav__button} ${activeId === item.id ? s.active : ''}`}
              onClick={() => onSelect(item.id)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
      <p className={s.nav__desc}>
        <Icon name="info" className={s.nav__icon} /> 더 많은 말씀 영상은 네이버 밴드 가입 승인 후
        확인하실 수 있습니다. (문의: 부속실)
      </p>
    </nav>
  );
}
