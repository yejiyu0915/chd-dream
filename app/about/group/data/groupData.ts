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
    // image: '/images/group/men.jpg',
    description:
      '남선교는 하나님의 사랑을 나누며 함께 성장하는 공동체입니다. 서로를 품고 섬기며 신앙의 기쁨을 누립니다.',
    pastor: '송순옥 강도사',
    leaders: [
      { role: '회장', name: '이름' },
      { role: '부회장', name: '이름' },
      { role: '총무', name: '이름' },
    ],
    meetingPlace: '4층 남선교실',
    meetingTime: '매 주일 본 예배 후, 식사 후 오후 2시',
  },
  {
    id: 'women',
    title: '여선교',
    path: '/about/group/women',
    // image: '/images/group/women.jpg',

    meetingPlace: '본당 4층, 3층 세미나실, 2층 여선교실',
    meetingTime: '매 주일 본 예배 후, 점심 식사 후 오후 2시',
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
          { role: '총무', name: '이름' },
        ],
      },
      {
        id: 'women-2',
        title: '2 여선교',
        description: `행복으로가는교회 제 2여선교는요 ! <br /> 삶으로 예배하고 삶으로 순종하는 교구입니다. <br /> 하나님의 말씀으로 서로를 격려하고 함께 기도함으로 시험을 이기며 믿음으로 단단해지는 공동체입니다. <br /> 교회의 각종 행사에 즐겁게 헌신함으로 교제하는 믿음의 교구입니다!`,
        pastor: '김미선 전도사',
        leaders: [
          { role: '회장', name: '이름' },
          { role: '부회장', name: '이름' },
          { role: '총무', name: '이름' },
        ],
      },
      {
        id: 'women-3',
        title: '3 여선교',
        description:
          '3여선교는 하나님의 사랑 안에서 함께 성장하며 선교의 열정을 품고 있는 공동체입니다.',
        pastor: '장은연 전도사',
        leaders: [
          { role: '회장', name: '이름' },
          { role: '부회장', name: '이름' },
          { role: '총무', name: '이름' },
        ],
      },
      {
        id: 'women-4',
        title: '4 여선교',
        description: `행복으로가는교회 제 4여선교는 사랑을 실천하고 헌신으로 섬기며, 나눔과 봉사를 통해 이웃에게 그리스도의 마음을 전하는 공동체입니다. <br /> 서로 함께 걸으며 행복을 나누고, 깊은 신앙 안에서 하나 되어 하나님 나라를 이루어 가고자 합니다. <br /> 앞으로도 사랑과 섬김의 발걸음을 멈추지 않고 교회와 지역사회를 위해 기도로 동행하겠습니다.`,
        pastor: '임선의 전도사',
        leaders: [
          { role: '회장', name: '윤순덕' },
          { role: '부회장', name: '이연' },
          { role: '총무', name: '강혜진' },
        ],
      },
    ],
  },
  {
    id: 'youth',
    title: '청년부',
    path: '/about/group/youth',
    // image: '/images/group/youth.jpg',
    description: `
      행복으로가는교회 청년부는요~! <br />
      <br />
      <span style="color:var(--accent-brand); font-weight: 900;">하나!</span> 믿음이 가득한 청년부<br />
      <p style="padding-left: 2.35em;">
      주일 예배와 기도 모임을 통해 신앙 안에서 함께 성장하고,<br />
      각종 행사와 다양한 활동과 사역을 통해 서로를 세워주는 청년부 <br />
      </p>
      <br />
      <span style="color:var(--accent-brand); font-weight: 900;">두울!</span> 행복으로 함께하는 청년부<br />
      <p style="padding-left: 2.35em;">
      함께하는 웃음이 있고, 서로를 생각하는 따뜻하고 진실한 우정이 있는 청년부<br />
      공동체로 혼자가 아닌, 서로 연결된 동역자로서 예배도 말씀도 삶도 함께 걸어가는 청년부<br />
      </p>
      <br />
      우리 청년부는 함께 행복하고, 함께 웃고, 함께 성장하며 신앙을 세워갑니다.<br />
      <br />
    `,
    pastor: '김하은 전도사',
    leaders: [
      { role: '회장', name: '김다솔' },
      { role: '부회장', name: '전승민' },
      { role: '총무', name: '전혜지' },
      { role: '부장', name: '김혜미' },
    ],
    meetingPlace: '5층 청년부실',
    meetingTime: '매 주일 본 예배 후, 점심 식사 후 오후 2시',
  },
  {
    id: 'student',
    title: '예꿈(초·중·고)',
    path: '/about/group/student',
    // image: '/images/group/student.jpg',
    description: `
      유아부터 고등학생까지 미성년 친구들이 모여 하나님의 사랑 안에서 믿음으로 함께 성장해나가는 예수님의 꿈나무입니다!<br />
      <br />
      행복으로가는교회 예꿈은요,<br />
      <br />
      <span style="color:var(--accent-brand); font-weight: 900;">하나!</span> 하나님의 사랑 안에서 자라나는 다음 세대 교구로<br />
      <p style="padding-left: 2.35em;">
      유아부터 고등부까지 함께 모여 예배드리며 말씀을 배우고 <br />
      기쁘게 순종함으로 함께 믿음을 키워가는 신앙 공동체입니다!
      </p>
      <br />
      <span style="color:var(--accent-brand); font-weight: 900;">두울!</span> 뜨거운 찬양과 기도, 즐거운 교제를 통해<br />
      <p style="padding-left: 2.35em;">
      하나님 사랑을 알아가고 믿음 안에서 서로 격려하며 <br />
      즐겁게 신앙생활할 수 있도록 돕는 선한 영향력을 가진 모임입니다!
      </p>
      <br />
      우리 교구는 하나님의 사랑 안에서 하나되어 나아가<br />
      세상에도 선한 영향력으로 하나님의 사랑을 전하는 거룩한 무리입니다!<br />
    `,
    leaders: [
      { role: '회장', name: '이름' },
      { role: '부회장', name: '이름' },
    ],
    meetingPlace: '본당 5층, 본당 4층, 2층 예꿈실',
    meetingTime: '매 주일 본 예배 후, 오후 2시 예꿈 예배 후',
    subGroups: [
      {
        id: 'student-middle',
        title: '학생부',
        pastor: '조은애 전도사',
      },
      {
        id: 'student-dream',
        title: '예꿈부',
        pastor: '김지혜 전도사',
      },
    ],
  },
  {
    id: 'new-family',
    title: '새가족부',
    path: '/about/group/newfamily',
    // image: '/images/group/newfamily.jpg',
    description:
      '새가족부는 행복으로가는교회에 새롭게 오신 분들을 따뜻하게 환영하며 함께 성장하는 공동체입니다.',
    pastor: '주애순 전도사, 이민아 전도사',
    meetingPlace: '3층 V.VIP실',
    meetingTime: '매 주일 본 예배 후',
    activities: ['새가족 교육 9주 후 수료', '10주차 수료식'],
  },
];
