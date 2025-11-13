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
      { name: '교회 연혁', href: '/about/history' },
      { name: '교회 비전(to-be)', href: '/about/vision' },
      { name: '담임 목사 소개(to-be)', href: '/about/pastor' },
      { name: '교구 소개(준비중)', href: '' },
      { name: '섬기는 분들(준비중)', href: '' },
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
      { name: '생명의 말씀', href: '/worship/sermon' },
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
  phone1: '032-463-9004',
  phone2: '032-441-0176',
  address: '21552 인천 남동구 문화로 227 (간석동, 행복으로가는교회)',
  fax: '032-465-9004',
  name: '행복으로가는교회',
  denomination: '기독교대한하나님의성회(순복음)',
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
