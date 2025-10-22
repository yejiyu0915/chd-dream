'use client';

import type { SermonDataType } from '../data/sermonData';
import s from '../Sermon.module.scss';

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
    </nav>
  );
}
