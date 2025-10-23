// sermon 페이지 데이터 관리
import Sermon1 from '@/app/worship/sermon/contents/Sermon1';
import Sermon2 from '@/app/worship/sermon/contents/Sermon2';
import Sermon3 from '@/app/worship/sermon/contents/Sermon3';

export interface SermonDataType {
  id: string;
  title: string;
  component: React.ComponentType; // 컴포넌트 타입
}

export const sermonData: SermonDataType[] = [
  {
    id: 'sermon1',
    title: '교회를 통한 축복',
    component: Sermon1,
  },
  {
    id: 'sermon2',
    title: '쓴물을 달게 하시는 하나님',
    component: Sermon2,
  },
  {
    id: 'sermon3',
    title: '설교 3',
    component: Sermon3,
  },
];
