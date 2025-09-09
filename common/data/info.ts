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
      { name: '담임 목사 소개', href: '/about/pastor' },
      { name: '교회 비전', href: '/about/vision' },
      { name: '교구 소개', href: '/about/group' },
      { name: '섬기는 분들', href: '/about/servant' },
    ],
    content: {
      image: '/main/church-building.jpg',
      title: '순복음인천초대교회',
      description: '하나님의 사랑으로 함께하는 교회',
    },
  },
  {
    name: '예배 안내',
    subMenu: [
      { name: '예배 시간표', href: '/worship/schedule' },
      { name: '말씀과 찬양', href: '/worship/sermon' },
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
      { name: '영상', href: '/info/video' },
      { name: 'SNS', href: '/info/sns' },
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
}

export const contactInfo: ContactInfo = {
  phone1: '032-463-9004',
  phone2: '032-472-9004',
  address: '인천광역시 남동구 호구포로 818 퍼스트하임프라자 6층\n(구월동 1264번지)',
  fax: '032-465-9004',
};

export interface SnsLink {
  name: string;
  href: string;
  icon: string;
}

export const snsLinks: SnsLink[] = [
  { name: 'Band', href: '/', icon: 'sns-band' },
  { name: 'Youtube', href: '/', icon: 'sns-youtube' },
  { name: 'Instagram', href: '/', icon: 'sns-instagram' },
];
