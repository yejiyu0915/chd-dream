'use client';

import React from 'react';
import c from '@/app/info/c-log/CLogList.module.scss'; // infoLayout.module.scss 사용

interface CLogTagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  tagCounts: Record<string, number>;
}

export default function CLogTagFilter({
  tags,
  selectedTag,
  onSelectTag,
  tagCounts,
}: CLogTagFilterProps) {
  return (
    <div className={`${c.tagFilter} detail-inner`}>
      <ul className={c.tagFilter__list}>
        <li className={c.tagFilter__item}>
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            className={`${c.tagFilter__button} ${!selectedTag ? c.active : ''}`}
          >
            ALL TAG <span className={c.tagFilter__count}>({tagCounts['전체보기'] || 0})</span>
          </button>
        </li>
        {tags.map((tag) => (
          <li key={tag} className={c.tagFilter__item}>
            <button
              type="button"
              onClick={() => onSelectTag(tag)}
              className={`${c.tagFilter__button} ${selectedTag === tag ? c.active : ''}`}
            >
              # {tag} <span className={c.tagFilter__count}>({tagCounts[tag] || 0})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
