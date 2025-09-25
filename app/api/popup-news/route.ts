import { getNewsData } from '@/lib/notion';
import { type NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const data = await getPopupNewsData();

    // 항상 데이터를 반환하되, null이면 빈 객체로
    const responseData = data || {};

    return Response.json(responseData);
  } catch {
    return Response.json(
      { error: '팝업 뉴스 데이터를 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 팝업 뉴스 데이터를 가져오는 함수
async function getPopupNewsData() {
  try {
    // 모든 뉴스 데이터 가져오기
    const allNewsData = await getNewsData();

    // 현재 시간
    const now = new Date();

    // 팝업 조건에 맞는 뉴스 필터링
    const popupNews = allNewsData.filter((news) => {
      // 1. popup이 true인 뉴스만
      if (!news.popup) {
        return false;
      }

      // 2. popupStartDate가 설정되어 있으면 현재 시간이 시작 시간 이후여야 함
      if (news.popupStartDate) {
        const startDate = new Date(news.popupStartDate);
        if (now < startDate) {
          return false;
        }
      }

      // 3. popupEndDate가 설정되어 있으면 현재 시간이 종료 시간 이전이어야 함
      if (news.popupEndDate) {
        const endDate = new Date(news.popupEndDate);
        if (now > endDate) {
          return false;
        }
      }

      return true;
    });

    // 팝업 뉴스가 없으면 null 반환
    if (popupNews.length === 0) {
      return null;
    }

    // 팝업 뉴스가 여러 개인 경우 우선순위에 따라 정렬
    popupNews.sort((a, b) => {
      // 1. popupEndDate가 가장 늦은 것 우선
      if (a.popupEndDate && b.popupEndDate) {
        const aEndDate = new Date(a.popupEndDate);
        const bEndDate = new Date(b.popupEndDate);
        if (aEndDate.getTime() !== bEndDate.getTime()) {
          return bEndDate.getTime() - aEndDate.getTime(); // 내림차순 (늦은 것이 먼저)
        }
      } else if (a.popupEndDate && !b.popupEndDate) {
        return -1; // a가 종료일이 있으면 우선
      } else if (!a.popupEndDate && b.popupEndDate) {
        return 1; // b가 종료일이 있으면 우선
      }

      // 2. popupEndDate가 같거나 둘 다 없으면 Date가 가장 최신인 것 우선
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate.getTime() - aDate.getTime(); // 내림차순 (최신이 먼저)
    });

    // 가장 우선순위가 높은 뉴스 하나만 반환
    const selectedNews = popupNews[0];
    return selectedNews;
  } catch {
    return null;
  }
}
