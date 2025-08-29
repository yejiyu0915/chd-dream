import { NextResponse } from 'next/server';
import { getCLogData } from '@/lib/notion';

export async function GET() {
  try {
    const data = await getCLogData();
    return NextResponse.json(data);
  } catch (error) {
    // getCLogData 내부의 에러 로그가 이미 터미널에 찍힙니다.
    // 여기서는 클라이언트에 보낼 에러 메시지를 설정합니다.
    return NextResponse.json(
      { error: 'Notion 데이터를 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
