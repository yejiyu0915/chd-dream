'use client';

import Image from 'next/image';
import l from 'common/styles/mdx/MdxLayout.module.scss';

interface CLogDetailHeaderProps {
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  tags: string[]; // 태그 prop 추가
}

export default function CLogDetailHeader({
  title,
  category,
  date,
  imageUrl,
  tags,
}: CLogDetailHeaderProps) {
  return (
    <>
      <div className={l.header}>
        {imageUrl && imageUrl !== '/no-image.svg' && (
          <div className={l.image}>
            <Image src={imageUrl} alt={title} priority width={1440} height={400} />
          </div>
        )}
        <div className={`detail-inner ${l.content}`}>
          <p className={l.category}>{category}</p>
          <h1 className={l.title}>{title}</h1>
          <p className={l.date}>{date}</p>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className={`detail-inner ${l.tagContainer}`}>
          {' '}
          {/* 태그 컨테이너 추가 */}
          {tags.map((tag) => (
            <span key={tag} className={l.tagItem}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
