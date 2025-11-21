// 교구 소개 페이지 데이터 관리

export interface GroupDataType {
  id: string;
  title: string;
  path: string; // 하위 페이지 경로
}

export const groupData: GroupDataType[] = [
  {
    id: 'all',
    title: '전체',
    path: '/about/group',
  },
  {
    id: 'men',
    title: '남선교',
    path: '/about/group/men',
  },
  {
    id: 'women',
    title: '여선교',
    path: '/about/group/women',
  },
  {
    id: 'youth',
    title: '청년부',
    path: '/about/group/youth',
  },
  {
    id: 'student',
    title: '학생부·예꿈부',
    path: '/about/group/student',
  },
  {
    id: 'new-family',
    title: '새가족부',
    path: '/about/group/newfamily',
  },
];
