import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Image URL is missing', { status: 400 });
  }

  try {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', // 요청 헤더 추가
        Referer: 'https://www.notion.so', // Notion Referer 헤더 추가
      },
    });

    if (!imageResponse.ok) {
      const errorBody = await imageResponse.text();
      console.error(
        `[Image Proxy DEBUG] Failed to fetch image from Notion: ${imageResponse.status} ${imageResponse.statusText}, Content-Type: ${imageResponse.headers.get('content-type')}, Body: ${errorBody}`
      );
      return new NextResponse('Failed to fetch image', { status: 500 });
    }

    const contentType = imageResponse.headers.get('content-type');
    const arrayBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable', // 이미지 캐싱 설정
      },
    });
  } catch (error) {
    console.error('Error proxying Notion image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
