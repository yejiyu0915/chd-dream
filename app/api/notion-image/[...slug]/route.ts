import { Client } from '@notionhq/client'; // Notion Client 임포트
// import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
// import type { GetPagePropertyResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(
  request: Request,
  { params: _params }: { params: { slug: string[] } } // params를 _params로 변경
) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId') || '';
  const imageType = searchParams.get('type'); // 'cover' 또는 'property'
  const propertyId = searchParams.get('propertyId');

  let imageUrlToFetch: string | null = null;
  let cacheControlHeader = 'public, max-age=31536000, immutable'; // 기본 캐시 설정

  try {
    if (!pageId) {
      return new Response('Page ID is missing.', { status: 400 });
    }

    // 페이지 정보 가져오기
    const page = await notion.pages.retrieve({
      page_id: pageId,
    });
    const pageProperties = page.properties as any;

    if (imageType === 'cover') {
      const cover = (page as any).cover;
      if (cover) {
        if (cover.type === 'external') {
          imageUrlToFetch = cover.external.url;
        } else if (cover.type === 'file') {
          imageUrlToFetch = cover.file.url;
          cacheControlHeader = 'no-store, no-cache, must-revalidate'; // Notion secure files for 1 minute
        }
      }
    } else if (imageType === 'property' && propertyId) {
      const property = pageProperties[propertyId];
      if (property && property.type === 'files' && property.files.length > 0) {
        const file = property.files[0];
        if (file.type === 'external') {
          imageUrlToFetch = file.external.url;
        } else if (file.type === 'file') {
          imageUrlToFetch = file.file.url;
          cacheControlHeader = 'no-store, no-cache, must-revalidate'; // Notion secure files for 1 minute
        }
      }
    } else {
      return new Response('Invalid image type or missing property ID.', { status: 400 });
    }

    if (!imageUrlToFetch) {
      return new Response('Image URL not found.', { status: 404 });
    }

    const response = await fetch(imageUrlToFetch);

    if (!response.ok) {
      return new Response('Failed to fetch image from Notion.', { status: 500 });
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Cache-Control': cacheControlHeader,
      },
    });
  } catch (_error: unknown) {
    // error를 _error: unknown으로 변경
    void _error; // 사용되지 않는 변수 경고 해결
    return new Response('Internal Server Error.', { status: 500 });
  }
}
