import { getCLogData } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

/**
 * 추천글 전용 경량 API
 * 필요한 필드만 반환하여 응답 크기 최소화
 * Next.js 캐시 + 브라우저 캐시 이중 적용
 */
interface RecommendedPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  imageUrl: string;
  imageAlt: string;
}

// 전역 인메모리 캐시 (추천글 전용)
const recommendedCache = new Map<string, { data: RecommendedPost[]; timestamp: number }>();
const RECOMMENDED_CACHE_TTL = 10 * 60 * 1000; // 10분

export async function GET(request: NextRequest) {
  const cacheKey = 'clog-recommended';
  const now = Date.now();

  // 인메모리 캐시 확인 (가장 빠름)
  const cached = recommendedCache.get(cacheKey);
  if (cached && now - cached.timestamp < RECOMMENDED_CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5분 브라우저 캐시, 10분 CDN 캐시
        'Content-Type': 'application/json',
      },
    });
  }

  // Next.js 캐시 사용
  const cachedFn = unstable_cache(
    async () => {
      // 전체 데이터 가져오기 (캐시 활용)
      const allPosts = await getCLogData();
      
      // 필요한 필드만 추출하여 응답 크기 최소화
      const recommendedPosts: RecommendedPost[] = allPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        tags: post.tags,
        date: post.date,
        imageUrl: post.imageUrl,
        imageAlt: post.imageAlt,
      }));
      
      return recommendedPosts;
    },
    ['clog-recommended'],
    {
      revalidate: 600, // 10분
      tags: ['clog-recommended', 'clog-data'],
    }
  );

  try {
    const data = await cachedFn();
    
    // 인메모리 캐시에 저장
    recommendedCache.set(cacheKey, {
      data,
      timestamp: now,
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5분 브라우저 캐시, 10분 CDN 캐시
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('추천글 데이터 가져오기 실패:', error);
    return NextResponse.json(
      { message: 'C-Log 추천글 데이터를 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
