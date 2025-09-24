import { getNotionPageAndContentBySlug } from '@/lib/notion';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    console.log('📄 뉴스 컨텐츠 API 시작, slug:', params.slug);

    const result = await getNotionPageAndContentBySlug('NOTION_NEWS_ID', params.slug);

    if (!result) {
      console.log('❌ 뉴스 페이지를 찾을 수 없음');
      return Response.json({ error: '뉴스 페이지를 찾을 수 없습니다.' }, { status: 404 });
    }

    const { page, blocks } = result;
    console.log('✅ 뉴스 페이지 및 블록 데이터 가져오기 성공');

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
        slug: params.slug,
      },
      blocks: processedBlocks,
    };

    console.log('📤 뉴스 컨텐츠 응답 데이터 준비 완료');
    return Response.json(responseData);
  } catch (error) {
    console.error('💥 뉴스 컨텐츠 API 오류:', error);
    return Response.json({ error: '뉴스 컨텐츠를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
