import { NextRequest, NextResponse } from 'next/server';
import { getScheduleData } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    const scheduleData = await getScheduleData();
    
    return NextResponse.json(scheduleData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('일정 데이터 가져오기 실패:', error);
    
    return NextResponse.json(
      { 
        error: '일정 데이터를 가져오는데 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
