import Link from 'next/link';
import Image from 'next/image';
import { CLogItem as CLogItemType } from '@/lib/notion';
import c from '@/app/main/c-log/CLog.module.scss';

export default function CLogItem({
  id,
  title,
  category,
  date,
  imageUrl,
  imageAlt,
  slug,
  link,
}: CLogItemType) {
  // link 속성이 있으면 사용하고, 없으면 slug로 경로 생성
  const href = link || (slug ? `/info/c-log/${slug}` : `/info/c-log/${id}`);

  return (
    <li className={c.list__item}>
      <Link href={href} className={c.list__link}>
        {imageUrl && (
          <Image src={imageUrl} alt={imageAlt} width={400} height={300} className={c.list__image} />
        )}
        <div className={c.list__content}>
          <p className={c.list__title}>{title}</p>
          <div className={c.list__info}>
            <p className={c.list__category}>{category}</p>
            <p className={c.list__date}>{date}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
