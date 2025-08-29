import Link from 'next/link';
import Image from 'next/image';
import c from './CLog.module.scss';

interface CLogItemProps {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

export default function CLogItem({ id, title, category, date, imageUrl, imageAlt }: CLogItemProps) {
  return (
    <li className={c.list__item}>
      <Link href={`/c-log/${id}`} className={c.list__link}>
        <Image src={imageUrl} alt={imageAlt} width={400} height={300} className={c.list__image} />
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
