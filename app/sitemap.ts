import { MetadataRoute } from 'next';
import { getNewsData, getNoticeData, getCLogData, getBulletinListData } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 배포 시 실제 도메인으로 교체 필요 (환경변수 사용)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // About 페이지
    {
      url: `${baseUrl}/about/vision`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/pastor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/servant`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/group`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/group/newfamily`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/group/youth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/group/student`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/group/women`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/group/men`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Worship 페이지
    {
      url: `${baseUrl}/worship/timetable`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/worship/sermon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/worship/bulletin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Info 페이지
    {
      url: `${baseUrl}/info/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/info/notice`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/info/c-log`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/info/schedule`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Location 페이지
    {
      url: `${baseUrl}/location`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  try {
    // 동적 페이지들 (Notion에서 가져오기)
    const [newsItems, noticeItems, clogItems, bulletinItems] = await Promise.all([
      getNewsData(),
      getNoticeData(),
      getCLogData(),
      getBulletinListData(),
    ]);

    // 뉴스 페이지
    const newsPages: MetadataRoute.Sitemap = newsItems.map((item) => ({
      url: `${baseUrl}/info/news/${item.slug}`,
      lastModified: item.rawDate ? new Date(item.rawDate) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // 공지사항 페이지
    const noticePages: MetadataRoute.Sitemap = noticeItems.map((item) => ({
      url: `${baseUrl}/info/notice/${item.slug}`,
      lastModified: item.rawDate ? new Date(item.rawDate) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // C-Log 페이지
    const clogPages: MetadataRoute.Sitemap = clogItems.map((item) => ({
      url: `${baseUrl}/info/c-log/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // 주보 페이지는 slug를 사용하지 않고 id를 사용하는 것으로 보임
    // 주보 상세 페이지가 있는지 확인 필요
    const bulletinPages: MetadataRoute.Sitemap = bulletinItems.map((item) => ({
      url: `${baseUrl}/worship/bulletin/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...newsPages, ...noticePages, ...clogPages, ...bulletinPages];
  } catch (error) {
    // Notion API 에러 시 정적 페이지만 반환
    console.error('Sitemap generation error:', error);
    return staticPages;
  }
}









