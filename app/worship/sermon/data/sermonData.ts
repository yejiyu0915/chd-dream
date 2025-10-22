// sermon 페이지 데이터 관리
import Sermon1 from '../contents/Sermon1';
import Sermon2 from '../contents/Sermon2';
import Sermon3 from '../contents/Sermon3';

export interface SermonDataType {
  id: string;
  title: string;
  component: React.ComponentType; // 컴포넌트 타입
}

export const sermonData: SermonDataType[] = [
  {
    id: 'sermon1',
    title: '설교 1',
    component: Sermon1,
  },
  {
    id: 'sermon2',
    title: '설교 2',
    component: Sermon2,
  },
  {
    id: 'sermon3',
    title: '설교 3',
    component: Sermon3,
  },
];
