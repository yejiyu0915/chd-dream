import { getNotionPageAndContentBySlug } from '@/lib/notion';
import { extractPageMetadata, processNotionBlocks } from '@/lib/notionUtils';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await getNotionPageAndContentBySlug('NOTION_NEWS_ID', slug);

    if (!result) {
      return Response.json({ error: '뉴스 페이지를 찾을 수 없습니다.' }, { status: 404 });
    }

    const { page, blocks } = result;

    // 공통 함수 사용
    const processedBlocks = processNotionBlocks(blocks, page.id);
    const pageMetadata = extractPageMetadata(page, slug);

    const responseData = {
      page: pageMetadata,
      blocks: processedBlocks,
    };

    return Response.json(responseData);
  } catch {
    return Response.json({ error: '뉴스 컨텐츠를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
