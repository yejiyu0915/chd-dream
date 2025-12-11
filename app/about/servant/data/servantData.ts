// 섬기는분들 페이지 데이터 관리

// 이미지 경로 관리
const IMAGE_BASE_PATH = '/images/servant';

// 이미지 파일명 매핑 (id를 키로 사용)
const servantImages: Record<string, string> = {
  // 'pastor-1': '00.png', // 김영구
  'pastor-2': '01.png', // 김선숙
  'pastor-3': '02.jpg', // 김준섭
  'license-pastor-1': '12.jpg', // 송순옥
  'evangelist-1': '11.jpg', // 유정란
  'evangelist-2': '04.png', // 김미선
  'evangelist-3': '10.jpg', // 장은연
  'evangelist-4': '05.png', // 임선의
  'evangelist-5': '07.jpg', // 김하은
  'evangelist-6': '08.jpg', // 조은애
  'evangelist-7': '09.png', // 김지혜
  'evangelist-8': '03.png', // 주애순
  'evangelist-9': '13.png', // 이민아
};

// 이미지 경로 가져오기 헬퍼 함수
export function getServantImage(id: string): string | undefined {
  const filename = servantImages[id];
  return filename ? `${IMAGE_BASE_PATH}/${filename}` : undefined;
}

// 담당 교구와 교구소개 페이지 링크 매핑
const departmentLinkMap: Record<string, string> = {
  남선교: '/about/group/men',
  '1여선교': '/about/group/women',
  '2여선교': '/about/group/women',
  '3여선교': '/about/group/women',
  '4여선교': '/about/group/women',
  청년부: '/about/group/youth',
  학생부: '/about/group/student',
  예꿈부: '/about/group/student',
  새가족부: '/about/group/newfamily',
};

// 교구소개 링크 가져오기 헬퍼 함수
export function getDepartmentLink(department?: string): string | undefined {
  if (!department) return undefined;
  return departmentLinkMap[department];
}

// 섬기는분 정보 타입
export interface ServantType {
  id: string; // 고유 ID
  name: string; // 이름
  category: '총무목사' | '부목사' | '강도사' | '전도사'; // 카테고리
  department?: string; // 담당 교구 (있는 경우만)
  image?: string; // 이미지 경로 (자동으로 설정됨)
  groupLink?: string; // 교구소개 페이지 링크 (자동으로 설정됨)
}

// 카테고리별로 그룹화된 데이터
export const servantData: ServantType[] = [
  // 담임목사
  // {
  //   id: 'pastor-1',
  //   name: '김영구 목사',
  //   category: '담임목사',
  //   image: getServantImage('pastor-1'),
  // },
  // 총무목사
  {
    id: 'pastor-2',
    name: '김선숙 목사',
    category: '총무목사',
    image: getServantImage('pastor-2'),
  },
  // 부목사
  {
    id: 'pastor-3',
    name: '김준섭 목사',
    category: '부목사',
    image: getServantImage('pastor-3'),
  },
  // 강도사
  {
    id: 'license-pastor-1',
    name: '송순옥 강도사',
    category: '강도사',
    department: '남선교',
    image: getServantImage('license-pastor-1'),
    groupLink: getDepartmentLink('남선교'),
  },
  // 전도사
  {
    id: 'evangelist-1',
    name: '유정란 전도사',
    category: '전도사',
    department: '1여선교',
    image: getServantImage('evangelist-1'),
    groupLink: getDepartmentLink('1여선교'),
  },
  {
    id: 'evangelist-2',
    name: '김미선 전도사',
    category: '전도사',
    department: '2여선교',
    image: getServantImage('evangelist-2'),
    groupLink: getDepartmentLink('2여선교'),
  },
  {
    id: 'evangelist-3',
    name: '장은연 전도사',
    category: '전도사',
    department: '3여선교',
    image: getServantImage('evangelist-3'),
    groupLink: getDepartmentLink('3여선교'),
  },
  {
    id: 'evangelist-4',
    name: '임선의 전도사',
    category: '전도사',
    department: '4여선교',
    image: getServantImage('evangelist-4'),
    groupLink: getDepartmentLink('4여선교'),
  },
  {
    id: 'evangelist-5',
    name: '김하은 전도사',
    category: '전도사',
    department: '청년부',
    image: getServantImage('evangelist-5'),
    groupLink: getDepartmentLink('청년부'),
  },
  {
    id: 'evangelist-6',
    name: '조은애 전도사',
    category: '전도사',
    department: '학생부',
    image: getServantImage('evangelist-6'),
    groupLink: getDepartmentLink('학생부'),
  },
  {
    id: 'evangelist-7',
    name: '김지혜 전도사',
    category: '전도사',
    department: '예꿈부',
    image: getServantImage('evangelist-7'),
    groupLink: getDepartmentLink('예꿈부'),
  },
  {
    id: 'evangelist-8',
    name: '주애순 전도사',
    category: '전도사',
    department: '새가족부',
    image: getServantImage('evangelist-8'),
    groupLink: getDepartmentLink('새가족부'),
  },
  {
    id: 'evangelist-9',
    name: '이민아 전도사',
    category: '전도사',
    department: '새가족부',
    image: getServantImage('evangelist-9'),
    groupLink: getDepartmentLink('새가족부'),
  },
];

// 카테고리별 순서 정의
export const categoryOrder: ServantType['category'][] = [
  // '담임목사',
  '총무목사',
  '부목사',
  '강도사',
  '전도사',
];

// 카테고리별로 그룹화하는 함수
export function groupServantsByCategory(servants: ServantType[]) {
  const grouped: Record<ServantType['category'], ServantType[]> = {
    // 담임목사: [],
    총무목사: [],
    부목사: [],
    강도사: [],
    전도사: [],
  };

  servants.forEach((servant) => {
    grouped[servant.category].push(servant);
  });

  return grouped;
}
