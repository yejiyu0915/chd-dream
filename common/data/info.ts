interface SubMenuItem {
  name: string;
  href: string;
}

interface MenuContent {
  image: string;
  title: string;
  description: string;
}

export interface MenuItem {
  name: string;
  href?: string;
  subMenu?: SubMenuItem[];
  content?: MenuContent;
}

export const menuData: MenuItem[] = [
  {
    name: '교회 소개',
    subMenu: [
      { name: '교회를 통한 축복', href: '/about/blessing' },
      // { name: '교회 연혁', href: '/about/history' },
      { name: '교회 비전', href: '/about/vision' },
      { name: '담임 목사님 인사말', href: '/about/pastor' },
      { name: '교구 소개', href: '/about/group' },
      { name: '섬기는 분들 ', href: '/about/servant' },
      // { name: '교구 소개(준비중)', href: '/about/group' },
      // { name: '섬기는 분들(준비중)', href: '/about/servant' },
      // { name: '활동 안내(to-be)', href: '/about/activity' },
      // { name: '시설 안내(to-be)', href: '/about/facility' },
    ],
    content: {
      image: '/main/church-building.jpg',
      title: '행복으로가는교회',
      description: '하나님의 사랑으로 함께하는 교회',
    },
  },
  {
    name: '예배 안내',
    subMenu: [
      { name: '예배 시간표', href: '/worship/timetable' },
      { name: '온라인 주보', href: '/worship/bulletin' },
      // { name: '생명의 말씀', href: '/worship/sermon' },
    ],
    content: {
      image: '/main/worship.jpg',
      title: '예배로 하나님을 찬양합니다',
      description: '말씀과 찬양으로 영혼을 새롭게',
    },
  },
  {
    name: '교회 소식',
    subMenu: [
      { name: 'NEWS', href: '/info/news' },
      { name: 'C-log', href: '/info/c-log' },
      // { name: '영상(to-be)', href: '/info/video' },
      // { name: 'SNS(to-be)', href: '/info/sns' },
      { name: '일정', href: '/info/schedule' },
      { name: '공지사항', href: '/info/notice' },
    ],
    content: {
      image: '/main/news.jpg',
      title: '교회의 소식을 전합니다',
      description: '함께 나누는 기쁨과 감사',
    },
  },
];

export interface ContactInfo {
  phone1: string;
  phone2: string;
  address: string;
  fax: string;
  denomination: string;
  name: string;
}

export const contactInfo: ContactInfo = {
  phone1: '032-472-9004',
  phone2: '032-463-9004',
  address: '21552 인천 남동구 문화로 227 (간석동, 행복으로가는교회)',
  fax: '032-465-9004',
  name: '행복으로가는교회',
  denomination: '순복음(기독교대한하나님의성회)',
};

export interface SnsLink {
  name: string;
  href: string;
  icon: string;
  disabled?: boolean; // 준비중인 SNS 링크 표시용
}

export const snsLinks: SnsLink[] = [
  { name: 'Band', href: 'https://band.us/band/5843149', icon: 'sns-band' },
  {
    name: 'Youtube',
    href: '',
    icon: 'sns-youtube',
    disabled: true, // 준비중
  },
  { name: 'Instagram', href: '', icon: 'sns-instagram', disabled: true }, // 준비중
];

export interface PrevInfo {
  name: string;
  links: SnsLink[];
}

export const prevLinks: PrevInfo[] = [
  {
    name: '(구)행복으로가는교회',
    links: [
      { name: 'Homepage', href: 'http://gohappy.onmam.co.kr/', icon: 'sns-link' },
      {
        name: 'Youtube',
        href: 'https://youtube.com/channel/UCsFxe1pefLTHrn5SunTklcw',
        icon: 'sns-youtube',
      },
    ],
  },
  {
    name: '(구)순복음인천초대교회',
    links: [
      { name: 'Band', href: 'https://band.us/band/5843149', icon: 'sns-band' },
      {
        name: 'Youtube',
        href: 'https://youtube.com/channel/UCMxS1A66oRGM6038-6m52uA',
        icon: 'sns-youtube',
      },
      { name: 'Instagram', href: 'https://www.instagram.com/chd_dream', icon: 'sns-instagram' },
    ],
  },
];

// 메뉴 경로 매핑
export const menuPathMap: Record<string, string> = {
  NEWS: '/info/news',
  'C-log': '/info/c-log',
  공지사항: '/info/notice',
  영상: '/info/video',
  SNS: '/info/sns',
  일정: '/info/schedule',
};

// 메뉴 이름으로 경로 가져오기
export function getMenuPath(menuName: string): string {
  return menuPathMap[menuName] || '/';
}

// QuickLink 아이템 인터페이스
export interface QuickLinkItem {
  title: string;
  icon: string;
  href: string;
  description: string;
  size?: 'lg'; // lg 사이즈 여부
  disabled?: boolean; // 준비중 여부
}

// QuickLink 데이터 (2x2 그리드 구조)
export const quickLinkData: QuickLinkItem[][] = [
  [
    {
      title: '예배 안내',
      icon: 'book',
      href: '/worship/timetable',
      description: '주일 예배, 예꿈 예배, 평일 기도회 일정을 안내합니다.',
      size: 'lg',
    },
    {
      title: '교구 소개',
      icon: 'users',
      href: '/about/group',
      description: '교구 소개와 교구 활동을 확인할 수 있습니다.',
    },
  ],
  [
    {
      title: '교회 일정',
      icon: 'calendar',
      href: '/info/schedule',
      description: '교회의 주요 일정을 확인할 수 있습니다.',
    },
    {
      title: '오시는 길',
      icon: 'map',
      href: '/location',
      description: '교회 주소 및 교회까지 오시는 대중교통 정보를 확인할 수 있습니다.',
      size: 'lg',
    },
  ],
];
