import { getNewsData, getNoticeData } from '@/lib/notion';
import { type NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const data = await getPopupData();

    // 항상 데이터를 반환하되, null이면 빈 객체로
    const responseData = data || {};

    return Response.json(responseData);
  } catch {
    return Response.json({ error: '팝업 데이터를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}

// 팝업 데이터를 가져오는 함수 (News + Notice 통합)
async function getPopupData() {
  try {
    // News와 Notice 데이터를 모두 가져오기
    const [allNewsData, allNoticeData] = await Promise.all([getNewsData(), getNoticeData()]);

    // 현재 시간
    const now = new Date();

    // 팝업 조건에 맞는 데이터 필터링 (News + Notice)
    const allPopupData = [...allNewsData, ...allNoticeData].filter((item) => {
      // 1. popup이 true인 항목만
      if (!item.popup) {
        return false;
      }

      // 2. popupStartDate가 설정되어 있으면 현재 시간이 시작 시간 이후여야 함
      if (item.popupStartDate && item.popupStartDate.trim() !== '') {
        const startDate = new Date(item.popupStartDate);
        if (now < startDate) {
          return false;
        }
      }

      // 3. 팝업 종료 날짜 체크
      let endDate: Date;

      if (item.popupEndDate && item.popupEndDate.trim() !== '') {
        // 명시적으로 종료 날짜가 설정된 경우
        endDate = new Date(item.popupEndDate);
      } else {
        // 종료 날짜가 설정되지 않은 경우, 작성일로부터 7일 후로 설정
        if (item.rawDate) {
          const itemDate = new Date(item.rawDate);
          endDate = new Date(itemDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 후
        } else {
          // rawDate가 없는 경우 현재 시간으로부터 7일 후로 설정
          endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
      }

      if (now > endDate) {
        return false;
      }

      return true;
    });

    // 팝업 데이터가 없으면 null 반환
    if (allPopupData.length === 0) {
      return null;
    }

    // 팝업 데이터가 여러 개인 경우 우선순위에 따라 정렬
    allPopupData.sort((a, b) => {
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
      const aDate = new Date(a.rawDate || a.date);
      const bDate = new Date(b.rawDate || b.date);
      return bDate.getTime() - aDate.getTime(); // 내림차순 (최신이 먼저)
    });

    // 가장 우선순위가 높은 항목 하나만 반환
    const selectedItem = allPopupData[0];
    return selectedItem;
  } catch {
    return null;
  }
}
