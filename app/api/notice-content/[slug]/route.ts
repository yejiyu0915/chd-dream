import { getNotionPageAndContentBySlug } from '@/lib/notion';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await getNotionPageAndContentBySlug('NOTION_NOTICE_ID', slug);

    if (!result) {
      return Response.json({ error: '공지사항 페이지를 찾을 수 없습니다.' }, { status: 404 });
    }

    const { page, blocks } = result;

    // 블록 데이터를 클라이언트에서 사용할 수 있는 형태로 변환
    const processedBlocks = blocks.map((block) => {
      // 기본 블록 정보
      const baseBlock = {
        id: block.id,
        type: block.type,
      };

      // 블록 타입별로 필요한 데이터만 추출
      switch (block.type) {
        case 'paragraph':
          return {
            ...baseBlock,
            content: block.paragraph?.rich_text?.map((text: any) => text.plain_text).join('') || '',
          };
        case 'heading_1':
          return {
            ...baseBlock,
            content: block.heading_1?.rich_text?.map((text: any) => text.plain_text).join('') || '',
          };
        case 'heading_2':
          return {
            ...baseBlock,
            content: block.heading_2?.rich_text?.map((text: any) => text.plain_text).join('') || '',
          };
        case 'heading_3':
          return {
            ...baseBlock,
            content: block.heading_3?.rich_text?.map((text: any) => text.plain_text).join('') || '',
          };
        case 'bulleted_list_item':
          return {
            ...baseBlock,
            content:
              block.bulleted_list_item?.rich_text?.map((text: any) => text.plain_text).join('') ||
              '',
          };
        case 'numbered_list_item':
          return {
            ...baseBlock,
            content:
              block.numbered_list_item?.rich_text?.map((text: any) => text.plain_text).join('') ||
              '',
          };
        case 'quote':
          return {
            ...baseBlock,
            content: block.quote?.rich_text?.map((text: any) => text.plain_text).join('') || '',
          };
        case 'code':
          return {
            ...baseBlock,
            content: block.code?.rich_text?.map((text: any) => text.plain_text).join('') || '',
            language: block.code?.language || 'plain',
          };
        case 'image':
          return {
            ...baseBlock,
            url:
              block.image?.type === 'external'
                ? block.image.external.url
                : block.image?.type === 'file'
                  ? `/api/notion-image?pageId=${page.id}&blockId=${block.id}`
                  : '',
            caption: block.image?.caption?.map((text: any) => text.plain_text).join('') || '',
          };
        default:
          return baseBlock;
      }
    });

    const responseData = {
      page: {
        id: page.id,
        title: page.properties?.Title?.title?.[0]?.plain_text || '제목 없음',
        date: page.properties?.Date?.date?.start || '',
        slug: slug,
      },
      blocks: processedBlocks,
    };

    return Response.json(responseData);
  } catch {
    return Response.json({ error: '공지사항 컨텐츠를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
