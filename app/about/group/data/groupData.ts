// 교구 소개 페이지 데이터 관리

// 회장단 정보 타입
export interface LeaderType {
  role: string; // 역할 (회장, 부회장 등)
  name: string; // 이름
}

// 하위 교구 정보 타입 (여선교 1,2,3,4 / 예꿈 학생부/예꿈부 등)
export interface SubGroupType {
  id: string; // 하위 교구 ID
  title: string; // 하위 교구명
  description?: string; // 교구소개 (1~2줄)
  pastor: string; // 담당 교역자
  leaders?: LeaderType[]; // 회장단
  meetingPlace?: string; // 모임 장소
  meetingTime?: string; // 모임 시간
  activities?: string[]; // 교구활동안내 (여러 개 가능)
}

export interface GroupDataType {
  id: string;
  title: string;
  path: string; // 하위 페이지 경로
  image?: string; // 대표사진 경로 (예: '/images/group/men.jpg')
  description?: string; // 교구소개 (1~2줄)
  pastor?: string; // 담당 교역자
  leaders?: LeaderType[]; // 회장단
  meetingPlace?: string; // 모임 장소
  meetingTime?: string; // 모임 시간
  activities?: string[]; // 교구활동안내 (여러 개 가능)
  subGroups?: SubGroupType[]; // 하위 교구들 (여선교, 예꿈 등)
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
    image: '/images/group/men.jpg',
    description:
      '남선교는 하나님의 사랑을 나누며 함께 성장하는 공동체입니다. 서로를 품고 섬기며 신앙의 기쁨을 누립니다.',
    pastor: '송순옥 강도사',
    leaders: [
      { role: '회장', name: '이름' },
      { role: '부회장', name: '이름' },
      { role: '서기', name: '이름' },
    ],
    meetingPlace: '4층 남선교실',
    meetingTime: '매 주일 본 예배 후, 식사 후 오후 2시',
    activities: [
      '정기 모임 및 성경 공부',
      '봉사 활동 및 나눔 실천',
      '친교 활동 및 체육 대회',
      '전도 활동 및 선교 사역',
    ],
  },
  {
    id: 'women',
    title: '여선교',
    path: '/about/group/women',
    image: '/images/group/women.jpg',

    meetingPlace: '본당 1층 2여선교실',
    meetingTime: '매주 수요일 오전 10시',
    activities: ['정기 모임 및 성경 공부', '봉사 활동', '전도 활동'],
    subGroups: [
      {
        id: 'women-1',
        title: '1 여선교',
        description:
          '1여선교는 하나님의 사랑을 나누며 함께 성장하는 공동체입니다. 서로를 품고 섬기며 신앙의 기쁨을 누립니다.',
        pastor: '유정란 전도사',
        leaders: [
          { role: '회장', name: '이름' },
          { role: '부회장', name: '이름' },
        ],
      },
      {
        id: 'women-2',
        title: '2 여선교',
        description:
          '2여선교는 하나님의 말씀으로 세워지며 함께 기도하고 나눔을 실천하는 공동체입니다.',
        pastor: '김미선 전도사',
        leaders: [
          { role: '회장', name: '이름' },
          { role: '부회장', name: '이름' },
          { role: '서기', name: '이름' },
        ],
      },
      {
        id: 'women-3',
        title: '3 여선교',
        description:
          '3여선교는 하나님의 사랑 안에서 함께 성장하며 선교의 열정을 품고 있는 공동체입니다.',
        pastor: '장은연 전도사',
        leaders: [{ role: '회장', name: '이름' }],
      },
      {
        id: 'women-4',
        title: '4 여선교',
        description: '4여선교는 하나님의 은혜를 나누며 함께 기도하고 섬기는 공동체입니다.',
        pastor: '임선의 전도사',
        leaders: [
          { role: '회장', name: '이름' },
          { role: '부회장', name: '이름' },
        ],
      },
    ],
  },
  {
    id: 'youth',
    title: '청년부',
    path: '/about/group/youth',
    image: '/images/group/youth.jpg',
    description: '청년부는 젊은 세대가 하나님의 말씀으로 세워지며 함께 꿈을 키워가는 공동체입니다.',
    pastor: '김하은 전도사',
    leaders: [
      { role: '회장', name: '김다솔' },
      { role: '부회장', name: '전승민' },
      { role: '총무', name: '전혜지' },
      { role: '부장', name: '김혜미' },
    ],
    meetingPlace: '5층 청년부실',
    meetingTime: '매 주일 본 예배 후, 점심 식사 후 오후 2시',
    activities: [
      '정기 모임 및 예배',
      '성경 공부 및 QT',
      '친교 활동 및 MT',
      '봉사 활동',
      '전도 활동',
    ],
  },
  {
    id: 'student',
    title: '예꿈(초·중·고)',
    path: '/about/group/student',
    image: '/images/group/student.jpg',
    leaders: [
      { role: '회장', name: '이름' },
      { role: '부회장', name: '이름' },
    ],
    meetingPlace: '2층 예꿈실',
    meetingTime: '매 주일 본 예배 후, 오후 2시 예꿈 예배 후',
    activities: ['정기 모임 및 예배', '성경 공부', '친교 활동', '체육 활동'],
    subGroups: [
      {
        id: 'student-middle',
        title: '학생부',
        description:
          '학생부는 초·중·고 학생들이 하나님의 말씀으로 세워지며 함께 성장하는 공동체입니다.',
        pastor: '조은애 전도사',
      },
      {
        id: 'student-dream',
        title: '예꿈부',
        description: '예꿈부는 청소년들이 하나님의 꿈을 품고 함께 꿈을 키워가는 공동체입니다.',
        pastor: '김지혜 전도사',
      },
    ],
  },
  {
    id: 'new-family',
    title: '새가족부',
    path: '/about/group/newfamily',
    image: '/images/group/newfamily.jpg',
    description:
      '새가족부는 새롭게 교회에 오신 분들을 따뜻하게 환영하며 함께 성장하는 공동체입니다.',
    pastor: '주애순전도사, 이민아 전도사',
    meetingPlace: '3층 V.VIP실',
    meetingTime: '매 주일 본 예배 후',
    activities: ['새가족 교육 10주 후 수료'],
  },
];
