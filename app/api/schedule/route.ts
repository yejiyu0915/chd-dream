import { NextRequest, NextResponse } from 'next/server';
import { getScheduleData } from '@/lib/notion';

export async function GET(_request: NextRequest) {
  try {
    const scheduleData = await getScheduleData();

    return NextResponse.json(scheduleData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // 개발 중 캐시 비활성화
      },
    });
  } catch (error) {
    console.error('일정 데이터 가져오기 실패:', error);

    return NextResponse.json(
      {
        error: '일정 데이터를 가져오는데 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
