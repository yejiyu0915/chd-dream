import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import CLogItem from './CLogItem';
import c from './CLog.module.scss';

// 임시 목업 데이터
const mockCLogItems = [
  {
    id: '1',
    title: '주자랑 여름 수련회',
    category: '수련회',
    date: '2025.08.17',
    imageUrl:
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'C-log',
  },
  {
    id: '2',
    title: '청년부 성경 공부',
    category: '소그룹',
    date: '2025.08.10',
    imageUrl:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'C-log',
  },
  {
    id: '3',
    title: '찬양의 밤',
    category: '예배',
    date: '2025.07.28',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'C-log',
  },
  {
    id: '4',
    title: '새신자 환영회',
    category: '행사',
    date: '2025.07.20',
    imageUrl:
      'https://images.unsplash.com/photo-1543332164-6e82f355a222?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'C-log',
  },
];

export default function CLog() {
  const cLogItems = mockCLogItems;

  return (
    <section className={c.cLog}>
      <div className={`${c.inner} inner`}>
        <h2 className={c.title}>C-log</h2>
        <p className={c.desc}>교회의 다양한 이야기를 소개합니다.</p>
        <Link href="/c-log" className={c.link}>
          전체 글 보기 <Icon name="arrow-up-right" className={c.link__icon} />
        </Link>
        <div className={c.content}>
          <ul className={c.list}>
            {cLogItems.map((item) => (
              <CLogItem key={item.id} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
