export interface PageMeta {
  title?: string;
  description: string;
}

export const pageMeta: Record<string, PageMeta> = {
  '/info/news': {
    title: 'NEWS',
    description: '교회의 새로운 소식과 업데이트를 전해드립니다.',
  },
  '/info/c-log': {
    title: 'C-log',
    description: '교회의 다양한 이야기를 만나보세요.',
  },
  '/info/notice': {
    title: '공지사항',
    description: '교회의 공지사항을 전해드립니다.',
  },
  '/info/schedule': {
    title: '일정',
    description: '교회의 다양한 일정과 행사를 확인하세요.',
  },
  '/worship/timetable': {
    title: '예배 안내',
    description: '예배 시간표를 확인하세요.',
  },
  '/worship/bulletin': {
    title: '온라인 주보',
    description: '주보 내용을 간단하게 확인하세요.',
  },
  '/worship/sermon': {
    title: '생명의 말씀',
    description: '하나님의 말씀을 나눕니다.',
  },
  '/location': {
    title: '오시는 길',
    description: '행복으로가는교회로 찾아오시는 길을 안내합니다.',
  },
  '/about': {
    title: '교회 소개',
    description: '행복으로가는교회를 소개합니다.',
  },
  '/about/history': {
    title: '교회 연혁',
    description: '행복으로가는교회의 발자취를 소개합니다.',
  },
  // 여기에 추가적인 페이지들의 메타데이터를 정의합니다.
};
