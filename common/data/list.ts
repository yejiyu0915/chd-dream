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
  // 여기에 추가적인 info 페이지들의 메타데이터를 정의합니다.
};
